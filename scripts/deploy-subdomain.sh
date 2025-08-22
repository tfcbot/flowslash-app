#!/bin/bash

# Exit on any error
set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Vercel CLI is installed
if ! command -v vercel &> /dev/null; then
    print_error "Vercel CLI is not installed. Installing now..."
    bun add -g vercel
fi

# Generate random UUID for subdomain
generate_uuid() {
    if command -v uuidgen &> /dev/null; then
        uuidgen | tr '[:upper:]' '[:lower:]' | tr -d '-'
    elif command -v python3 &> /dev/null; then
        python3 -c "import uuid; print(str(uuid.uuid4()).replace('-', ''))"
    elif command -v node &> /dev/null; then
        node -e "console.log(require('crypto').randomUUID().replace(/-/g, ''))"
    else
        # Fallback: generate random string
        cat /dev/urandom | tr -dc 'a-z0-9' | fold -w 32 | head -n 1
    fi
}

# Generate subdomain
SUBDOMAIN=$(generate_uuid)
FULL_DOMAIN="${SUBDOMAIN}.flowslash.link"

print_status "Generated subdomain: ${FULL_DOMAIN}"

# Check if user is logged in to Vercel
if ! vercel whoami &> /dev/null; then
    print_warning "You need to login to Vercel first"
    vercel login
fi

# Deploy to Vercel with custom domain
print_status "Deploying to Vercel..."

# Create a temporary vercel.json with the specific domain
TEMP_VERCEL_JSON=$(mktemp)
cat > "$TEMP_VERCEL_JSON" << EOF
{
  "version": 2,
  "build": {
    "env": {
      "NEXT_TELEMETRY_DISABLED": "1"
    }
  },
  "functions": {
    "src/app/api/**/*.ts": {
      "runtime": "nodejs18.x"
    }
  },
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/\$1"
    }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "X-Frame-Options",
          "value": "DENY"
        },
        {
          "key": "X-Content-Type-Options",
          "value": "nosniff"
        }
      ]
    }
  ],
  "regions": ["iad1"],
  "framework": "nextjs"
}
EOF

# Backup original vercel.json if it exists
if [ -f "vercel.json" ]; then
    cp vercel.json vercel.json.backup
fi

# Copy temp config to project
cp "$TEMP_VERCEL_JSON" vercel.json

# Deploy
print_status "Starting deployment..."
DEPLOYMENT_URL=$(vercel --prod --yes 2>&1 | grep -o 'https://[^[:space:]]*\.vercel\.app' | head -1)

if [ -z "$DEPLOYMENT_URL" ]; then
    print_error "Failed to get deployment URL"
    exit 1
fi

print_success "Deployed to: $DEPLOYMENT_URL"

# Add custom domain
print_status "Adding custom domain: ${FULL_DOMAIN}"
vercel domains add "$FULL_DOMAIN" --yes || {
    print_warning "Domain might already exist or there was an issue adding it"
}

# Link domain to project
PROJECT_NAME=$(basename $(pwd))
vercel alias "$DEPLOYMENT_URL" "$FULL_DOMAIN" || {
    print_warning "Failed to create alias. You may need to configure DNS manually"
}

# Restore original vercel.json if backup exists
if [ -f "vercel.json.backup" ]; then
    mv vercel.json.backup vercel.json
else
    rm -f vercel.json
fi

# Clean up
rm -f "$TEMP_VERCEL_JSON"

print_success "Deployment complete!"
print_status "Your app should be available at: https://${FULL_DOMAIN}"
print_status "Vercel deployment URL: $DEPLOYMENT_URL"

# Save deployment info
echo "SUBDOMAIN=${SUBDOMAIN}" > .env.deployment
echo "FULL_DOMAIN=${FULL_DOMAIN}" >> .env.deployment
echo "DEPLOYMENT_URL=${DEPLOYMENT_URL}" >> .env.deployment

print_status "Deployment information saved to .env.deployment"
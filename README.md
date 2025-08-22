# FlowSlash App

A Next.js application configured for subdomain deployment on Vercel.

## Getting Started

### Development

```bash
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Deployment

This project is configured to deploy to random subdomains at `flowslash.link`.

#### Quick Deploy

```bash
bun run deploy:subdomain
```

This will:
1. Generate a random UUID subdomain (e.g., `abc123def456.flowslash.link`)
2. Deploy your app to Vercel
3. Configure the custom domain
4. Save deployment info to `.env.deployment`

#### Manual Deployment

If you prefer manual control:

```bash
# Install Vercel CLI globally
bun add -g vercel

# Login to Vercel
vercel login

# Deploy
vercel --prod
```

### Domain Configuration

The project includes a `vercel.json` configuration optimized for:
- Next.js App Router
- Custom domain support
- Security headers
- Optimal regions (iad1)

### Requirements

- Node.js 18.17.0 or later
- Vercel CLI (installed automatically by deploy script)
- Access to `flowslash.link` domain configuration

### Project Structure

```
src/
  app/
    layout.tsx    # Root layout
    page.tsx      # Home page
    globals.css   # Global styles
```

### Scripts

- `bun dev` - Start development server
- `bun build` - Build for production
- `bun start` - Start production server
- `bun lint` - Run Biome linter
- `bun format` - Format code with Biome
- `bun check` - Run Biome checks
- `bun deploy:subdomain` - Deploy to random subdomain

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!
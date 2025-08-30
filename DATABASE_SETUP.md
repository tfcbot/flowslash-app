# Database Setup with Neon and Drizzle

This project is configured to use **Neon** (serverless Postgres) with **Drizzle ORM** for efficient database operations in serverless environments.

## Prerequisites

1. Create a Neon account at [neon.tech](https://neon.tech)
2. Create a new project in Neon
3. Get your connection string from the Neon dashboard

## Environment Setup

1. Copy the environment template:
   ```bash
   # Create your .env file with the following variables:
   DATABASE_URL=postgres://username:password@ep-instance-id.region.aws.neon.tech/neondb
   
   # Optional: For multi-branch development
   DEV_DATABASE_URL=postgres://username:password@ep-dev-instance-id.region.aws.neon.tech/neondb
   TEST_DATABASE_URL=postgres://username:password@ep-test-instance-id.region.aws.neon.tech/neondb
   ```

2. Replace the connection string with your actual Neon database URL from your dashboard.

## Database Commands

The following npm scripts are available for database operations:

```bash
# Generate migration files from schema changes
npm run db:generate

# Apply migrations to your database
npm run db:migrate

# Push schema changes directly to database (development only)
npm run db:push

# Open Drizzle Studio for database management
npm run db:studio
```

## Initial Setup

1. **Install dependencies** (already done):
   ```bash
   npm install
   ```

2. **Generate initial migrations**:
   ```bash
   npm run db:generate
   ```

3. **Apply migrations to your Neon database**:
   ```bash
   npm run db:migrate
   ```

## Database Schema

The current schema includes:

- **Users**: User accounts with roles, metadata, and timestamps
- **Posts**: Blog posts with status, tags, and full-text search capability
- **Comments**: Comments linked to posts and users

### Key Features

- **Postgres Enums**: User roles and post statuses
- **JSONB Support**: Flexible metadata storage
- **Array Types**: Tag storage for posts
- **Full-text Search**: Postgres text search for posts
- **Relations**: Proper foreign key relationships

## Usage Examples

### Basic Operations

```typescript
import { db } from './src/db';
import { usersTable, type NewUser } from './src/schema';

// Create a new user
const newUser: NewUser = {
  name: 'John Doe',
  email: 'john@example.com',
  role: 'user',
};

const user = await db.insert(usersTable).values(newUser).returning();
```

### Using Utility Functions

```typescript
import { createUserWithPosts, getUsersWithPostCount } from './src/db/utils';

// Create user with posts in a transaction
const userWithPosts = await createUserWithPosts(
  { name: 'Jane Doe', email: 'jane@example.com' },
  [{ title: 'My First Post', content: 'Hello world!' }]
);

// Get users with post counts
const usersWithCounts = await getUsersWithPostCount();
```

## Neon-Specific Features

### Branch Support

Neon supports database branching. Configure different branches for different environments:

```typescript
import { branchDb } from './src/db';

// Uses appropriate branch based on NODE_ENV
const data = await branchDb.select().from(usersTable);
```

### Error Handling

All database operations include Neon-specific error handling:

```typescript
import { safeNeonOperation } from './src/db/utils';

// Automatically handles connection timeouts and retries
const result = await safeNeonOperation(() => 
  db.select().from(usersTable)
);
```

### Performance Optimizations

- **Prepared Statements**: For repeated queries
- **Batch Operations**: For bulk inserts
- **Connection Pooling**: Automatic with Neon
- **Short-lived Connections**: Optimized for serverless

## Development Workflow

1. **Make schema changes** in `src/schema.ts`
2. **Generate migrations**: `npm run db:generate`
3. **Review migration files** in `./migrations/`
4. **Apply migrations**: `npm run db:migrate`
5. **Use Drizzle Studio** for data inspection: `npm run db:studio`

## Production Considerations

- Use different Neon projects/branches for staging and production
- Set appropriate connection limits in Neon dashboard
- Monitor query performance using Neon's analytics
- Consider read replicas for high-traffic applications

## Troubleshooting

### Connection Issues
- Verify DATABASE_URL is correct
- Check Neon project status in dashboard
- Ensure IP allowlist includes your deployment environment

### Migration Issues
- Always review generated migrations before applying
- Test migrations on a branch before production
- Keep migration files in version control

### Performance Issues
- Use prepared statements for repeated queries
- Batch operations when possible
- Monitor slow queries in Neon dashboard
- Consider indexing for frequently queried columns

For more detailed information, refer to:
- [Neon Documentation](https://neon.tech/docs)
- [Drizzle ORM Documentation](https://orm.drizzle.team)

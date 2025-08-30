# FlowSlash App

A modern Next.js application with **Neon** (serverless Postgres) and **Drizzle ORM** for efficient database operations.

## 🚀 Features

- ⚡ **Next.js 15** with App Router
- 🗄️ **Neon Database** - Serverless Postgres with auto-scaling
- 🔧 **Drizzle ORM** - Type-safe database operations
- 🏃‍♂️ **npm** for reliable package management
- 🎨 **Tailwind CSS** for modern styling
- 📝 **TypeScript** for complete type safety
- 🚀 **Biome** for fast linting and formatting

- 🌐 **API Routes** with full CRUD operations

## 🗄️ Database Architecture

This project uses **Neon** (serverless Postgres) with **Drizzle ORM** for:
- **Type-safe queries** with full TypeScript integration
- **Serverless optimization** with connection pooling
- **Multi-environment support** (dev/test/prod branches)
- **Advanced Postgres features** (JSONB, arrays, full-text search)

### Schema Overview
- **Users**: Authentication and profile management
- **Posts**: Content creation with status and tags
- **Comments**: User interactions and discussions

## 🛠️ Getting Started

### Prerequisites

1. **Node.js** (v18.17.0 or higher)
2. **Neon Account** - Create at [neon.tech](https://neon.tech)

### Installation

1. **Clone and install dependencies:**
   ```bash
   npm install
   ```

2. **Set up your Neon database:**
   - Create a new project in [Neon Console](https://console.neon.tech)
   - Copy your connection string

3. **Configure environment variables:**
   ```bash
   # Create .env file
   DATABASE_URL=postgres://username:password@ep-instance-id.region.aws.neon.tech/neondb
   
   # Optional: For multi-environment setup
   DEV_DATABASE_URL=postgres://...
   TEST_DATABASE_URL=postgres://...
   ```

4. **Initialize database:**
   ```bash
   npm run db:generate  # Generate migration files
   npm run db:migrate   # Apply migrations to database
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)** to see your application.

## 📜 Available Scripts

### Development
- `npm run dev` - Start Next.js development server

### Database Operations
- `npm run db:generate` - Generate migration files from schema changes
- `npm run db:migrate` - Apply migrations to your database
- `npm run db:push` - Push schema changes directly (development only)
- `npm run db:studio` - Open Drizzle Studio for database management

### Build & Deploy
- `npm run build` - Build the application for production
- `npm run start` - Start the production server

### Code Quality
- `npm run lint` - Run Biome linter
- `npm run format` - Format code with Biome
- `npm run check` - Run Biome linter and formatter together

## 🏗️ Project Structure

```
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── users/          # User CRUD API routes
│   │   ├── globals.css         # Global styles
│   │   ├── layout.tsx          # Root layout
│   │   └── page.tsx            # Home page
│   ├── components/
│   │   └── UsersList.tsx       # Example component with database integration
│   ├── db/
│   │   └── utils.ts            # Database utilities and helpers
│   ├── db.ts                   # Neon database connection
│   └── schema.ts               # Drizzle database schema

├── migrations/                 # Database migration files
├── drizzle.config.ts          # Drizzle configuration
├── DATABASE_SETUP.md          # Detailed database setup guide
└── package.json
```

## 🔌 API Endpoints

### Users API
- `GET /api/users` - List all users
- `POST /api/users` - Create a new user
- `GET /api/users/[id]` - Get user by ID
- `PUT /api/users/[id]` - Update user
- `DELETE /api/users/[id]` - Delete user

### Example Usage
```typescript
// Create a new user
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user'
  })
});

const user = await response.json();
```

## 🗄️ Database Usage Examples

### Basic Queries
```typescript
import { db } from './src/db';
import { usersTable } from './src/schema';

// Get all users
const users = await db().select().from(usersTable);

// Create a user
const [newUser] = await db()
  .insert(usersTable)
  .values({ name: 'Jane Doe', email: 'jane@example.com' })
  .returning();
```

### Advanced Operations
```typescript
import { getUsersWithPostCount, createUserWithPosts } from './src/db/utils';

// Get users with post counts
const usersWithCounts = await getUsersWithPostCount();

// Create user with posts in a transaction
const userWithPosts = await createUserWithPosts(
  { name: 'Author', email: 'author@example.com' },
  [{ title: 'First Post', content: 'Hello world!' }]
);
```

## 🌟 Key Features

### Type Safety
- **Full TypeScript integration** with schema inference
- **Type-safe queries** prevent runtime errors
- **Automatic type generation** from database schema

### Performance Optimizations
- **Connection pooling** for serverless environments
- **Prepared statements** for repeated queries
- **Batch operations** for bulk data operations
- **Query optimization** for complex joins

### Development Experience
- **Drizzle Studio** for visual database management
- **Migration system** for schema versioning
- **Error handling** with Neon-specific optimizations
- **Multi-environment support** for dev/test/prod

### Production Ready
- **Serverless optimization** for auto-scaling
- **Error handling and retry logic**
- **Environment-based configuration**
- **Performance monitoring ready**

## 📚 Documentation

- **[DATABASE_SETUP.md](./DATABASE_SETUP.md)** - Comprehensive database setup guide
- **[Neon Documentation](https://neon.tech/docs)** - Neon database platform
- **[Drizzle Documentation](https://orm.drizzle.team)** - Drizzle ORM guides
- **[Next.js Documentation](https://nextjs.org/docs)** - Next.js framework

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using Neon, Drizzle, and Next.js**
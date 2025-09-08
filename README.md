# FlowSlash App

A modern Next.js application with **InstantDB** for real-time database operations and seamless data synchronization.

## 🚀 Features

- ⚡ **Next.js 15** with App Router
- 🗄️ **InstantDB** - Real-time database with live queries
- 🔄 **Live Data Sync** - Real-time updates across all clients
- 🏃‍♂️ **npm** for reliable package management
- 🎨 **Tailwind CSS** for modern styling
- 📝 **TypeScript** for complete type safety
- 🚀 **ESLint + Prettier** for code quality and formatting
- 🔐 **Built-in Authentication** via InstantDB
- 🌐 **API Routes** with full CRUD operations

## 🗄️ Database Architecture

This project uses **InstantDB** for:

- **Real-time queries** with live data synchronization
- **Type-safe operations** with full TypeScript integration
- **Built-in authentication** and permissions
- **Relational data modeling** with links and relationships
- **Offline-first** capabilities with automatic sync

### Schema Overview

- **$users**: Built-in user authentication entities
- **profiles**: User profile information and settings
- **posts**: Content creation with status and tags
- **comments**: User interactions and discussions

## 🛠️ Getting Started

### Prerequisites

1. **Node.js** (v18.17.0 or higher)
2. **InstantDB Account** - Create at [instantdb.com](https://instantdb.com)

### Installation

1. **Clone and install dependencies:**

   ```bash
   npm install
   ```

2. **Set up your InstantDB app:**
   - Create a new app in [InstantDB Dashboard](https://instantdb.com/dash)
   - Copy your App ID and Admin Token

3. **Configure environment variables:**

   ```bash
   # Create .env.local file
   NEXT_PUBLIC_INSTANT_APP_ID=your-app-id-here
   # Note: No admin token needed for client-side only approach
   ```

4. **Initialize schema:**

   ```bash
   npx instant-cli@latest init  # Initialize InstantDB CLI
   npx instant-cli@latest push schema  # Push schema to InstantDB
   ```

5. **Start development server:**

   ```bash
   npm run dev
   ```

6. **Open [http://localhost:3000](http://localhost:3000)** to see your application.

## 📜 Available Scripts

### Development

- `npm run dev` - Start Next.js development server

### Schema Management

- `npx instant-cli@latest push schema` - Push schema changes to InstantDB
- `npx instant-cli@latest push perms` - Push permissions to InstantDB

### Build & Deploy

- `npm run build` - Build the application for production
- `npm run start` - Start the production server

### Code Quality

- `npm run lint` - Run ESLint linter
- `npm run lint:fix` - Run ESLint with auto-fix
- `npm run format` - Format code with Prettier
- `npm run check` - Run ESLint and build together

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
│   │   └── UsersList.tsx       # Real-time component with InstantDB integration
│   ├── db/
│   │   └── utils.ts            # InstantDB utilities and helpers
│   └── db.ts                   # InstantDB configuration and types

├── instant.schema.ts          # InstantDB schema definition
├── instantdb/                 # InstantDB documentation
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
// Create a new user via API
const response = await fetch('/api/users', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: 'John Doe',
    email: 'john@example.com',
    role: 'user',
  }),
});

const user = await response.json();
```

## 🗄️ Database Usage Examples

### Real-time Queries (Client-side)

```typescript
import { db } from './src/db';
import { queries } from './src/db/utils';

// Live query that updates automatically
function UsersList() {
  const { isLoading, error, data } = db.useQuery(queries.allProfiles());

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>Error: {error.message}</div>;

  return (
    <div>
      {data.profiles.map(profile => (
        <div key={profile.id}>
          {profile.name} - {profile.$user[0]?.email}
        </div>
      ))}
    </div>
  );
}
```

### Client-side Transactions

```typescript
import { createProfile, updateProfile } from './src/db/utils';

// Create a profile with linked user (client-side)
const handleCreateUser = async () => {
  try {
    await createProfile({
      name: 'Jane Doe',
      email: 'jane@example.com',
      role: 'user',
    });
    console.log('User created successfully!');
  } catch (error) {
    console.error('Error creating user:', error);
  }
};

// Update a profile (client-side)
const handleUpdateUser = async (profileId: string) => {
  try {
    await updateProfile(profileId, {
      name: 'Updated Name',
      role: 'admin',
    });
    console.log('User updated successfully!');
  } catch (error) {
    console.error('Error updating user:', error);
  }
};
```

## 🌟 Key Features

### Real-time Data

- **Live queries** that update automatically
- **Real-time synchronization** across all clients
- **Optimistic updates** for instant UI feedback
- **Offline-first** with automatic sync when reconnected

### Type Safety

- **Full TypeScript integration** with schema inference
- **Type-safe queries** prevent runtime errors
- **Automatic type generation** from database schema

### Developer Experience

- **InstantDB Dashboard** for visual data management
- **Schema-as-code** with version control
- **Built-in authentication** and permissions
- **Powerful query system** with relations

### Production Ready

- **Auto-scaling** serverless architecture
- **Built-in error handling** and retry logic
- **Environment-based configuration**
- **Real-time performance monitoring**

## 📚 Documentation

- **[InstantDB Documentation](https://instantdb.com/docs)** - Complete InstantDB guides
- **[Next.js Documentation](https://nextjs.org/docs)** - Next.js framework
- **[instantdb/ folder](./instantdb/)** - Local InstantDB documentation and patterns

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

**Built with ❤️ using InstantDB, Next.js, and TypeScript**

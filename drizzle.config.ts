// drizzle.config.ts
import { config } from 'dotenv'
import { defineConfig } from 'drizzle-kit'

config({ path: '.env' })

export default defineConfig({
  schema: './src/schema.ts',
  out: './migrations',
  dialect: 'postgresql', // Neon uses Postgres dialect
  dbCredentials: {
    url: process.env.DATABASE_URL || '',
  },
  // Optional: Neon project specific tables to include/exclude
  // includeTables: ['users', 'posts', 'comments'],
  // excludeTables: ['_migrations'],
})

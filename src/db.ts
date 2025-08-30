// src/db.ts
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

// Create database connection function
export function createDb() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined')
  }

  // Create Neon SQL client - specific to Neon
  const sql = neon(process.env.DATABASE_URL)

  // Create Drizzle instance with neon-http adapter
  return drizzle({ client: sql })
}

// Export db instance for use in API routes and server-side code
export const db = createDb

// Multi-branch setup utility
const getBranchUrl = () => {
  const env = process.env.NODE_ENV
  if (env === 'development') {
    return process.env.DEV_DATABASE_URL
  }
  if (env === 'test') {
    return process.env.TEST_DATABASE_URL
  }
  return process.env.DATABASE_URL
}

// Alternative database instance for branch-specific operations
export const branchDb = (() => {
  const branchUrl = getBranchUrl()
  if (branchUrl) {
    const branchSql = neon(branchUrl)
    return drizzle({ client: branchSql })
  }
  return db
})()

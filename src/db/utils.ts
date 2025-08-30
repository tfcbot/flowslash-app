// src/db/utils.ts
import { db } from '../db'
import {
  usersTable,
  postsTable,
  commentsTable,
  type NewUser,
  type NewPost,
  type NewComment,
} from '../schema'
import { eq, sql } from 'drizzle-orm'

// Neon-specific error handling
export async function safeNeonOperation<T>(operation: () => Promise<T>): Promise<T> {
  try {
    return await operation()
  } catch (error: unknown) {
    // Handle Neon-specific error codes
    const errorMessage = error instanceof Error ? error.message : String(error)
    
    if (errorMessage.includes('connection pool timeout')) {
      console.error('Neon connection pool timeout')
      // Handle appropriately - could implement retry logic
      throw new Error('Database connection timeout. Please try again.')
    }

    if (errorMessage.includes('too many connections')) {
      console.error('Neon connection limit reached')
      throw new Error('Database is currently busy. Please try again.')
    }

    // Re-throw for other handling
    throw error
  }
}

// Batch operations optimized for Neon serverless
export async function batchInsertUsers(users: NewUser[]) {
  return safeNeonOperation(() => db().insert(usersTable).values(users).returning())
}

export async function batchInsertPosts(posts: NewPost[]) {
  return safeNeonOperation(() => db().insert(postsTable).values(posts).returning())
}

// Prepared statements for repeated queries
export const getUsersByRolePrepared = () =>
  db().select().from(usersTable).where(sql`${usersTable.role} = $1`).prepare('get_users_by_role')

export const getPostsByStatusPrepared = () =>
  db()
    .select()
    .from(postsTable)
    .where(sql`${postsTable.status} = $1`)
    .prepare('get_posts_by_status')

// Safe query functions with error handling
export async function getUserSafely(id: number) {
  return safeNeonOperation(() => db().select().from(usersTable).where(eq(usersTable.id, id)))
}

export async function getPostSafely(id: number) {
  return safeNeonOperation(() => db().select().from(postsTable).where(eq(postsTable.id, id)))
}

// Transaction example optimized for Neon
export async function createUserWithPosts(user: NewUser, posts: NewPost[]) {
  return safeNeonOperation(async () => {
    return await db().transaction(async (tx) => {
      const [newUser] = await tx.insert(usersTable).values(user).returning()

      if (posts.length > 0) {
        await tx.insert(postsTable).values(
          posts.map((post) => ({
            ...post,
            userId: newUser.id,
          }))
        )
      }

      return newUser
    })
  })
}

// Complex query with joins optimized for Neon
export async function getUsersWithPostCount() {
  return safeNeonOperation(() =>
    db()
      .select({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        postCount: sql<number>`count(${postsTable.id})`,
      })
      .from(usersTable)
      .leftJoin(postsTable, eq(usersTable.id, postsTable.userId))
      .groupBy(usersTable.id)
  )
}

// Full-text search example (Postgres feature supported by Neon)
export async function searchPosts(searchTerm: string) {
  return safeNeonOperation(() =>
    db()
      .select()
      .from(postsTable)
      .where(
        sql`to_tsvector('english', ${postsTable.title} || ' ' || ${postsTable.content}) @@ plainto_tsquery('english', ${searchTerm})`
      )
  )
}

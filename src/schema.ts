// src/schema.ts
import {
  pgTable,
  serial,
  text,
  integer,
  timestamp,
  jsonb,
  pgEnum,
  boolean,
  varchar,
} from 'drizzle-orm/pg-core'
import { relations } from 'drizzle-orm'

// Example of Postgres-specific enum with Neon
export const userRoleEnum = pgEnum('user_role', ['admin', 'user', 'guest'])
export const postStatusEnum = pgEnum('post_status', ['draft', 'published', 'archived'])

// Users table with Postgres-specific features
export const usersTable = pgTable('users', {
  id: serial('id').primaryKey(),
  name: text('name').notNull(),
  email: text('email').notNull().unique(),
  role: userRoleEnum('role').default('user'),
  metadata: jsonb('metadata'), // Postgres JSONB supported by Neon
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Posts table
export const postsTable = pgTable('posts', {
  id: serial('id').primaryKey(),
  title: varchar('title', { length: 255 }).notNull(),
  content: text('content'),
  status: postStatusEnum('status').default('draft'),
  userId: integer('user_id').references(() => usersTable.id),
  tags: text('tags').array(), // Postgres array type
  metadata: jsonb('metadata'),
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
})

// Comments table
export const commentsTable = pgTable('comments', {
  id: serial('id').primaryKey(),
  content: text('content').notNull(),
  postId: integer('post_id').references(() => postsTable.id),
  userId: integer('user_id').references(() => usersTable.id),
  createdAt: timestamp('created_at').defaultNow(),
})

// Relations
export const usersRelations = relations(usersTable, ({ many }) => ({
  posts: many(postsTable),
  comments: many(commentsTable),
}))

export const postsRelations = relations(postsTable, ({ one, many }) => ({
  author: one(usersTable, {
    fields: [postsTable.userId],
    references: [usersTable.id],
  }),
  comments: many(commentsTable),
}))

export const commentsRelations = relations(commentsTable, ({ one }) => ({
  post: one(postsTable, {
    fields: [commentsTable.postId],
    references: [postsTable.id],
  }),
  author: one(usersTable, {
    fields: [commentsTable.userId],
    references: [usersTable.id],
  }),
}))

// Export types
export type User = typeof usersTable.$inferSelect
export type NewUser = typeof usersTable.$inferInsert

export type Post = typeof postsTable.$inferSelect
export type NewPost = typeof postsTable.$inferInsert

export type Comment = typeof commentsTable.$inferSelect
export type NewComment = typeof commentsTable.$inferInsert

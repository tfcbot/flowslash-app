// src/db/utils.ts
import { db, id } from '../db';

// Client-side utility functions for common operations
// Note: With InstantDB, most operations can be done directly in components using db.transact and db.useQuery

// Helper function to create a new profile
export function createProfile(profileData: {
  name: string;
  email: string;
  role?: string;
  metadata?: any;
  isActive?: boolean;
}) {
  const now = Date.now();
  const profileId = id();
  const userId = id();

  return db.transact([
    // Create user first
    db.tx.$users[userId].update({
      email: profileData.email,
    }),
    // Then create profile
    db.tx.profiles[profileId].update({
      name: profileData.name,
      role: profileData.role || 'user',
      metadata: profileData.metadata || null,
      isActive: profileData.isActive ?? true,
      createdAt: now,
      updatedAt: now,
    }),
    // Link profile to user
    db.tx.profiles[profileId].link({ $user: userId }),
  ]);
}

// Helper function to update a profile
export function updateProfile(
  profileId: string,
  updates: Partial<{
    name: string;
    role: string;
    metadata: any;
    isActive: boolean;
  }>
) {
  return db.transact([
    db.tx.profiles[profileId].update({
      ...updates,
      updatedAt: Date.now(),
    }),
  ]);
}

// Helper function to delete a profile
export function deleteProfile(profileId: string) {
  return db.transact([db.tx.profiles[profileId].delete()]);
}

// Helper function to create a post
export function createPost(postData: {
  title: string;
  content?: string;
  status?: string;
  authorId: string;
  tags?: string[];
  metadata?: any;
}) {
  const now = Date.now();
  const postId = id();

  return db.transact([
    db.tx.posts[postId].update({
      title: postData.title,
      content: postData.content || null,
      status: postData.status || 'draft',
      tags: postData.tags || null,
      metadata: postData.metadata || null,
      createdAt: now,
      updatedAt: now,
    }),
    // Link post to author
    db.tx.posts[postId].link({ author: postData.authorId }),
  ]);
}

// Helper function to create a comment
export function createComment(commentData: {
  content: string;
  postId: string;
  authorId: string;
}) {
  const commentId = id();

  return db.transact([
    db.tx.comments[commentId].update({
      content: commentData.content,
      createdAt: Date.now(),
    }),
    // Link comment to post and author
    db.tx.comments[commentId].link({
      post: commentData.postId,
      author: commentData.authorId,
    }),
  ]);
}

// Query helpers (these return query objects to be used with db.useQuery)
export const queries = {
  // Get all profiles with their users
  allProfiles: () => ({
    profiles: {
      $user: {},
    },
  }),

  // Get a specific profile by ID
  profileById: (profileId: string) => ({
    profiles: {
      $: {
        where: {
          id: profileId,
        },
      },
      $user: {},
      authoredPosts: {},
      authoredComments: {},
    },
  }),

  // Get posts by author
  postsByAuthor: (authorId: string) => ({
    posts: {
      $: {
        where: {
          'author.id': authorId,
        },
      },
      author: {},
      comments: {
        author: {},
      },
    },
  }),

  // Search posts
  searchPosts: (searchTerm: string) => ({
    posts: {
      $: {
        where: {
          or: [
            { title: { $like: `%${searchTerm}%` } },
            { content: { $like: `%${searchTerm}%` } },
          ],
        },
      },
      author: {},
    },
  }),

  // Get profiles with their posts for counting
  profilesWithPosts: () => ({
    profiles: {
      $user: {},
      authoredPosts: {},
    },
  }),
};

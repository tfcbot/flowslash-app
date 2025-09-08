// src/db.ts
import { init, id } from '@instantdb/react';

// Get app ID from environment
const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID;

// Client-side database instance
export const db = init({
  appId: APP_ID!,
});

// Export id generator for convenience
export { id };

// Type exports for convenience
export type { AppSchema } from '../instant.schema';
export type User = {
  id: string;
  email: string;
  profile?: {
    id: string;
    name: string;
    role: string;
    metadata?: any;
    isActive: boolean;
    createdAt: string | number;
    updatedAt: string | number;
  };
};

export type Profile = {
  id: string;
  name: string;
  role: string;
  metadata?: any;
  isActive: boolean;
  createdAt: string | number;
  updatedAt: string | number;
  $user?: User;
  authoredPosts?: Post[];
  authoredComments?: Comment[];
};

export type Post = {
  id: string;
  title: string;
  content?: string;
  status: string;
  tags?: string[];
  metadata?: any;
  createdAt: string | number;
  updatedAt: string | number;
  author?: Profile;
  comments?: Comment[];
};

export type Comment = {
  id: string;
  content: string;
  createdAt: string | number;
  post?: Post;
  author?: Profile;
};

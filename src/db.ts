// src/db.ts
import { init, id } from '@instantdb/react';

// Get app ID from environment (may be undefined in starter template)
const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID;

// Initialize InstantDB only if an app id is provided; otherwise export a proxy
// that throws a clear error when used. This avoids build/runtime crashes.
export const db = APP_ID
  ? init({ appId: APP_ID })
  : new Proxy({} as any, {
      get(_target, prop) {
        const hint =
          'InstantDB is not configured. Set NEXT_PUBLIC_INSTANT_APP_ID in .env.local to use `db.' +
          String(prop) +
          '`. The starter page works without it.';
        throw new Error(hint);
      },
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

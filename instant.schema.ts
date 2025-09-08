// instant.schema.ts
import { i } from '@instantdb/react';

const _schema = i.schema({
  entities: {
    $users: i.entity({
      email: i.string().unique().indexed(),
    }),
    profiles: i.entity({
      name: i.string(),
      role: i.string().indexed(),
      metadata: i.json().optional(),
      isActive: i.boolean(),
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    posts: i.entity({
      title: i.string(),
      content: i.string().optional(),
      status: i.string().indexed(),
      tags: i.json().optional(), // Store array of strings as JSON
      metadata: i.json().optional(),
      createdAt: i.date(),
      updatedAt: i.date(),
    }),
    comments: i.entity({
      content: i.string(),
      createdAt: i.date(),
    }),
  },
  rooms: {},
  links: {
    profileUser: {
      forward: { on: 'profiles', has: 'one', label: '$user' },
      reverse: { on: '$users', has: 'one', label: 'profile' },
    },
    postAuthor: {
      forward: { on: 'posts', has: 'one', label: 'author' },
      reverse: { on: 'profiles', has: 'many', label: 'authoredPosts' },
    },
    commentPost: {
      forward: { on: 'comments', has: 'one', label: 'post' },
      reverse: { on: 'posts', has: 'many', label: 'comments' },
    },
    commentAuthor: {
      forward: { on: 'comments', has: 'one', label: 'author' },
      reverse: { on: 'profiles', has: 'many', label: 'authoredComments' },
    },
  },
});

// This helps Typescript display better intellisense
type _AppSchema = typeof _schema;
interface AppSchema extends _AppSchema {}
const schema: AppSchema = _schema;

export type { AppSchema };
export default schema;

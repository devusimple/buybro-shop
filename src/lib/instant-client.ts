'use client';

import { init } from '@instantdb/react';
import schema from '../../schema';

const APP_ID = process.env.NEXT_PUBLIC_INSTANT_APP_ID || '15965306-4c1b-425f-ab5b-8b8a41ffcb39';

// Initialize InstantDB client for client-side operations
export const db = init({
  appId: APP_ID,
  schema,
  useDateObjects: true,
});

// Re-export id generator
export { id } from '@instantdb/react';

// Auth helper functions
// export function signInWithEmail(email: string) {
//   return db.auth.signInWithMagicCode({ email: email });
// }

export function signOut() {
  return db.auth.signOut();
}

export function useAuth() {
  return db.useAuth();
}

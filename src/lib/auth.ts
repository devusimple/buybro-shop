import { NextAuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { init, ID } from '@instantdb/core';

const APP_ID = process.env.INSTANT_APP_ID || '15965306-4c1b-425f-ab5b-8b8a41ffcb39';
const db = init({ appId: APP_ID });

// Simple password hashing (for production, use bcrypt)
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password + 'salt-ecommerce-secret');
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

async function verifyPassword(password: string, hash: string): Promise<boolean> {
  const passwordHash = await hashPassword(password);
  return passwordHash === hash;
}

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
        name: { label: 'Name', type: 'text' },
        isRegister: { label: 'Is Register', type: 'text' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Email and password are required');
        }

        const { email, password, name, isRegister } = credentials;

        try {
          // Register new user
          if (isRegister === 'true') {
            // Check if user exists
            const existingUsers = await db.query({
              users: { $: { where: { email } } }
            });

            if (existingUsers.users && existingUsers.users.length > 0) {
              throw new Error('User with this email already exists');
            }

            // Create new user
            const userId = id();
            const hashedPassword = await hashPassword(password);
            const now = Date.now();

            await db.transact(
              db.tx.users[userId].update({
                email,
                name: name || email.split('@')[0],
                password: hashedPassword,
                role: 'customer',
                image: null,
                createdAt: now,
                updatedAt: now,
              })
            );

            return {
              id: userId,
              email,
              name: name || email.split('@')[0],
              role: 'customer',
            };
          }

          // Login existing user
          const result = await db.query({
            users: { $: { where: { email } } }
          });

          const users = result.users as Array<{
            id: string;
            email: string;
            name: string;
            password: string;
            role: string;
            image: string | null;
          }>;

          if (!users || users.length === 0) {
            throw new Error('No user found with this email');
          }

          const user = users[0];

          // Verify password
          const isValid = await verifyPassword(password, user.password);
          if (!isValid) {
            throw new Error('Invalid password');
          }

          return {
            id: user.id,
            email: user.email,
            name: user.name,
            role: user.role,
            image: user.image,
          };
        } catch (error) {
          console.error('Auth error:', error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  session: {
    strategy: 'jwt',
  },
  secret: process.env.NEXTAUTH_SECRET,
};

// Helper to check if user is admin
export function isAdmin(role: string | undefined): boolean {
  return role === 'admin';
}

// Helper to get user from session
export async function getCurrentUser() {
  // This will be used in server components
  return null;
}

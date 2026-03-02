'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { db } from '@/lib/instant-client';
import { transactDB, id, updateOp } from '@/lib/instant-server';

interface User {
  id: string;
  email: string | null;
  name: string | null;
  image: string | null;
  role: 'admin' | 'vendor' | 'customer' | null;
  phone?: string | null;
  isActive?: boolean;
  createdAt?: number;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  isVendor: boolean;
  signIn: (email: string) => Promise<{ success: boolean; error?: string }>;
  verifyCode: (email: string, code: string) => Promise<{ success: boolean; error?: string }>;
  signOut: () => Promise<void>;
  refreshUser: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Default admin emails for initial setup
const ADMIN_EMAILS = ['admin@example.com', 'admin@demo.com'];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { isLoading: authLoading } = db.useAuth();

  // Subscribe to auth changes
  useEffect(() => {
    if (!authLoading) {
      // Check for stored user session
      const checkAuth = async () => {
        try {
          const storedUser = localStorage.getItem('instantdb_user');
          if (storedUser) {
            const parsed = JSON.parse(storedUser);
            setUser(parsed);
          }
        } catch (error) {
          console.error('Auth check error:', error);
        } finally {
          setIsLoading(false);
        }
      };
      checkAuth();
    }
  }, [authLoading]);

  const signIn = async (email: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // For demo purposes, we'll use a simple email-based auth
      // In production, you'd use InstantDB's magic code auth
      const normalizedEmail = email.toLowerCase().trim();
      const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);
      
      // Create a mock user session
      const mockUser: User = {
        id: id(),
        email: normalizedEmail,
        name: isAdmin ? 'Admin User' : 'Demo User',
        image: null,
        role: isAdmin ? 'admin' : 'customer',
        isActive: true,
        createdAt: Date.now(),
      };

      // Store in localStorage for demo
      localStorage.setItem('instantdb_pending_email', normalizedEmail);
      
      return { success: true };
    } catch (error) {
      console.error('Sign in error:', error);
      return { success: false, error: 'Failed to sign in' };
    } finally {
      setIsLoading(false);
    }
  };

  const verifyCode = async (email: string, code: string): Promise<{ success: boolean; error?: string }> => {
    try {
      setIsLoading(true);
      
      // For demo, accept any 6-digit code or "123456"
      if (code.length === 6 || code === '123456') {
        const normalizedEmail = email.toLowerCase().trim();
        const isAdmin = ADMIN_EMAILS.includes(normalizedEmail);
        
        const userId = id();
        const user: User = {
          id: userId,
          email: normalizedEmail,
          name: isAdmin ? 'Admin User' : 'Demo User',
          image: null,
          role: isAdmin ? 'admin' : 'customer',
          isActive: true,
          createdAt: Date.now(),
        };

        // Try to save user to InstantDB
        try {
          await transactDB([
            updateOp('$users', userId, {
              email: user.email,
              name: user.name,
              role: user.role,
              isActive: true,
              createdAt: user.createdAt,
              updatedAt: user.createdAt,
            }),
          ]);
        } catch (dbError) {
          console.log('DB save error (might already exist):', dbError);
        }

        localStorage.setItem('instantdb_user', JSON.stringify(user));
        localStorage.removeItem('instantdb_pending_email');
        setUser(user);
        
        return { success: true };
      }
      
      return { success: false, error: 'Invalid verification code' };
    } catch (error) {
      console.error('Verify code error:', error);
      return { success: false, error: 'Verification failed' };
    } finally {
      setIsLoading(false);
    }
  };

  const signOut = async () => {
    try {
      localStorage.removeItem('instantdb_user');
      localStorage.removeItem('instantdb_pending_email');
      setUser(null);
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  const refreshUser = () => {
    const storedUser = localStorage.getItem('instantdb_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin',
        isVendor: user?.role === 'vendor',
        signIn,
        verifyCode,
        signOut,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

// HOC for protecting admin routes
export function withAdminAuth<P extends object>(
  Component: React.ComponentType<P>
): React.FC<P> {
  return function AdminProtectedComponent(props: P) {
    const { isAuthenticated, isAdmin, isLoading } = useAuth();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
      setMounted(true);
    }, []);

    if (!mounted || isLoading) {
      return (
        <div className="min-h-screen flex items-center justify-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      );
    }

    if (!isAuthenticated || !isAdmin) {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <div className="max-w-md w-full p-8 bg-white rounded-lg shadow-lg text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Access Denied</h1>
            <p className="text-gray-600 mb-6">You need admin privileges to access this page.</p>
            <a href="/admin/login" className="inline-flex items-center px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90">
              Go to Login
            </a>
          </div>
        </div>
      );
    }

    return <Component {...props} />;
  };
}

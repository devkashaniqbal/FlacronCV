'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import {
  User as FirebaseUser,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPopup,
  signOut,
  sendPasswordResetEmail,
  sendEmailVerification,
  updateProfile,
} from 'firebase/auth';
import { auth, googleProvider, githubProvider, isConfigured } from '@/lib/firebase';
import { api } from '@/lib/api';
import { User } from '@flacroncv/shared-types';

interface AuthContextType {
  firebaseUser: FirebaseUser | null;
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, name: string) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  loginWithGithub: () => Promise<void>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [firebaseUser, setFirebaseUser] = useState<FirebaseUser | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!isConfigured || !auth) {
      setLoading(false);
      return;
    }

    const unsubscribe = onAuthStateChanged(auth, async (fbUser) => {
      setFirebaseUser(fbUser);
      if (fbUser) {
        try {
          const userData = await api.post<User>('/auth/verify');
          setUser(userData);
        } catch (error) {
          console.error('Failed to sync user with backend:', error);
          // Fallback: create user from Firebase data when backend is unavailable
          setUser({
            uid: fbUser.uid,
            email: fbUser.email || '',
            displayName: fbUser.displayName || '',
            photoURL: fbUser.photoURL,
            phoneNumber: fbUser.phoneNumber,
            profile: { firstName: '', lastName: '', headline: '', bio: '', location: '', website: '', linkedin: '', github: '' },
            preferences: { language: 'en' as any, theme: 'system' as any, emailNotifications: true, marketingEmails: false, defaultCVTemplate: '' },
            subscription: { plan: 'free' as any, status: 'active' as any, stripeCustomerId: null, stripeSubscriptionId: null, currentPeriodEnd: null, cancelAtPeriodEnd: false },
            usage: { cvsCreated: 0, coverLettersCreated: 0, aiCreditsUsed: 0, aiCreditsLimit: 10, exportsThisMonth: 0, lastExportReset: new Date() },
            role: 'user' as any,
            createdAt: new Date(),
            updatedAt: new Date(),
            lastLoginAt: new Date(),
            isActive: true,
            deletedAt: null,
          });
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    if (!auth) throw new Error('Firebase not configured');
    await signInWithEmailAndPassword(auth, email, password);
  };

  const register = async (email: string, password: string, name: string) => {
    if (!auth) throw new Error('Firebase not configured');
    const result = await createUserWithEmailAndPassword(auth, email, password);
    await updateProfile(result.user, { displayName: name });
    // Send email verification
    await sendEmailVerification(result.user);
  };

  const loginWithGoogle = async () => {
    if (!auth) throw new Error('Firebase not configured');
    await signInWithPopup(auth, googleProvider);
  };

  const loginWithGithub = async () => {
    if (!auth) throw new Error('Firebase not configured');
    await signInWithPopup(auth, githubProvider);
  };

  const logout = async () => {
    if (!auth) return;
    await signOut(auth);
    setUser(null);
  };

  const resetPassword = async (email: string) => {
    if (!auth) throw new Error('Firebase not configured');
    await sendPasswordResetEmail(auth, email);
  };

  return (
    <AuthContext.Provider
      value={{
        firebaseUser,
        user,
        loading,
        login,
        register,
        loginWithGoogle,
        loginWithGithub,
        logout,
        resetPassword,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

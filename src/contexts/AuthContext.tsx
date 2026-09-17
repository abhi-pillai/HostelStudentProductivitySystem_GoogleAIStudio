import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut as fbSignOut,
} from 'firebase/auth';
import { auth, googleProvider } from '../lib/firebase';
import { saveUserProfileToFirestore } from '../services/firestoreService';

interface AuthContextType {
  currentUser: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signInWithEmail: (email: string, pass: string) => Promise<void>;
  signUpWithEmail: (email: string, pass: string, displayName?: string) => Promise<void>;
  signOut: () => Promise<void>;
  authError: string | null;
  clearAuthError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      setLoading(false);
      if (user) {
        try {
          await saveUserProfileToFirestore({
            uid: user.uid,
            email: user.email,
            displayName: user.displayName,
            photoURL: user.photoURL,
          });
        } catch (err) {
          console.warn('Could not sync user profile to Firestore:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  const clearAuthError = () => setAuthError(null);

  const signInWithGoogle = async () => {
    setAuthError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        await saveUserProfileToFirestore({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        });
      }
    } catch (err: any) {
      console.error('Google sign in error:', err);
      // Format friendly error message
      if (err.code === 'auth/popup-closed-by-user') {
        setAuthError('Sign-in popup was closed before completion.');
      } else if (err.code === 'auth/cancelled-popup-request') {
        setAuthError('Sign-in request was cancelled.');
      } else {
        setAuthError(err.message || 'Failed to sign in with Google');
      }
      throw err;
    }
  };

  const signInWithEmail = async (email: string, pass: string) => {
    setAuthError(null);
    try {
      const result = await signInWithEmailAndPassword(auth, email.trim(), pass);
      if (result.user) {
        await saveUserProfileToFirestore({
          uid: result.user.uid,
          email: result.user.email,
          displayName: result.user.displayName,
          photoURL: result.user.photoURL,
        });
      }
    } catch (err: any) {
      console.error('Email sign in error:', err);
      if (err.code === 'auth/invalid-credential' || err.code === 'auth/wrong-password' || err.code === 'auth/user-not-found') {
        setAuthError('Invalid email or password.');
      } else if (err.code === 'auth/invalid-email') {
        setAuthError('Please enter a valid email address.');
      } else {
        setAuthError(err.message || 'Failed to sign in');
      }
      throw err;
    }
  };

  const signUpWithEmail = async (email: string, pass: string, displayName?: string) => {
    setAuthError(null);
    try {
      const result = await createUserWithEmailAndPassword(auth, email.trim(), pass);
      if (result.user && displayName) {
        await updateProfile(result.user, { displayName: displayName.trim() });
      }
      if (result.user) {
        await saveUserProfileToFirestore({
          uid: result.user.uid,
          email: result.user.email,
          displayName: displayName || result.user.displayName,
          photoURL: result.user.photoURL,
        });
      }
    } catch (err: any) {
      console.error('Sign up error:', err);
      if (err.code === 'auth/email-already-in-use') {
        setAuthError('An account with this email already exists. Try signing in instead.');
      } else if (err.code === 'auth/weak-password') {
        setAuthError('Password should be at least 6 characters.');
      } else if (err.code === 'auth/invalid-email') {
        setAuthError('Please enter a valid email address.');
      } else {
        setAuthError(err.message || 'Failed to create account');
      }
      throw err;
    }
  };

  const signOut = async () => {
    setAuthError(null);
    try {
      await fbSignOut(auth);
    } catch (err: any) {
      console.error('Sign out error:', err);
      setAuthError(err.message || 'Failed to sign out');
      throw err;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        loading,
        signInWithGoogle,
        signInWithEmail,
        signUpWithEmail,
        signOut,
        authError,
        clearAuthError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

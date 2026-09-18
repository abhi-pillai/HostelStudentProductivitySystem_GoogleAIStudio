import React, { useState } from 'react';
import { X, LogIn, UserPlus, Mail, Lock, User, Cloud, ShieldCheck, AlertCircle, Loader2, Sparkles, AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, authError, clearAuthError, isFirebaseConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (!isOpen) return null;

  const handleClose = () => {
    clearAuthError();
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    clearAuthError();
    try {
      await signInWithGoogle();
      if (auth.currentUser) {
        handleClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;
    setSubmitting(true);
    clearAuthError();
    try {
      if (mode === 'signin') {
        await signInWithEmail(email, password);
      } else {
        await signUpWithEmail(email, password, name);
      }
      if (auth.currentUser) {
        handleClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoSignIn = async () => {
    setSubmitting(true);
    clearAuthError();
    const demoEmail = 'student.demo@hostelapp.internal';
    const demoPass = 'hostelPass123!';
    try {
      // Attempt sign in first
      await signInWithEmail(demoEmail, demoPass);
      if (!auth.currentUser) {
        // If account doesn't exist, create it
        await signUpWithEmail(demoEmail, demoPass, 'Hostel Scholar (Demo)');
      }
      if (auth.currentUser) {
        handleClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-xs">
      <div
        className="bg-white dark:bg-stone-900 rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 dark:border-stone-800"
        id="auth-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-stone-100 dark:border-stone-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-amber-500/10 dark:bg-amber-500/20 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-stone-900 dark:text-stone-100">
                {mode === 'signin' ? 'Sign In to Cloud Sync' : 'Create System Account'}
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400">
                Store and synchronize your daily records in Firestore
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-stone-400 dark:text-stone-500 hover:text-stone-600 dark:hover:text-stone-300 p-1.5 rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits badge */}
        <div className="mt-4 p-3 bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/60 rounded-xl flex items-start gap-2.5 text-xs text-amber-900 dark:text-amber-300 leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
          <div>
            <span className="font-bold">Persistent Cloud Sync:</span> Log in to automatically back up your daily H.O.S.T.E.L. execution scores, notes, and streaks to Firebase Firestore.
          </div>
        </div>

        {/* Configuration Notice if not set up */}
        {!isFirebaseConfigured && (
          <div className="mt-3 p-3 bg-amber-50 dark:bg-amber-950/20 border border-amber-300/80 dark:border-amber-800/80 rounded-xl flex items-start gap-2 text-xs text-amber-900 dark:text-amber-300">
            <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div className="flex-1">
              Firebase credentials are read from <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono text-[11px]">.env</code>. Set <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono text-[11px]">VITE_FIREBASE_API_KEY</code> and <code className="bg-amber-100 dark:bg-amber-900/60 px-1 py-0.5 rounded font-mono text-[11px]">VITE_FIREBASE_PROJECT_ID</code> to enable cloud sign-in.
            </div>
          </div>
        )}

        {/* Error Alert */}
        {authError && (
          <div className="mt-3 p-3 bg-rose-50 dark:bg-rose-950/30 border border-rose-200 dark:border-rose-800 rounded-xl flex items-start gap-2 text-xs text-rose-800 dark:text-rose-300">
            <AlertCircle className="w-4 h-4 text-rose-600 dark:text-rose-400 shrink-0 mt-0.5" />
            <div className="flex-1">{authError}</div>
          </div>
        )}

        {/* Google One-Click Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-white dark:bg-stone-800 hover:bg-stone-50 dark:hover:bg-stone-750 border border-stone-300 dark:border-stone-700 rounded-xl text-xs font-semibold text-stone-700 dark:text-stone-200 flex items-center justify-center gap-2.5 shadow-2xs hover:shadow-xs transition-all disabled:opacity-60"
            id="google-signin-btn"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-amber-600 dark:text-amber-400" />
            ) : (
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
          </button>
        </div>

        {/* Divider */}
        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-stone-200 dark:border-stone-800"></div>
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-stone-400 dark:text-stone-500">
            <span className="bg-white dark:bg-stone-900 px-2">or with email</span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase mb-1">
                Display Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Student Sairuto"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-850 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hostel.student@college.edu"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-850 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-stone-700 dark:text-stone-300 uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 dark:text-stone-500 absolute left-3 top-2.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-850 dark:text-stone-100 placeholder-stone-400 dark:placeholder-stone-500 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-stone-900 dark:bg-stone-100 hover:bg-stone-800 dark:hover:bg-stone-200 text-white dark:text-stone-900 rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-60 mt-4"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-white dark:text-stone-900" />
            ) : mode === 'signin' ? (
              <>
                <LogIn className="w-4 h-4" />
                <span>Sign In</span>
              </>
            ) : (
              <>
                <UserPlus className="w-4 h-4" />
                <span>Create Account</span>
              </>
            )}
          </button>
        </form>

        {/* Mode Toggle Footer */}
        <div className="mt-4 pt-3 border-t border-stone-100 dark:border-stone-800 flex flex-col items-center gap-2.5 text-center">
          {mode === 'signin' ? (
            <p className="text-xs text-stone-500 dark:text-stone-400">
              New here?{' '}
              <button
                type="button"
                onClick={() => {
                  clearAuthError();
                  setMode('signup');
                }}
                className="font-bold text-amber-700 dark:text-amber-400 hover:underline"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  clearAuthError();
                  setMode('signin');
                }}
                className="font-bold text-amber-700 dark:text-amber-400 hover:underline"
              >
                Sign in
              </button>
            </p>
          )}

          <div className="w-full pt-2 border-t border-stone-100 dark:border-stone-800">
            <button
              type="button"
              onClick={handleQuickDemoSignIn}
              disabled={submitting}
              className="w-full py-1.5 px-3 rounded-lg bg-amber-50/70 dark:bg-amber-950/30 hover:bg-amber-100/70 dark:hover:bg-amber-900/40 border border-amber-200/80 dark:border-amber-800/60 text-[11px] font-semibold text-amber-800 dark:text-amber-300 flex items-center justify-center gap-1.5 transition-colors"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
              <span>Instant Test: Sign In with Demo Student Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

import React, { useState } from 'react';
import { X, LogIn, UserPlus, Mail, Lock, User, Cloud, ShieldCheck, AlertCircle, Loader2, Sparkles, AlertTriangle, CheckCircle2, Terminal, Code2, KeyRound } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { signInWithGoogle, signInWithEmail, signUpWithEmail, signInWithDevBypass, authError, clearAuthError, isFirebaseConfigured } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [signupSuccessMsg, setSignupSuccessMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleClose = () => {
    clearAuthError();
    setSignupSuccessMsg(null);
    onClose();
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    clearAuthError();
    setSignupSuccessMsg(null);
    try {
      const res = await signInWithGoogle();
      if (res?.success) {
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
    setSignupSuccessMsg(null);
    try {
      if (mode === 'signin') {
        const res = await signInWithEmail(email, password);
        if (res?.success) {
          handleClose();
        }
      } else {
        const res = await signUpWithEmail(email, password, name);
        if (res?.success) {
          setMode('signin');
          setSignupSuccessMsg(
            'Account created successfully! Please enter your password to log in and access the system.'
          );
        }
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleQuickDemoSignIn = async () => {
    setSubmitting(true);
    clearAuthError();
    setSignupSuccessMsg(null);
    const demoEmail = 'student.demo@hostelapp.internal';
    const demoPass = 'hostelPass123!';
    try {
      // Attempt sign in first
      const signInRes = await signInWithEmail(demoEmail, demoPass);
      if (!signInRes?.success) {
        // If account doesn't exist, create it
        await signUpWithEmail(demoEmail, demoPass, 'Hostel Scholar (Demo)');
        await signInWithEmail(demoEmail, demoPass);
      }
      if (auth.currentUser) {
        handleClose();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#121815]/70 backdrop-blur-xs">
      <div
        className="bg-[#fcfbfa] dark:bg-[#18221d] rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#e4e1d6] dark:border-[#28362e]"
        id="auth-modal"
      >
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-[#e5e1d7] dark:border-[#28382e]">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#2d5641]/10 dark:bg-[#7fc09d]/15 flex items-center justify-center text-[#2d5641] dark:text-[#7fc09d]">
              <Cloud className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-base font-bold text-[#1b2620] dark:text-[#edf0ec]">
                {mode === 'signin' ? 'Sign In to Cloud Sync' : 'Create System Account'}
              </h3>
              <p className="text-xs text-[#526357] dark:text-[#9bb0a2]">
                Store and synchronize your daily records in Firestore
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="text-[#798b7f] dark:text-[#6e8275] hover:text-[#1b2620] dark:hover:text-[#edf0ec] p-1.5 rounded-lg hover:bg-[#edeae0] dark:hover:bg-[#223128] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Benefits badge */}
        <div className="mt-4 p-3 bg-[#f5f3ec] dark:bg-[#1c2720] border border-[#dedad0] dark:border-[#2c3d33] rounded-xl flex items-start gap-2.5 text-xs text-[#526357] dark:text-[#9bb0a2] leading-relaxed">
          <ShieldCheck className="w-4 h-4 text-[#2d5641] dark:text-[#7fc09d] shrink-0 mt-0.5" />
          <div>
            <span className="font-semibold text-[#1b2620] dark:text-[#edf0ec]">Persistent Cloud Sync:</span> Log in to automatically back up your daily H.O.S.T.E.L. execution scores, notes, and streaks to Firebase Firestore.
          </div>
        </div>

        {/* Configuration Notice if not set up */}
        {!isFirebaseConfigured && (
          <div className="mt-3 p-3 bg-[#deb16d]/15 dark:bg-[#deb16d]/10 border border-[#deb16d]/30 rounded-xl flex items-start gap-2 text-xs text-[#9c691c] dark:text-[#f2d08a]">
            <AlertTriangle className="w-4 h-4 text-[#deb16d] shrink-0 mt-0.5" />
            <div className="flex-1">
              Firebase credentials are read from <code className="bg-[#deb16d]/20 px-1 py-0.5 rounded font-mono text-[11px]">.env</code>. Set <code className="bg-[#deb16d]/20 px-1 py-0.5 rounded font-mono text-[11px]">VITE_FIREBASE_API_KEY</code> and <code className="bg-[#deb16d]/20 px-1 py-0.5 rounded font-mono text-[11px]">VITE_FIREBASE_PROJECT_ID</code> to enable cloud sign-in.
            </div>
          </div>
        )}

        {/* Signup Success Banner */}
        {signupSuccessMsg && (
          <div className="mt-3 p-3 bg-[#2d5641]/10 dark:bg-[#7fc09d]/15 border border-[#2d5641]/30 dark:border-[#7fc09d]/30 rounded-xl flex items-start gap-2 text-xs text-[#244b36] dark:text-[#88d2af] animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-[#2d5641] dark:text-[#7fc09d] shrink-0 mt-0.5" />
            <div className="flex-1 font-medium">{signupSuccessMsg}</div>
          </div>
        )}

        {/* Error Alert */}
        {authError && (
          <div className="mt-3 p-3 bg-[#c06541]/10 dark:bg-[#e88d6a]/15 border border-[#c06541]/30 dark:border-[#e88d6a]/30 rounded-xl flex items-start gap-2 text-xs text-[#b25735] dark:text-[#f09a79]">
            <AlertCircle className="w-4 h-4 text-[#c06541] dark:text-[#e88d6a] shrink-0 mt-0.5" />
            <div className="flex-1">{authError}</div>
          </div>
        )}

        {/* Google One-Click Button */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleGoogleSignIn}
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-[#fcfbfa] dark:bg-[#1c2720] hover:bg-[#edeae0] dark:hover:bg-[#233229] border border-[#dedad0] dark:border-[#2c3d33] rounded-xl text-xs font-semibold text-[#1b2620] dark:text-[#edf0ec] flex items-center justify-center gap-2.5 shadow-2xs hover:shadow-xs transition-all disabled:opacity-60 cursor-pointer"
            id="google-signin-btn"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#2d5641] dark:text-[#7fc09d]" />
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
            <div className="w-full border-t border-[#dedad0] dark:border-[#28382e]"></div>
          </div>
          <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-[#798b7f] dark:text-[#6e8275]">
            <span className="bg-[#fcfbfa] dark:bg-[#18221d] px-2">or with email</span>
          </div>
        </div>

        {/* Email Form */}
        <form onSubmit={handleSubmit} className="space-y-3">
          {mode === 'signup' && (
            <div>
              <label className="block text-[11px] font-bold text-[#344339] dark:text-[#d3ded7] uppercase mb-1">
                Display Name
              </label>
              <div className="relative">
                <User className="w-4 h-4 text-[#798b7f] dark:text-[#6e8275] absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Student Sairuto"
                  className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#dedad0] dark:border-[#2c3d33] bg-[#f5f3ec] dark:bg-[#1c2720] text-[#1b2620] dark:text-[#edf0ec] placeholder-[#798b7f] dark:placeholder-[#6e8275] focus:outline-hidden focus:ring-1 focus:ring-[#2d5641]"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-[11px] font-bold text-[#344339] dark:text-[#d3ded7] uppercase mb-1">
              Email Address
            </label>
            <div className="relative">
              <Mail className="w-4 h-4 text-[#798b7f] dark:text-[#6e8275] absolute left-3 top-2.5" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="hostel.student@college.edu"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#dedad0] dark:border-[#2c3d33] bg-[#f5f3ec] dark:bg-[#1c2720] text-[#1b2620] dark:text-[#edf0ec] placeholder-[#798b7f] dark:placeholder-[#6e8275] focus:outline-hidden focus:ring-1 focus:ring-[#2d5641]"
              />
            </div>
          </div>

          <div>
            <label className="block text-[11px] font-bold text-[#344339] dark:text-[#d3ded7] uppercase mb-1">
              Password
            </label>
            <div className="relative">
              <Lock className="w-4 h-4 text-[#798b7f] dark:text-[#6e8275] absolute left-3 top-2.5" />
              <input
                type="password"
                required
                minLength={6}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="At least 6 characters"
                className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-[#dedad0] dark:border-[#2c3d33] bg-[#f5f3ec] dark:bg-[#1c2720] text-[#1b2620] dark:text-[#edf0ec] placeholder-[#798b7f] dark:placeholder-[#6e8275] focus:outline-hidden focus:ring-1 focus:ring-[#2d5641]"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-[#2d5641] hover:bg-[#234534] dark:bg-[#7fc09d] dark:hover:bg-[#90d2af] text-white dark:text-[#0f1d15] rounded-xl text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-colors disabled:opacity-60 mt-4 cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-white dark:text-[#0f1d15]" />
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
        <div className="mt-4 pt-3 border-t border-[#e5e1d7] dark:border-[#28382e] flex flex-col items-center gap-2.5 text-center">
          {mode === 'signin' ? (
            <p className="text-xs text-[#526357] dark:text-[#9bb0a2]">
              New here?{' '}
              <button
                type="button"
                onClick={() => {
                  clearAuthError();
                  setMode('signup');
                }}
                className="font-semibold text-[#2d5641] dark:text-[#7fc09d] hover:underline cursor-pointer"
              >
                Create an account
              </button>
            </p>
          ) : (
            <p className="text-xs text-[#526357] dark:text-[#9bb0a2]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={() => {
                  clearAuthError();
                  setMode('signin');
                }}
                className="font-semibold text-[#2d5641] dark:text-[#7fc09d] hover:underline cursor-pointer"
              >
                Sign in
              </button>
            </p>
          )}

          <div className="w-full pt-2 border-t border-[#e5e1d7] dark:border-[#28382e] space-y-2">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => {
                  signInWithDevBypass('developer');
                  handleClose();
                }}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#f5f3ec] dark:bg-[#1c2720] hover:bg-[#edeae0] dark:hover:bg-[#233229] border border-[#dedad0] dark:border-[#2c3d33] text-[11px] font-medium text-[#344339] dark:text-[#d3ded7] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title="Bypass as Developer"
              >
                <Code2 className="w-3.5 h-3.5 text-[#2d5641] dark:text-[#7fc09d]" />
                <span>Dev Bypass</span>
              </button>
              <button
                type="button"
                onClick={() => {
                  signInWithDevBypass('tester');
                  handleClose();
                }}
                className="flex-1 py-1.5 px-2 rounded-lg bg-[#f5f3ec] dark:bg-[#1c2720] hover:bg-[#edeae0] dark:hover:bg-[#233229] border border-[#dedad0] dark:border-[#2c3d33] text-[11px] font-medium text-[#344339] dark:text-[#d3ded7] flex items-center justify-center gap-1 transition-colors cursor-pointer"
                title="Bypass as Tester"
              >
                <KeyRound className="w-3.5 h-3.5 text-[#2d5641] dark:text-[#7fc09d]" />
                <span>Tester Bypass</span>
              </button>
            </div>

            <button
              type="button"
              onClick={handleQuickDemoSignIn}
              disabled={submitting}
              className="w-full py-1.5 px-3 rounded-lg bg-[#f5f3ec] dark:bg-[#1c2720] hover:bg-[#edeae0] dark:hover:bg-[#233229] border border-[#dedad0] dark:border-[#2c3d33] text-[11px] font-medium text-[#344339] dark:text-[#d3ded7] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2d5641] dark:text-[#7fc09d]" />
              <span>Firebase Demo Account</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

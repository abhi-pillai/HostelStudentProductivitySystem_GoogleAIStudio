import React, { useState } from 'react';
import {
  Lock,
  LogIn,
  UserPlus,
  Mail,
  ShieldCheck,
  Flame,
  AlertCircle,
  Loader2,
  Sparkles,
  CheckCircle2,
  Zap,
  Terminal,
  KeyRound,
  Check,
  Code2,
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { auth } from '../lib/firebase';

interface AuthGateProps {
  onSuccess?: () => void;
}

// Supported tester / developer bypass codes
const VALID_DEV_PASSCODES = ['DEV123', 'TESTER', 'HOSTELDEV', 'DEMO99', '123456'];

export const AuthGate: React.FC<AuthGateProps> = ({ onSuccess }) => {
  const {
    signInWithGoogle,
    signInWithEmail,
    signUpWithEmail,
    signInWithDevBypass,
    authError,
    clearAuthError,
  } = useAuth();

  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [signupSuccessMsg, setSignupSuccessMsg] = useState<string | null>(null);

  // Dev & Tester bypass states
  const [showDevPanel, setShowDevPanel] = useState(false);
  const [devCodeInput, setDevCodeInput] = useState('');
  const [devCodeError, setDevCodeError] = useState<string | null>(null);

  const handleDevBypassSubmit = (codeToTest?: string) => {
    const code = (codeToTest || devCodeInput).trim().toUpperCase();
    if (!code) {
      setDevCodeError('Please enter a developer or tester passcode');
      return;
    }
    if (VALID_DEV_PASSCODES.includes(code)) {
      const role = code === 'TESTER' ? 'tester' : 'developer';
      signInWithDevBypass(role);
      if (onSuccess) {
        onSuccess();
      }
    } else {
      setDevCodeError(`Invalid code "${code}". Try: DEV123 or TESTER`);
    }
  };

  const handleGoogleSignIn = async () => {
    setSubmitting(true);
    clearAuthError();
    setSignupSuccessMsg(null);
    try {
      await signInWithGoogle();
      if (auth.currentUser && onSuccess) {
        onSuccess();
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
      if (mode === 'signup') {
        const res = await signUpWithEmail(email, password, name);
        if (res?.success) {
          setMode('signin');
          setSignupSuccessMsg(
            'Account created successfully! Please enter your password to log in and access the system.'
          );
        }
      } else {
        const res = await signInWithEmail(email, password);
        if (res?.success && onSuccess) {
          onSuccess();
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
      const signInRes = await signInWithEmail(demoEmail, demoPass);
      if (!signInRes?.success) {
        await signUpWithEmail(demoEmail, demoPass, 'Hostel Scholar (Demo)');
        await signInWithEmail(demoEmail, demoPass);
      }
      if (auth.currentUser && onSuccess) {
        onSuccess();
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      className="min-h-screen bg-[#121815] text-[#edf0ec] flex flex-col items-center justify-center p-4 sm:p-6"
      id="auth-gate-screen"
    >
      {/* Background Subtle Ambience */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none opacity-25">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-[#2d5641] blur-3xl" />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full bg-[#3d7053] blur-3xl" />
      </div>

      <div className="relative w-full max-w-md">
        {/* Main Card */}
        <div className="bg-[#18221d] rounded-2xl p-6 sm:p-8 shadow-2xl border border-[#28362e]">
          {/* Header Brand */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-gradient-to-tr from-[#2d5641] to-[#4e8568] text-[#f4f7f4] font-black text-xl shadow-lg mb-3">
              HL
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-[#edf0ec]">
              H.O.S.T.E.L. Execution Loop
            </h1>
            <p className="text-xs sm:text-sm text-[#9cb0a2] mt-1 font-medium">
              High Output Student Time Execution Loop
            </p>

            <div className="mt-3 inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#2d5641]/20 border border-[#2d5641]/40 text-[#7fc09d] text-xs font-semibold">
              <Lock className="w-3.5 h-3.5" />
              <span>Authentication Required to Access System</span>
            </div>
          </div>

          {/* Mode Switch Tabs */}
          <div className="flex rounded-xl bg-[#121815] p-1 mb-5 border border-[#233328]">
            <button
              type="button"
              id="tab-btn-signin"
              onClick={() => {
                clearAuthError();
                setSignupSuccessMsg(null);
                setMode('signin');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signin'
                  ? 'bg-[#7fc09d] text-[#0f1d15] shadow-xs'
                  : 'text-[#9cb0a2] hover:text-[#edf0ec]'
              }`}
            >
              <LogIn className="w-3.5 h-3.5" />
              <span>Log In</span>
            </button>
            <button
              type="button"
              id="tab-btn-signup"
              onClick={() => {
                clearAuthError();
                setSignupSuccessMsg(null);
                setMode('signup');
              }}
              className={`flex-1 py-2 rounded-lg text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                mode === 'signup'
                  ? 'bg-[#7fc09d] text-[#0f1d15] shadow-xs'
                  : 'text-[#9cb0a2] hover:text-[#edf0ec]'
              }`}
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Create Account</span>
            </button>
          </div>

          {/* Sign Up Success / Transition Banner */}
          {signupSuccessMsg && (
            <div className="mb-4 p-3 bg-[#2d5641]/20 border border-[#2d5641]/50 rounded-xl flex items-start gap-2 text-xs text-[#88d2af] animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-[#7fc09d] shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{signupSuccessMsg}</div>
            </div>
          )}

          {/* Error Alert */}
          {authError && (
            <div className="mb-4 p-3 bg-[#c06541]/15 border border-[#c06541]/40 rounded-xl flex items-start gap-2 text-xs text-[#f09a79] animate-in fade-in">
              <AlertCircle className="w-4 h-4 text-[#e88d6a] shrink-0 mt-0.5" />
              <div className="flex-1">{authError}</div>
            </div>
          )}

          {/* Google Quick Sign-In */}
          <button
            type="button"
            id="gate-google-btn"
            onClick={handleGoogleSignIn}
            disabled={submitting}
            className="w-full py-2.5 px-4 bg-[#1f2c25] hover:bg-[#25362c] border border-[#2c3e34] rounded-xl text-xs font-semibold text-[#edf0ec] flex items-center justify-center gap-2.5 shadow-sm transition-all disabled:opacity-60 cursor-pointer"
          >
            {submitting ? (
              <Loader2 className="w-4 h-4 animate-spin text-[#7fc09d]" />
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
            <span>
              {mode === 'signin' ? 'Sign in with Google' : 'Sign up with Google'}
            </span>
          </button>

          {/* Divider */}
          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[#28362e]"></div>
            </div>
            <div className="relative flex justify-center text-[11px] uppercase tracking-wider text-[#6e8275]">
              <span className="bg-[#18221d] px-2 font-medium">or continue with email</span>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-3.5">
            {mode === 'signup' && (
              <div>
                <label className="block text-[11px] font-bold text-[#d3ded7] uppercase tracking-wide mb-1">
                  Student Name
                </label>
                <input
                  type="text"
                  required
                  id="gate-input-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Sairuto Pillai"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#2c3e34] bg-[#121815] text-[#edf0ec] placeholder-[#6e8275] focus:outline-hidden focus:ring-1 focus:ring-[#7fc09d]"
                />
              </div>
            )}

            <div>
              <label className="block text-[11px] font-bold text-[#d3ded7] uppercase tracking-wide mb-1">
                Email Address
              </label>
              <div className="relative">
                <Mail className="w-4 h-4 text-[#6e8275] absolute left-3.5 top-3" />
                <input
                  type="email"
                  required
                  id="gate-input-email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="student@hostel.edu"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-[#2c3e34] bg-[#121815] text-[#edf0ec] placeholder-[#6e8275] focus:outline-hidden focus:ring-1 focus:ring-[#7fc09d]"
                />
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-bold text-[#d3ded7] uppercase tracking-wide mb-1">
                Password
              </label>
              <div className="relative">
                <Lock className="w-4 h-4 text-[#6e8275] absolute left-3.5 top-3" />
                <input
                  type="password"
                  required
                  minLength={6}
                  id="gate-input-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="At least 6 characters"
                  className="w-full pl-10 pr-3.5 py-2.5 text-xs rounded-xl border border-[#2c3e34] bg-[#121815] text-[#edf0ec] placeholder-[#6e8275] focus:outline-hidden focus:ring-1 focus:ring-[#7fc09d]"
                />
              </div>
            </div>

            <button
              type="submit"
              id="gate-submit-btn"
              disabled={submitting}
              className="w-full py-2.5 px-4 bg-[#2d5641] hover:bg-[#3d7053] text-[#f4f7f4] font-semibold rounded-xl text-xs flex items-center justify-center gap-2 shadow-2xs transition-all disabled:opacity-60 mt-4 cursor-pointer"
            >
              {submitting ? (
                <Loader2 className="w-4 h-4 animate-spin text-[#edf0ec]" />
              ) : mode === 'signin' ? (
                <>
                  <LogIn className="w-4 h-4" />
                  <span>Log In to Access Features</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Create Account</span>
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Student Access & Dev/Tester Bypass */}
          <div className="mt-5 pt-4 border-t border-[#28362e] space-y-3">
            {/* Tester & Dev Bypass Box */}
            <div className="bg-[#121815] rounded-xl p-3 border border-[#28362e]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5 text-xs font-semibold text-[#edf0ec]">
                  <Terminal className="w-3.5 h-3.5 text-[#7fc09d]" />
                  <span>Dev & Tester Bypass (No Sign-In Required)</span>
                </div>
                <button
                  type="button"
                  onClick={() => setShowDevPanel(!showDevPanel)}
                  className="text-[10px] text-[#7fc09d] hover:underline font-mono cursor-pointer"
                >
                  {showDevPanel ? 'Hide Codes' : 'Enter Passcode'}
                </button>
              </div>

              {/* 1-Click Quick Bypass Buttons */}
              <div className="grid grid-cols-2 gap-2 mt-2.5">
                <button
                  type="button"
                  id="btn-bypass-developer"
                  onClick={() => handleDevBypassSubmit('DEV123')}
                  className="py-1.5 px-2.5 rounded-lg bg-[#18221d] hover:bg-[#1f2c25] border border-[#2c3e34] text-[11px] font-medium text-[#edf0ec] flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  title="Instant bypass as Developer (Code: DEV123)"
                >
                  <Code2 className="w-3.5 h-3.5 text-[#7fc09d]" />
                  <span>Dev Bypass (DEV123)</span>
                </button>

                <button
                  type="button"
                  id="btn-bypass-tester"
                  onClick={() => handleDevBypassSubmit('TESTER')}
                  className="py-1.5 px-2.5 rounded-lg bg-[#18221d] hover:bg-[#1f2c25] border border-[#2c3e34] text-[11px] font-medium text-[#edf0ec] flex items-center justify-center gap-1.5 transition-all shadow-2xs cursor-pointer"
                  title="Instant bypass as QA Tester (Code: TESTER)"
                >
                  <KeyRound className="w-3.5 h-3.5 text-[#deb16d]" />
                  <span>Tester Bypass (TESTER)</span>
                </button>
              </div>

              {/* Expandable Manual Passcode Input */}
              {showDevPanel && (
                <div className="mt-3 pt-2.5 border-t border-[#28362e]">
                  <p className="text-[10px] text-[#9cb0a2] mb-1.5">
                    Enter test code: <span className="font-mono text-[#7fc09d]">DEV123</span> or <span className="font-mono text-[#deb16d]">TESTER</span>
                  </p>
                  <div className="flex gap-1.5">
                    <input
                      type="text"
                      id="input-dev-passcode"
                      value={devCodeInput}
                      onChange={(e) => {
                        setDevCodeInput(e.target.value);
                        setDevCodeError(null);
                      }}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleDevBypassSubmit();
                        }
                      }}
                      placeholder="e.g. DEV123"
                      className="flex-1 px-2.5 py-1.5 text-xs rounded-lg border border-[#2c3e34] bg-[#0f1712] text-[#edf0ec] placeholder-[#6e8275] font-mono uppercase focus:outline-hidden focus:border-[#7fc09d]"
                    />
                    <button
                      type="button"
                      id="btn-submit-dev-code"
                      onClick={() => handleDevBypassSubmit()}
                      className="px-3 py-1.5 rounded-lg bg-[#2d5641] hover:bg-[#3d7053] text-[#f4f7f4] font-semibold text-xs flex items-center gap-1 shadow-2xs transition-colors cursor-pointer"
                    >
                      <Check className="w-3 h-3 stroke-[2.5]" />
                      <span>Enter</span>
                    </button>
                  </div>
                  {devCodeError && (
                    <p className="text-[10px] text-[#f09a79] mt-1 font-medium flex items-center gap-1">
                      <AlertCircle className="w-3 h-3 shrink-0" />
                      <span>{devCodeError}</span>
                    </p>
                  )}
                </div>
              )}
            </div>

            {/* Standard Demo Account Option */}
            <button
              type="button"
              id="gate-demo-btn"
              onClick={handleQuickDemoSignIn}
              disabled={submitting}
              className="w-full py-2 px-3 rounded-xl bg-[#18221d] hover:bg-[#1f2c25] border border-[#28362e] hover:border-[#384c3f] text-xs font-medium text-[#edf0ec] flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#7fc09d]" />
              <span>Sign in with Demo Account</span>
            </button>
          </div>
        </div>

        {/* Feature Lock Teaser Icons */}
        <div className="mt-5 grid grid-cols-3 gap-2 text-center text-[#9cb0a2] text-[11px]">
          <div className="p-2 rounded-xl bg-[#18221d] border border-[#28362e] flex flex-col items-center gap-1">
            <Flame className="w-4 h-4 text-[#e88d6a]" />
            <span className="font-medium text-[#edf0ec]">Streaks & Badges</span>
            <span className="text-[10px] text-[#6e8275] font-mono">Locked</span>
          </div>
          <div className="p-2 rounded-xl bg-[#18221d] border border-[#28362e] flex flex-col items-center gap-1">
            <Zap className="w-4 h-4 text-[#7fc09d]" />
            <span className="font-medium text-[#edf0ec]">Focus Mode</span>
            <span className="text-[10px] text-[#6e8275] font-mono">Locked</span>
          </div>
          <div className="p-2 rounded-xl bg-[#18221d] border border-[#28362e] flex flex-col items-center gap-1">
            <ShieldCheck className="w-4 h-4 text-[#6db5c0]" />
            <span className="font-medium text-[#edf0ec]">Cloud Sync</span>
            <span className="text-[10px] text-[#6e8275] font-mono">Locked</span>
          </div>
        </div>
      </div>
    </div>
  );
};

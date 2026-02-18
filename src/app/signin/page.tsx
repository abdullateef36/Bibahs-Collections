'use client';

import { useState } from 'react';
import { auth } from '@/lib/firebase';
import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  sendPasswordResetEmail,
} from 'firebase/auth';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, X } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// ─── Floating petal shapes for background ambiance ───────────────────────────
const PETALS = Array.from({ length: 12 }, (_, i) => ({
  id: i,
  size: 40 + Math.random() * 80,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 4,
  duration: 6 + Math.random() * 6,
  opacity: 0.04 + Math.random() * 0.06,
}));

// ─── Google logo SVG ─────────────────────────────────────────────────────────
function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 18 18" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M17.64 9.2045c0-.6381-.0573-1.2518-.1636-1.8409H9v3.4814h4.8436c-.2086 1.125-.8427 2.0782-1.7959 2.7164v2.2581h2.9087C16.6582 14.2527 17.64 11.9455 17.64 9.2045z" fill="#4285F4"/>
      <path d="M9 18c2.43 0 4.4673-.806 5.9564-2.1805l-2.9087-2.2581c-.8064.54-1.8382.8591-3.0477.8591-2.3436 0-4.3282-1.5836-5.036-3.7105H.9574v2.3318C2.4382 15.9832 5.4818 18 9 18z" fill="#34A853"/>
      <path d="M3.964 10.71c-.18-.54-.2827-1.1168-.2827-1.71s.1027-1.17.2827-1.71V4.9582H.9574C.3477 6.1732 0 7.5468 0 9s.3477 2.8268.9574 4.0418L3.964 10.71z" fill="#FBBC05"/>
      <path d="M9 3.5795c1.3214 0 2.5077.4541 3.4405 1.346l2.5813-2.5813C13.4632.8918 11.4259 0 9 0 5.4818 0 2.4382 2.0168.9574 4.9582L3.964 7.29C4.6718 5.1627 6.6564 3.5795 9 3.5795z" fill="#EA4335"/>
    </svg>
  );
}

export default function SignInPage() {
  const [email, setEmail]                       = useState('');
  const [password, setPassword]                 = useState('');
  const [showPassword, setShowPassword]         = useState(false);
  const [loading, setLoading]                   = useState(false);
  const [googleLoading, setGoogleLoading]       = useState(false);
  const [error, setError]                       = useState('');
  const [resetEmail, setResetEmail]             = useState('');
  const [showReset, setShowReset]               = useState(false);
  const [resetSent, setResetSent]               = useState(false);
  const [resetLoading, setResetLoading]         = useState(false);
  const [resetError, setResetError]             = useState('');
  const router = useRouter();

  // ── Email / password sign-in ─────────────────────────────────────────────
  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (!auth) throw new Error('Service not available. Please try again later.');
      await signInWithEmailAndPassword(auth, email.trim(), password);
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error) {
        const msg = err.message;
        if (msg.includes('user-not-found') || msg.includes('wrong-password') || msg.includes('invalid-credential')) {
          setError('Invalid email or password. Please try again.');
        } else if (msg.includes('too-many-requests')) {
          setError('Too many failed attempts. Please try again later.');
        } else if (msg.includes('network-request-failed')) {
          setError('Network error. Please check your internet connection.');
        } else if (msg.includes('user-disabled')) {
          setError('This account has been disabled. Please contact support.');
        } else {
          setError('Sign-in failed. Please try again.');
        }
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Google sign-in ───────────────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    setGoogleLoading(true);
    setError('');
    try {
      if (!auth) throw new Error('Service not available.');
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      router.push('/');
    } catch (err: unknown) {
      if (err instanceof Error && !err.message.includes('popup-closed-by-user')) {
        setError('Google sign-in failed. Please try again.');
      }
    } finally {
      setGoogleLoading(false);
    }
  };

  // ── Password reset ───────────────────────────────────────────────────────
  const handlePasswordReset = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setResetLoading(true);
    setResetError('');
    try {
      if (!auth) throw new Error('Service not available.');
      await sendPasswordResetEmail(auth, resetEmail.trim());
      setResetSent(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        if (err.message.includes('user-not-found')) {
          setResetError('No account found with this email.');
        } else if (err.message.includes('invalid-email')) {
          setResetError('Please enter a valid email address.');
        } else {
          setResetError('Failed to send reset email. Please try again.');
        }
      }
    } finally {
      setResetLoading(false);
    }
  };

  const closeReset = () => {
    setShowReset(false);
    setResetSent(false);
    setResetEmail('');
    setResetError('');
  };

  // ── Animation variants ───────────────────────────────────────────────────
  const containerVariants: Variants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.08, delayChildren: 0.15 } },
  };
  const itemVariants: Variants = {
    hidden:  { opacity: 0, y: 18 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' as const } },
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center relative overflow-hidden px-4">

      {/* ── Ambient background petals ── */}
      <div className="absolute inset-0 pointer-events-none">
        {PETALS.map((p) => (
          <motion.div
            key={p.id}
            className="absolute rounded-full bg-[#FF9B9B]"
            style={{
              width:  p.size,
              height: p.size,
              left:   `${p.x}%`,
              top:    `${p.y}%`,
              opacity: p.opacity,
              filter: 'blur(40px)',
            }}
            animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
            transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        {/* Top-right large glow */}
        <div className="absolute -top-32 -right-32 w-125 h-125 rounded-full bg-[#FF9B9B]/8 blur-[120px]" />
        {/* Bottom-left glow */}
        <div className="absolute -bottom-32 -left-32 w-100 h-100 rounded-full bg-[#FFB8B8]/6 blur-[100px]" />
      </div>

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-md"
      >
        {/* Subtle card glow ring */}
        <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-[#FF9B9B]/30 via-transparent to-[#FFB8B8]/10 pointer-events-none" />

        <div className="relative bg-[#1A1A1A] rounded-2xl border border-white/8 p-8 sm:p-10 shadow-2xl shadow-black/60">

          {/* ── Logo + heading ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center mb-8"
          >
            <motion.div variants={itemVariants} className="relative w-20 h-20 mb-4">
              <Image
                src="/logo.png"
                alt="Bibah's Collections"
                fill
                className="object-contain"
                priority
              />
            </motion.div>

            <motion.h1
              variants={itemVariants}
              className="font-heading text-4xl text-white tracking-widest uppercase text-center"
            >
              Welcome Back
            </motion.h1>
            <motion.p
              variants={itemVariants}
              className="font-body text-white/50 text-sm mt-1 text-center tracking-wide"
            >
              Sign in to your Bibah&apos;s account
            </motion.p>
          </motion.div>

          {/* ── Form ── */}
          <motion.form
            onSubmit={handleSignIn}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-5"
          >
            {/* Error */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="bg-[#FF9B9B]/10 border border-[#FF9B9B]/30 rounded-xl px-4 py-3"
                >
                  <p className="font-body text-sm text-[#FF9B9B]">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="block font-body text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#FF9B9B] transition-colors duration-300"
                />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 font-body text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#FF9B9B]/60 focus:bg-white/7 transition-all duration-300 disabled:opacity-50"
                />
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <div className="flex items-center justify-between mb-2">
                <label className="block font-body text-xs font-semibold text-white/50 uppercase tracking-widest">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => { setShowReset(true); setResetEmail(email); }}
                  className="font-body text-xs text-[#FF9B9B]/70 hover:text-[#FF9B9B] transition-colors bg-transparent border-none p-0 cursor-pointer tracking-wide"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative group">
                <Lock
                  size={16}
                  className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#FF9B9B] transition-colors duration-300"
                />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-12 py-3.5 font-body text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#FF9B9B]/60 focus:bg-white/7 transition-all duration-300 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#FF9B9B] transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                type="submit"
                disabled={loading || googleLoading}
                whileHover={!loading ? { scale: 1.02, boxShadow: '0 8px 30px rgba(255,155,155,0.35)' } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full bg-linear-to-r from-[#FF9B9B] to-[#FFB8B8] text-[#1A1A1A] font-body font-bold text-sm uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-[#FF9B9B]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#1A1A1A]/40 border-t-[#1A1A1A] rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  <>
                    Sign In
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Divider */}
            <motion.div variants={itemVariants} className="flex items-center gap-4 py-1">
              <div className="flex-1 h-px bg-white/10" />
              <span className="font-body text-xs text-white/30 uppercase tracking-widest">or</span>
              <div className="flex-1 h-px bg-white/10" />
            </motion.div>

            {/* Google */}
            <motion.div variants={itemVariants}>
              <motion.button
                type="button"
                onClick={handleGoogleSignIn}
                disabled={loading || googleLoading}
                whileHover={!googleLoading ? { scale: 1.02, borderColor: 'rgba(255,155,155,0.4)' } : {}}
                whileTap={!googleLoading ? { scale: 0.98 } : {}}
                className="w-full bg-white/5 border border-white/10 rounded-xl py-3.5 font-body font-semibold text-sm text-white/80 hover:text-white transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-3"
              >
                {googleLoading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/20 border-t-white/60 rounded-full animate-spin" />
                    Connecting...
                  </>
                ) : (
                  <>
                    <GoogleIcon />
                    Continue with Google
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Sign-up link */}
            <motion.p variants={itemVariants} className="text-center font-body text-sm text-white/40 pt-2">
              New to Bibah&apos;s?{' '}
              <Link
                href="/signup"
                className="text-[#FF9B9B] font-semibold hover:text-[#FFB8B8] transition-colors"
              >
                Create an account
              </Link>
            </motion.p>
          </motion.form>
        </div>
      </motion.div>

      {/* ── Password Reset Modal ── */}
      <AnimatePresence>
        {showReset && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm"
              onClick={closeReset}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, scale: 0.92, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.92, y: 20 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <div className="relative w-full max-w-sm bg-[#1A1A1A] border border-white/10 rounded-2xl p-8 shadow-2xl shadow-black/80">

                {/* Close */}
                <button
                  onClick={closeReset}
                  className="absolute top-4 right-4 text-white/30 hover:text-white transition-colors bg-transparent border-none p-1 cursor-pointer"
                >
                  <X size={18} />
                </button>

                <AnimatePresence mode="wait">
                  {!resetSent ? (
                    <motion.div
                      key="form"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      <h2 className="font-heading text-2xl text-white uppercase tracking-widest mb-1">
                        Reset Password
                      </h2>
                      <p className="font-body text-sm text-white/40 mb-6">
                        Enter your email and we&apos;ll send a reset link.
                      </p>

                      <form onSubmit={handlePasswordReset} className="space-y-4">
                        <div className="relative group">
                          <Mail
                            size={16}
                            className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#FF9B9B] transition-colors"
                          />
                          <input
                            type="email"
                            placeholder="you@example.com"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            required
                            className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 font-body text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#FF9B9B]/60 transition-all"
                          />
                        </div>

                        {resetError && (
                          <p className="font-body text-xs text-[#FF9B9B]">{resetError}</p>
                        )}

                        <motion.button
                          type="submit"
                          disabled={resetLoading}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="w-full bg-linear-to-r from-[#FF9B9B] to-[#FFB8B8] text-[#1A1A1A] font-body font-bold text-sm uppercase tracking-widest py-3.5 rounded-xl flex items-center justify-center gap-2 disabled:opacity-50"
                        >
                          {resetLoading ? (
                            <div className="w-4 h-4 border-2 border-[#1A1A1A]/40 border-t-[#1A1A1A] rounded-full animate-spin" />
                          ) : 'Send Reset Link'}
                        </motion.button>
                      </form>
                    </motion.div>
                  ) : (
                    <motion.div
                      key="success"
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="text-center py-4"
                    >
                      {/* Pink check circle */}
                      <div className="w-16 h-16 rounded-full bg-[#FF9B9B]/15 border border-[#FF9B9B]/30 flex items-center justify-center mx-auto mb-4">
                        <svg width="28" height="28" viewBox="0 0 28 28" fill="none">
                          <path d="M6 14l6 6 10-12" stroke="#FF9B9B" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                        </svg>
                      </div>
                      <h3 className="font-heading text-xl text-white uppercase tracking-widest mb-2">Email Sent!</h3>
                      <p className="font-body text-sm text-white/40 mb-6">
                        Check your inbox for the password reset link.
                      </p>
                      <button
                        onClick={closeReset}
                        className="font-body text-sm text-[#FF9B9B] hover:text-[#FFB8B8] transition-colors bg-transparent border-none p-0 cursor-pointer tracking-wide"
                      >
                        Back to sign in
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
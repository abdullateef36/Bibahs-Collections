'use client';

import { useState } from 'react';
import { auth, db } from '@/lib/firebase';
import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth';
import { doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { Mail, Lock, User, Eye, EyeOff, Phone, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

// ─── Ambient background blobs ─────────────────────────────────────────────────
const BLOBS = Array.from({ length: 10 }, (_, i) => ({
  id: i,
  size: 60 + Math.random() * 100,
  x: Math.random() * 100,
  y: Math.random() * 100,
  delay: Math.random() * 4,
  duration: 7 + Math.random() * 6,
  opacity: 0.03 + Math.random() * 0.05,
}));

export default function SignupPage() {
  const [email, setEmail]                           = useState('');
  const [fullName, setFullName]                     = useState('');
  const [phoneNumber, setPhoneNumber]               = useState('');
  const [password, setPassword]                     = useState('');
  const [gender, setGender]                         = useState<'male' | 'female' | ''>('');
  const [confirmPassword, setConfirmPassword]       = useState('');
  const [loading, setLoading]                       = useState(false);
  const [showPassword, setShowPassword]             = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError]                           = useState('');
  const router = useRouter();

  const handleSignup = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (!fullName.trim())     { setError('Please enter your full name.');      setLoading(false); return; }
    if (!email.trim())        { setError('Please enter your email.');          setLoading(false); return; }
    if (!phoneNumber.trim())  { setError('Please enter your phone number.');   setLoading(false); return; }
    if (!gender)              { setError('Please select your gender.');        setLoading(false); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters.'); setLoading(false); return; }
    if (password !== confirmPassword) { setError('Passwords do not match.');   setLoading(false); return; }

    try {
      if (!auth || !db) throw new Error('Service not available. Please try again later.');

      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      await updateProfile(userCredential.user, { displayName: fullName.trim() });
      await userCredential.user.reload();

      await setDoc(doc(db, 'users', userCredential.user.uid), {
        uid:         userCredential.user.uid,
        email:       email.toLowerCase().trim(),
        displayName: fullName.trim(),
        fullName:    fullName.trim(),
        phoneNumber: phoneNumber.trim(),
        gender,
        role:        'user',
        createdAt:   serverTimestamp(),
        isAdmin:     false,
      });

      setEmail(''); setPhoneNumber(''); setFullName('');
      setPassword(''); setConfirmPassword(''); setGender('');

      setTimeout(() => router.push('/'), 100);

    } catch (err: unknown) {
      if (err instanceof Error) {
        const msg = err.message;
        if (msg.includes('email-already-in-use'))   setError('This email is already registered. Please sign in instead.');
        else if (msg.includes('weak-password'))     setError('Password is too weak. Please use a stronger password.');
        else if (msg.includes('invalid-email'))     setError('Invalid email address.');
        else if (msg.includes('network-request-failed')) setError('Network error. Check your internet connection.');
        else if (msg.includes('too-many-requests')) setError('Too many attempts. Please try again later.');
        else setError('Sign up failed. Please try again.');
      } else {
        setError('An unexpected error occurred. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  // ── Animation variants ───────────────────────────────────────────────────
  const containerVariants: Variants = {
    hidden:  { opacity: 0 },
    visible: { opacity: 1, transition: { staggerChildren: 0.07, delayChildren: 0.1 } },
  };
  const itemVariants: Variants = {
    hidden:  { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: 'easeOut' as const } },
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] flex items-center justify-center relative overflow-hidden px-4 py-12">

      {/* ── Ambient blobs ── */}
      <div className="absolute inset-0 pointer-events-none">
        {BLOBS.map((b) => (
          <motion.div
            key={b.id}
            className="absolute rounded-full bg-[#FF9B9B]"
            style={{ width: b.size, height: b.size, left: `${b.x}%`, top: `${b.y}%`, opacity: b.opacity, filter: 'blur(50px)' }}
            animate={{ y: [-20, 20, -20], x: [-10, 10, -10] }}
            transition={{ duration: b.duration, delay: b.delay, repeat: Infinity, ease: 'easeInOut' }}
          />
        ))}
        <div className="absolute -top-40 -right-40 w-125 h-125 rounded-full bg-[#FF9B9B]/7 blur-[130px]" />
        <div className="absolute -bottom-40 -left-40 w-100 h-100 rounded-full bg-[#FFB8B8]/5 blur-[110px]" />
      </div>

      {/* ── Card ── */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full max-w-lg"
      >
        {/* Glow ring */}
        <div className="absolute -inset-px rounded-2xl bg-linear-to-br from-[#FF9B9B]/25 via-transparent to-[#FFB8B8]/10 pointer-events-none" />

        <div className="relative bg-[#1A1A1A] rounded-2xl border border-white/8 p-8 sm:p-10 shadow-2xl shadow-black/60">

          {/* ── Logo + heading ── */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="flex flex-col items-center mb-8"
          >
            <motion.div variants={itemVariants} className="relative w-20 h-20 mb-4">
              <Image src="/logo.png" alt="Bibah's Collections" fill className="object-contain" priority />
            </motion.div>
            <motion.h1 variants={itemVariants} className="font-heading text-4xl text-white tracking-widest uppercase text-center">
              Create Account
            </motion.h1>
            <motion.p variants={itemVariants} className="font-body text-white/50 text-sm mt-1 text-center tracking-wide">
              Join Bibah&apos;s Collections today
            </motion.p>
          </motion.div>

          {/* ── Form ── */}
          <motion.form
            onSubmit={handleSignup}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="space-y-4"
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

            {/* Full Name */}
            <motion.div variants={itemVariants}>
              <label className="block font-body text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                Full Name
              </label>
              <div className="relative group">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#FF9B9B] transition-colors duration-300" />
                <input
                  type="text"
                  placeholder="Jane Doe"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10! pr-4 py-3.5 font-body text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#FF9B9B]/60 focus:bg-white/7 transition-all duration-300 disabled:opacity-50"
                />
              </div>
            </motion.div>

            {/* Email */}
            <motion.div variants={itemVariants}>
              <label className="block font-body text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                Email Address
              </label>
              <div className="relative group">
                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#FF9B9B] transition-colors duration-300" />
                <input
                  type="email"
                  placeholder="you@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10! pr-4 py-3.5 font-body text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#FF9B9B]/60 focus:bg-white/7 transition-all duration-300 disabled:opacity-50"
                />
              </div>
            </motion.div>

            {/* Phone */}
            <motion.div variants={itemVariants}>
              <label className="block font-body text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                Phone Number
              </label>
              <div className="relative group">
                <Phone size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#FF9B9B] transition-colors duration-300" />
                <input
                  type="tel"
                  placeholder="+234 801 234 5678"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10! pr-4 py-3.5 font-body text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#FF9B9B]/60 focus:bg-white/7 transition-all duration-300 disabled:opacity-50"
                />
              </div>
            </motion.div>

            {/* Gender */}
            <motion.div variants={itemVariants}>
              <label className="block font-body text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                Gender
              </label>
              <div className="grid grid-cols-2 gap-3">
                {(['female', 'male'] as const).map((g) => (
                  <motion.label
                    key={g}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className={`flex items-center justify-center py-3.5 px-4 rounded-xl border cursor-pointer transition-all duration-300 font-body font-semibold text-sm uppercase tracking-wider ${
                      gender === g
                        ? 'border-[#FF9B9B] bg-[#FF9B9B]/15 text-[#FF9B9B]'
                        : 'border-white/10 bg-white/5 text-white/50 hover:border-white/20 hover:text-white/70'
                    }`}
                  >
                    <input
                      type="radio"
                      name="gender"
                      value={g}
                      checked={gender === g}
                      onChange={() => setGender(g)}
                      className="sr-only"
                    />
                    {g.charAt(0).toUpperCase() + g.slice(1)}
                  </motion.label>
                ))}
              </div>
            </motion.div>

            {/* Password */}
            <motion.div variants={itemVariants}>
              <label className="block font-body text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                Password
              </label>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#FF9B9B] transition-colors duration-300" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Minimum 6 characters"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10! pr-12 py-3.5 font-body text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#FF9B9B]/60 focus:bg-white/7 transition-all duration-300 disabled:opacity-50"
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

            {/* Confirm Password */}
            <motion.div variants={itemVariants}>
              <label className="block font-body text-xs font-semibold text-white/50 uppercase tracking-widest mb-2">
                Confirm Password
              </label>
              <div className="relative group">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 group-focus-within:text-[#FF9B9B] transition-colors duration-300" />
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="Re-enter your password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={loading}
                  required
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-10! pr-12 py-3.5 font-body text-white placeholder-white/25 text-sm focus:outline-none focus:border-[#FF9B9B]/60 focus:bg-white/7 transition-all duration-300 disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={loading}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-white/30 hover:text-[#FF9B9B] transition-colors bg-transparent border-none p-0 cursor-pointer"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </motion.div>

            {/* Submit */}
            <motion.div variants={itemVariants} className="pt-2">
              <motion.button
                type="submit"
                disabled={loading}
                whileHover={!loading ? { scale: 1.02, boxShadow: '0 8px 30px rgba(255,155,155,0.35)' } : {}}
                whileTap={!loading ? { scale: 0.98 } : {}}
                className="w-full bg-linear-to-r from-[#FF9B9B] to-[#FFB8B8] text-[#1A1A1A] font-body font-bold text-sm uppercase tracking-widest py-4 rounded-xl shadow-lg shadow-[#FF9B9B]/20 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 group"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-[#1A1A1A]/40 border-t-[#1A1A1A] rounded-full animate-spin" />
                    Creating Account...
                  </>
                ) : (
                  <>
                    Create Account
                    <ArrowRight size={16} className="group-hover:translate-x-1 transition-transform duration-300" />
                  </>
                )}
              </motion.button>
            </motion.div>

            {/* Sign in link */}
            <motion.p variants={itemVariants} className="text-center font-body text-sm text-white/40 pt-1">
              Already have an account?{' '}
              <Link href="/signin" className="text-[#FF9B9B] font-semibold hover:text-[#FFB8B8] transition-colors">
                Sign In
              </Link>
            </motion.p>
          </motion.form>
        </div>
      </motion.div>
    </div>
  );
}
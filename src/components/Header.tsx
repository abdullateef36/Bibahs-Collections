'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingCart, User, Menu, X, LogOut } from 'lucide-react';
import { useState, useEffect, useRef, useMemo } from 'react';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';
import Link from 'next/link';
import { auth } from '@/lib/firebase';
import { signOut } from 'firebase/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useUser } from '@/context/UserContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useNotification } from '@/context/NotificationContext';

const navLinks = [
  { name: 'New Arrivals', href: '/' },
  { name: 'Clothing', href: '/clothing' },
  { name: 'Jewelry', href: '/jewelry' },
  { name: 'Bags', href: '/bags' },
  { name: 'Shoes', href: '/shoes' },
  { name: 'Perfumes', href: '/perfumes' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { scrollY } = useScroll();
  const { user, loading } = useUser();
  const router = useRouter();
  const pathname = usePathname();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { current: notification, notify } = useNotification();

  const activeLink = useMemo(() => {
    if (!pathname) return null;
    if (pathname === '/') return 'New Arrivals';
    const match = navLinks.find(
      (link) => link.href !== '/' && pathname.startsWith(link.href)
    );
    return match?.name ?? null;
  }, [pathname]);

  const headerShadow = useTransform(
    scrollY,
    [0, 50],
    ['0px 0px 0px rgba(0,0,0,0)', '0px 4px 24px rgba(0, 0, 0, 0.5)']
  );

  const borderOpacity = useTransform(scrollY, [0, 50], [0.3, 0.6]);

  useEffect(() => {
    if (isSearchOpen) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  }, [isSearchOpen]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsSearchOpen(false);
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, []);

  const handleLogout = async () => {
    try {
      if (!auth) return;
      await signOut(auth);
      router.push('/');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <motion.header
        style={{ boxShadow: headerShadow }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        {/* Search Overlay */}
        <AnimatePresence>
          {isSearchOpen && (
            <motion.div
              className="absolute inset-0 bg-[#1A1A1A] z-10 flex items-center px-4 sm:px-6 lg:px-8"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >
              <div className="flex items-center w-full max-w-7xl mx-auto gap-4">
                <Search size={20} className="text-[#FF9B9B] shrink-0" />
                <input
                  ref={searchInputRef}
                  type="text"
                  placeholder="Search for styles, collections..."
                  className="flex-1 bg-transparent text-white placeholder-white/40 font-body text-base outline-none border-b border-white/20 pb-1 focus:border-[#FF9B9B] transition-colors duration-300"
                />
                <button
                  onClick={() => setIsSearchOpen(false)}
                  className="p-2 text-white/60 hover:text-[#FF9B9B] transition-colors shrink-0 bg-transparent border-none cursor-pointer outline-none focus:outline-none"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <AnimatePresence>
            {notification && (
              <motion.div
                className="absolute right-0 top-full mt-2 rounded-full bg-[#FF9B9B]/10 px-4 py-1 text-sm text-[#FF9B9B]"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
              >
                {notification.message}
              </motion.div>
            )}
          </AnimatePresence>
          <div className="flex items-center justify-between h-18 sm:h-22 lg:h-24">

            {/* Logo */}
            <motion.div
              className="shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <Link href="/" className="flex items-center space-x-2 sm:space-x-3">
                <motion.div
                  className="relative w-16 h-16 sm:w-22 sm:h-20 lg:w-20 lg:h-20"
                  whileHover={{ rotate: 5 }}
                  transition={{ duration: 0.3 }}
                >
                  <Image
                    src="/logo.png"
                    alt="Bibah's Collections Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </motion.div>
                <motion.span
                  className="font-heading text-xl sm:text-3xl text-white hidden sm:block tracking-wide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Bibah&apos;s
                </motion.span>
              </Link>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-10">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  className="relative"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  whileHover={{ y: -2 }}
                >
                  <Link
                    href={link.href}
                    className={`relative font-body font-semibold text-base tracking-tight transition-all duration-300 ${
                      activeLink === link.name
                        ? 'text-[#FF9B9B]'
                        : 'text-white/90 hover:text-[#FF9B9B]'
                    }`}
                  >
                    {link.name}
                  </Link>
                  {activeLink === link.name && (
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-linear-to-r from-[#FF9B9B] to-[#FFB8B8]"
                      layoutId="underline"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.div>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center">

              {/* Desktop icons */}
              <motion.div
                className="hidden lg:flex items-center gap-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <IconButton
                  icon={Search}
                  label="Search"
                  onClick={() => setIsSearchOpen(true)}
                />
                <IconButton
                  icon={Heart}
                  label="Wishlist"
                  badge={wishlistCount}
                  href="/wishlist"
                  onClick={() => notify("Opened wishlist")}
                />
                <IconButton
                  icon={ShoppingCart}
                  label="Cart"
                  badge={cartCount}
                  href="/cart"
                  onClick={() => notify("Opened cart")}
                />

                {/* User / Logout icon — desktop */}
                {!loading && (
                  <AnimatePresence mode="wait">
                    {user ? (
                      <motion.button
                        key="desktop-logout"
                        className="relative text-white/80 hover:text-[#FF9B9B] transition-colors bg-transparent border-none cursor-pointer p-2 outline-none focus:outline-none"
                        onClick={handleLogout}
                        aria-label="Logout"
                        initial={{ opacity: 0, scale: 0.5, rotate: -30 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: 30 }}
                        transition={{ duration: 0.2 }}
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <LogOut size={26} strokeWidth={1.6} />
                      </motion.button>
                    ) : (
                      <motion.div
                        key="desktop-user"
                        initial={{ opacity: 0, scale: 0.5, rotate: 30 }}
                        animate={{ opacity: 1, scale: 1, rotate: 0 }}
                        exit={{ opacity: 0, scale: 0.5, rotate: -30 }}
                        transition={{ duration: 0.2 }}
                      >
                        <IconButton icon={User} label="Profile" href="/login" />
                      </motion.div>
                    )}
                  </AnimatePresence>
                )}
              </motion.div>

              {/* Mobile: cart + wishlist + hamburger */}
              <motion.div
                className="flex lg:hidden items-center gap-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <MobileTopIcon icon={Heart} label="Wishlist" badge={wishlistCount} href="/wishlist" />
                <MobileTopIcon icon={ShoppingCart} label="Cart" badge={cartCount} href="/cart" />

                {/* Hamburger */}
                <motion.button
                  className="shrink-0 text-white hover:text-[#FF9B9B] transition-colors bg-transparent border-none cursor-pointer p-1 outline-none focus:outline-none"
                  onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Toggle menu"
                >
                  <AnimatePresence mode="wait">
                    {isMobileMenuOpen ? (
                      <motion.span
                        key="close"
                        initial={{ rotate: -90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: 90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="block"
                      >
                        <X size={22} strokeWidth={2} />
                      </motion.span>
                    ) : (
                      <motion.span
                        key="menu"
                        initial={{ rotate: 90, opacity: 0 }}
                        animate={{ rotate: 0, opacity: 1 }}
                        exit={{ rotate: -90, opacity: 0 }}
                        transition={{ duration: 0.15 }}
                        className="block"
                      >
                        <Menu size={22} strokeWidth={2} />
                      </motion.span>
                    )}
                  </AnimatePresence>
                </motion.button>
              </motion.div>
            </div>
          </div>
        </div>

        {/* Gradient border */}
        <motion.div
          style={{ opacity: borderOpacity }}
          className="h-px bg-linear-to-r from-transparent via-[#FF9B9B]/50 to-transparent"
        />
      </motion.header>

      {/* Mobile Menu */}
      <motion.div
        className="lg:hidden fixed inset-0 z-40 bg-[#1A1A1A]"
        initial={{ x: '100%' }}
        animate={{ x: isMobileMenuOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <div className="h-full flex flex-col">
          <div className="flex items-center justify-between px-6 h-16 sm:h-20 border-b border-white/10">
            <span className="font-heading text-2xl text-white tracking-wide">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-[#FF9B9B] transition-colors bg-transparent border-none cursor-pointer outline-none focus:outline-none"
            >
              <X size={24} strokeWidth={2} />
            </button>
          </div>
          <nav className="flex-1 px-6 py-8 overflow-y-auto">
            <div className="space-y-2">
              {navLinks.map((link, index) => (
                <motion.div
                  key={link.name}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{
                    opacity: isMobileMenuOpen ? 1 : 0,
                    x: isMobileMenuOpen ? 0 : 50,
                  }}
                  transition={{ delay: 0.05 * index }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Link
                    href={link.href}
                    className={`block px-4 py-4 rounded-xl font-body text-lg font-semibold transition-all ${
                      activeLink === link.name
                        ? 'text-[#FF9B9B] bg-[#FF9B9B]/10'
                        : 'text-white hover:text-[#FF9B9B] hover:bg-white/5'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    {link.name}
                  </Link>
                </motion.div>
              ))}

              {/* Search & Profile/Logout in menu */}
              <div className="pt-4 mt-4 border-t border-white/10 space-y-2">
                <motion.button
                  className="w-full flex items-center gap-3 px-4 py-4 rounded-xl font-body text-lg font-semibold text-white hover:text-[#FF9B9B] hover:bg-white/5 transition-all bg-transparent border-none cursor-pointer text-left outline-none focus:outline-none"
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : 50 }}
                  transition={{ delay: 0.05 * navLinks.length }}
                  onClick={() => { setIsMobileMenuOpen(false); setIsSearchOpen(true); }}
                >
                  <Search size={18} strokeWidth={1.8} />
                  Search
                </motion.button>

                {!loading && (
                  user ? (
                    <motion.button
                      className="w-full flex items-center gap-3 px-4 py-4 rounded-xl font-body text-lg font-semibold text-white hover:text-[#FF9B9B] hover:bg-white/5 transition-all bg-transparent border-none cursor-pointer text-left outline-none focus:outline-none"
                      animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : 50 }}
                      transition={{ delay: 0.05 * (navLinks.length + 1) }}
                      onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }}
                    >
                      <LogOut size={18} strokeWidth={1.8} />
                      Logout
                    </motion.button>
                  ) : (
                    <motion.div
                      animate={{ opacity: isMobileMenuOpen ? 1 : 0, x: isMobileMenuOpen ? 0 : 50 }}
                      transition={{ delay: 0.05 * (navLinks.length + 1) }}
                    >
                      <Link
                        href="/login"
                        className="flex items-center gap-3 px-4 py-4 rounded-xl font-body text-lg font-semibold text-white hover:text-[#FF9B9B] hover:bg-white/5 transition-all"
                        onClick={() => setIsMobileMenuOpen(false)}
                      >
                        <User size={18} strokeWidth={1.8} />
                        Sign In
                      </Link>
                    </motion.div>
                  )
                )}
              </div>
            </div>
          </nav>
        </div>
      </motion.div>

      {/* Spacer */}
      <div className="h-16 sm:h-20 lg:h-24" />
    </>
  );
}

function IconButton({
  icon: Icon,
  label,
  badge,
  onClick,
  href,
}: {
  icon: LucideIcon;
  label: string;
  badge?: number;
  onClick?: () => void;
  href?: string;
}) {
  if (href) {
    return (
      <motion.div
        className="relative text-white/80 hover:text-[#FF9B9B] transition-colors p-2"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <Link href={href} aria-label={label} onClick={onClick} className="block outline-none focus:outline-none">
          <Icon size={26} strokeWidth={1.6} />
        </Link>
        {badge ? (
          <span className="absolute top-0.5 right-0.5 bg-[#FF9B9B] text-[#1A1A1A] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none pointer-events-none">
            {badge}
          </span>
        ) : null}
      </motion.div>
    );
  }

  return (
    <motion.button
      className="relative text-white/80 hover:text-[#FF9B9B] transition-colors bg-transparent border-none cursor-pointer p-2 outline-none focus:outline-none"
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      aria-label={label}
      onClick={onClick}
    >
      <Icon size={26} strokeWidth={1.6} />
      {badge ? (
        <span className="absolute top-0.5 right-0.5 bg-[#FF9B9B] text-[#1A1A1A] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none pointer-events-none">
          {badge}
        </span>
      ) : null}
    </motion.button>
  );
}

function MobileTopIcon({
  icon: Icon,
  label,
  badge,
  onClick,
  href,
}: {
  icon: LucideIcon;
  label: string;
  badge?: number;
  onClick?: () => void;
  href?: string;
}) {
  if (href) {
    return (
      <motion.div
        className="relative shrink-0 text-white/80 hover:text-[#FF9B9B] transition-colors p-1"
        whileTap={{ scale: 0.85 }}
      >
        <Link href={href} aria-label={label} className="block outline-none focus:outline-none">
          <Icon size={20} strokeWidth={1.8} />
        </Link>
        {badge ? (
          <span className="absolute top-0 right-0 bg-[#FF9B9B] text-[#1A1A1A] text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none pointer-events-none">
            {badge}
          </span>
        ) : null}
      </motion.div>
    );
  }

  return (
    <motion.button
      className="relative shrink-0 text-white/80 hover:text-[#FF9B9B] transition-colors bg-transparent border-none cursor-pointer p-1 outline-none focus:outline-none"
      whileTap={{ scale: 0.85 }}
      aria-label={label}
      onClick={onClick}
    >
      <Icon size={20} strokeWidth={1.8} />
      {badge ? (
        <span className="absolute top-0 right-0 bg-[#FF9B9B] text-[#1A1A1A] text-[9px] font-bold rounded-full w-3.5 h-3.5 flex items-center justify-center leading-none pointer-events-none">
          {badge}
        </span>
      ) : null}
    </motion.button>
  );
}
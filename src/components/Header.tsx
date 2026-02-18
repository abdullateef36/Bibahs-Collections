'use client';

import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { Search, Heart, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState, useRef, useEffect } from 'react';
import Image from 'next/image';
import { LucideIcon } from 'lucide-react';

const navLinks = [
  { name: 'Home', href: '#home' },
  { name: 'Shop', href: '#shop' },
  { name: 'New Arrivals', href: '#new' },
  { name: 'About', href: '#about' },
  { name: 'Contact', href: '#contact' },
];

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [activeLink, setActiveLink] = useState('Home');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const { scrollY } = useScroll();

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
                  className="p-2 text-white/60 hover:text-[#FF9B9B] transition-colors shrink-0 bg-transparent border-none cursor-pointer"
                >
                  <X size={20} strokeWidth={2} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">

            {/* Logo */}
            <motion.div
              className="shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <a href="#home" className="flex items-center space-x-3">
                <motion.div
                  className="relative w-12 h-12 sm:w-14 sm:h-14"
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
              </a>
            </motion.div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center space-x-10">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className={`relative font-body font-semibold text-base tracking-tight transition-all duration-300 ${
                    activeLink === link.name
                      ? 'text-[#FF9B9B]'
                      : 'text-white/90 hover:text-[#FF9B9B]'
                  }`}
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 * index }}
                  onClick={() => setActiveLink(link.name)}
                  whileHover={{ y: -2 }}
                >
                  {link.name}
                  {activeLink === link.name && (
                    <motion.div
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-gradient-to-r from-[#FF9B9B] to-[#FFB8B8]"
                      layoutId="underline"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.a>
              ))}
            </nav>

            {/* Right Side */}
            <div className="flex items-center">

              {/* Desktop icons */}
              <motion.div
                className="hidden lg:flex items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <IconButton icon={Search} label="Search" onClick={() => setIsSearchOpen(true)} />
                <IconButton icon={Heart} label="Wishlist" badge={3} />
                <IconButton icon={ShoppingCart} label="Cart" badge={2} />
                <IconButton icon={User} label="Profile" />
              </motion.div>

              {/* Mobile: icons + divider + hamburger — all smaller to fit */}
              <motion.div
                className="flex lg:hidden items-center gap-3"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <MobileTopIcon icon={Search} label="Search" onClick={() => setIsSearchOpen(true)} />
                <MobileTopIcon icon={Heart} label="Wishlist" badge={3} />
                <MobileTopIcon icon={ShoppingCart} label="Cart" badge={2} />
                <MobileTopIcon icon={User} label="Profile" />

                <div className="w-px h-4 bg-white/20 shrink-0" />

                {/* Hamburger — fixed size, won't clip */}
                <motion.button
                  className="shrink-0 text-white hover:text-[#FF9B9B] transition-colors bg-transparent border-none cursor-pointer"
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
                        <X size={20} strokeWidth={2} />
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
                        <Menu size={20} strokeWidth={2} />
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
          className="h-px bg-gradient-to-r from-transparent via-[#FF9B9B]/50 to-transparent"
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
          <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
            <span className="font-heading text-2xl text-white tracking-wide">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="text-white hover:text-[#FF9B9B] transition-colors bg-transparent border-none cursor-pointer"
            >
              <X size={24} strokeWidth={2} />
            </button>
          </div>
          <nav className="flex-1 px-6 py-8 overflow-y-auto">
            <div className="space-y-2">
              {navLinks.map((link, index) => (
                <motion.a
                  key={link.name}
                  href={link.href}
                  className={`block px-4 py-4 rounded-xl font-body text-lg font-semibold transition-all ${
                    activeLink === link.name
                      ? 'text-[#FF9B9B] bg-[#FF9B9B]/10'
                      : 'text-white hover:text-[#FF9B9B] hover:bg-white/5'
                  }`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{
                    opacity: isMobileMenuOpen ? 1 : 0,
                    x: isMobileMenuOpen ? 0 : 50,
                  }}
                  transition={{ delay: 0.05 * index }}
                  onClick={() => {
                    setActiveLink(link.name);
                    setIsMobileMenuOpen(false);
                  }}
                  whileTap={{ scale: 0.98 }}
                >
                  {link.name}
                </motion.a>
              ))}
            </div>
          </nav>
        </div>
      </motion.div>

      {/* Spacer */}
      <div className="h-20 lg:h-24" />
    </>
  );
}

function IconButton({
  icon: Icon,
  label,
  badge,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <motion.button
      className="relative text-white/80 hover:text-[#FF9B9B] transition-colors bg-transparent border-none cursor-pointer"
      whileHover={{ scale: 1.15 }}
      whileTap={{ scale: 0.9 }}
      aria-label={label}
      onClick={onClick}
    >
      <Icon size={22} strokeWidth={1.8} />
      {badge && (
        <span className="absolute -top-1 -right-1.5 bg-[#FF9B9B] text-[#1A1A1A] text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
          {badge}
        </span>
      )}
    </motion.button>
  );
}

function MobileTopIcon({
  icon: Icon,
  label,
  badge,
  onClick,
}: {
  icon: LucideIcon;
  label: string;
  badge?: number;
  onClick?: () => void;
}) {
  return (
    <motion.button
      className="relative shrink-0 text-white/80 hover:text-[#FF9B9B] transition-colors bg-transparent border-none cursor-pointer"
      whileTap={{ scale: 0.85 }}
      aria-label={label}
      onClick={onClick}
    >
      <Icon size={18} strokeWidth={1.8} />
      {badge && (
        <span className="absolute -top-1 -right-1 bg-[#FF9B9B] text-[#1A1A1A] text-[8px] font-bold rounded-full w-3 h-3 flex items-center justify-center leading-none">
          {badge}
        </span>
      )}
    </motion.button>
  );
}
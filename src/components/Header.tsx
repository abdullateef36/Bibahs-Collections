'use client';

import { motion, useScroll, useTransform } from 'framer-motion';
import { Search, Heart, ShoppingCart, User, Menu, X } from 'lucide-react';
import { useState } from 'react';
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
  const { scrollY } = useScroll();

  // Solid dark background - no transparency issues
  const headerShadow = useTransform(
    scrollY,
    [0, 50],
    ['0px 0px 0px rgba(0,0,0,0)', '0px 4px 24px rgba(0, 0, 0, 0.5)']
  );

  const borderOpacity = useTransform(
    scrollY,
    [0, 50],
    [0.3, 0.6]
  );

  return (
    <>
      <motion.header
        style={{
          boxShadow: headerShadow,
        }}
        className="fixed top-0 left-0 right-0 z-50 bg-[#1A1A1A]"
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20 lg:h-24">
            {/* Logo Section */}
            <motion.div
              className="shrink-0"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <a href="#home" className="flex items-center space-x-3">
                <motion.div
                  className="relative w-14 h-14 sm:w-16 sm:h-16"
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
                  className="font-heading font-bold text-2xl sm:text-3xl text-white hidden sm:block tracking-wide"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Bibah&apos;s
                </motion.span>
              </a>
            </motion.div>

            {/* Desktop Navigation - Pink text on dark */}
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
                      className="absolute -bottom-2 left-0 right-0 h-0.5 bg-linear-to-r from-[#FF9B9B] to-[#FFB8B8]"
                      layoutId="underline"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </motion.a>
              ))}
            </nav>

            {/* Right Icons */}
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Desktop Icons */}
              <motion.div
                className="hidden md:flex items-center space-x-2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <IconButton icon={Search} label="Search" />
                <IconButton icon={Heart} label="Wishlist" badge={3} />
                <IconButton icon={ShoppingCart} label="Cart" badge={2} />
                <IconButton icon={User} label="Profile" />
              </motion.div>

              {/* Mobile Menu Button */}
              <motion.button
                className="lg:hidden p-2.5 text-white hover:text-[#FF9B9B] transition-colors rounded-lg hover:bg-white/5"
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                whileTap={{ scale: 0.95 }}
                aria-label="Toggle menu"
              >
                {isMobileMenuOpen ? <X size={24} strokeWidth={2} /> : <Menu size={24} strokeWidth={2} />}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Animated gradient border */}
        <motion.div
          style={{ opacity: borderOpacity }}
          className="h-px bg-linear-to-r from-transparent via-[#FF9B9B]/50 to-transparent"
        />
      </motion.header>

      {/* Mobile Menu - Dark theme */}
      <motion.div
        className="lg:hidden fixed inset-0 z-40 bg-[#1A1A1A]"
        initial={{ x: '100%' }}
        animate={{ x: isMobileMenuOpen ? 0 : '100%' }}
        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
      >
        <div className="h-full flex flex-col">
          {/* Mobile Menu Header */}
          <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
            <span className="font-heading font-bold text-2xl text-white">Menu</span>
            <button
              onClick={() => setIsMobileMenuOpen(false)}
              className="p-2 text-white hover:text-[#FF9B9B] transition-colors"
            >
              <X size={24} strokeWidth={2} />
            </button>
          </div>

          {/* Mobile Navigation */}
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

          {/* Mobile Icons Footer */}
          <motion.div
            className="px-6 py-6 border-t border-white/10 bg-white/5"
            initial={{ opacity: 0 }}
            animate={{ opacity: isMobileMenuOpen ? 1 : 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="grid grid-cols-4 gap-4">
              <MobileIconButton icon={Search} label="Search" />
              <MobileIconButton icon={Heart} label="Wishlist" badge={3} />
              <MobileIconButton icon={ShoppingCart} label="Cart" badge={2} />
              <MobileIconButton icon={User} label="Profile" />
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Spacer for fixed header */}
      <div className="h-20 lg:h-24" />
    </>
  );
}

// Icon Button Component
function IconButton({
  icon: Icon,
  label,
  badge,
}: {
  icon: LucideIcon;
  label: string;
  badge?: number;
}) {
  return (
    <motion.button
      className="relative p-2.5 text-white hover:text-[#FF9B9B] transition-colors rounded-lg hover:bg-white/5"
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      aria-label={label}
    >
      <Icon size={22} strokeWidth={2} />
      {badge && (
        <motion.span
          className="absolute -top-1 -right-1 bg-linear-to-br from-[#FF9B9B] to-[#FFB8B8] text-[#1A1A1A] text-[11px] font-body font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-lg"
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 15 }}
        >
          {badge}
        </motion.span>
      )}
    </motion.button>
  );
}

// Mobile Icon Button Component
function MobileIconButton({
  icon: Icon,
  label,
  badge,
}: {
  icon: LucideIcon;
  label: string;
  badge?: number;
}) {
  return (
    <button
      className="relative flex flex-col items-center justify-center p-4 text-white hover:text-[#FF9B9B] transition-colors rounded-xl hover:bg-white/5"
      aria-label={label}
    >
      <div className="relative mb-1">
        <Icon size={24} strokeWidth={2} />
        {badge && (
          <span className="absolute -top-1.5 -right-1.5 bg-linear-to-br from-[#FF9B9B] to-[#FFB8B8] text-[#1A1A1A] text-[10px] font-body font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {badge}
          </span>
        )}
      </div>
      <span className="text-[11px] font-body font-medium text-white/80">{label}</span>
    </button>
  );
}
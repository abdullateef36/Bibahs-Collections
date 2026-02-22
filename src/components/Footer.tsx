'use client';

import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, ArrowUpRight, Heart } from 'lucide-react';
import { FaInstagram, FaTiktok, FaFacebookF, FaYoutube, FaXTwitter } from 'react-icons/fa6';

const footerLinks = {
  Shop: [
    { label: 'Clothing', href: '/clothing' },
    { label: 'Jewelry', href: '/jewelry' },
    { label: 'Bags', href: '/bags' },
    { label: 'Shoes', href: '/shoes' },
    { label: 'Perfumes', href: '/perfumes' },
  ],
  Help: [
    { label: 'Shipping & Returns', href: '/shipping-returns' },
    { label: 'Track Order', href: '/track-order' },
    { label: 'FAQ', href: '/faq' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Contact', href: '/contact' },
  ],
};

const socials = [
  { icon: FaInstagram, label: 'Instagram',  href: '#' },
  { icon: FaXTwitter,  label: 'X (Twitter)', href: '#' },
  { icon: FaTiktok,    label: 'TikTok',     href: '#' },
  { icon: FaFacebookF, label: 'Facebook',   href: '#' },
  { icon: FaYoutube,   label: 'YouTube',    href: '#' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0 },
};

export default function Footer() {
  return (
    <footer className="bg-[#111111] text-white">

      {/* Top decorative pink line */}
      <div className="h-px bg-linear-to-r from-transparent via-[#FF9B9B] to-transparent" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* ── Main grid ── */}
        <motion.div
          className="pt-12 pb-10 grid grid-cols-1 gap-10 lg:grid-cols-[2fr_1fr_1fr_1fr]"
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: '-80px' }}
          transition={{ staggerChildren: 0.1 }}
        >

          {/* Brand column */}
          <motion.div variants={fadeUp} className="space-y-5">
            <h2 className="font-heading text-4xl sm:text-5xl text-white tracking-widest uppercase leading-none">
              Bibah&apos;s<br />
              <span className="text-[#FF9B9B]">Collections</span>
            </h2>

            <p className="font-body text-white/50 text-sm leading-relaxed max-w-xs">
              Trendy and classy fashion that makes you feel confident, beautiful, and unapologetically yourself.
            </p>

            {/* Socials */}
            <div className="flex items-center gap-5">
              {socials.map(({ icon: Icon, label, href }) => (
                <motion.a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="text-white/40 hover:text-[#FF9B9B] transition-colors duration-300"
                  whileHover={{ scale: 1.2, y: -2 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <Icon size={18} strokeWidth={1.8} />
                </motion.a>
              ))}
            </div>
          </motion.div>

          {/* Link columns — 2-col grid on mobile, individual cols on desktop */}
          <motion.div
            variants={fadeUp}
            className="grid grid-cols-2 gap-8 lg:contents"
          >
            {Object.entries(footerLinks).map(([title, links]) => (
              <div key={title} className="space-y-4 lg:space-y-5">
                <h3 className="font-heading text-lg text-white tracking-widest uppercase">
                  {title}
                </h3>
                <ul className="space-y-3">
                  {links.map(({ label, href }) => (
                    <li key={label}>
                      <a
                        href={href}
                        className="group flex items-center gap-1 font-body text-sm text-white/40 hover:text-[#FF9B9B] transition-colors duration-300"
                      >
                        <span>{label}</span>
                        <ArrowUpRight
                          size={12}
                          className="opacity-0 -translate-y-0.5 translate-x-0 group-hover:opacity-100 group-hover:-translate-y-1 group-hover:translate-x-0.5 transition-all duration-300"
                        />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </motion.div>
        </motion.div>

        {/* ── Contact strip ── */}
        <motion.div
          className="py-5 border-t border-white/5 flex flex-wrap gap-4 text-white/30"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.3 }}
        >
          {[
            { icon: Mail,   text: 'hello@bibahs.com' },
            { icon: Phone,  text: '+1 (800) 424-2229' },
            { icon: MapPin, text: 'Lagos, Nigeria' },
          ].map(({ icon: Icon, text }) => (
            <span key={text} className="flex items-center gap-2 font-body text-xs">
              <Icon size={13} strokeWidth={1.8} className="text-[#FF9B9B]" />
              {text}
            </span>
          ))}
        </motion.div>

        {/* ── Bottom bar ── */}
        <motion.div
          className="py-5 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-3"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ delay: 0.4 }}
        >
          <p className="font-body text-xs text-white/20">
            © {new Date().getFullYear()} Bibah&apos;s Collections. All rights reserved.
          </p>

          <p className="font-body text-xs text-white/20 flex items-center gap-1">
            Made with <Heart size={10} className="text-[#FF9B9B] fill-[#FF9B9B]" /> for fashion lovers
          </p>

          <div className="flex items-center gap-4">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <a
                key={item}
                href="#"
                className="font-body text-xs text-white/20 hover:text-[#FF9B9B] transition-colors duration-300"
              >
                {item}
              </a>
            ))}
          </div>
        </motion.div>
      </div>

      {/* Bottom pink glow */}
      <div className="h-px bg-linear-to-r from-transparent via-[#FF9B9B]/40 to-transparent" />
    </footer>
  );
}
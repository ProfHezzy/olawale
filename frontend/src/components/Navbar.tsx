'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import { Menu, X, Sun, Moon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTheme } from '@/components/ThemeProvider';

const navLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Projects', href: '/projects' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Blog', href: '/blog' },
  { label: 'Academics', href: '/#academics' },
  { label: 'Certifications', href: '/#certifications' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, toggleTheme } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-surface-elevated/90 backdrop-blur-xl shadow-sm border-b border-border-default'
          : 'bg-transparent'
      }`}
    >
      <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link
          href="/"
          className={`text-2xl font-extrabold tracking-tighter transition-colors ${
            scrolled ? 'text-text-primary' : 'text-white'
          }`}
        >
          HOO<span className="text-brand-primary">.</span>
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${
                scrolled
                  ? 'text-text-secondary hover:text-brand-primary hover:bg-surface-subtle'
                  : 'text-white/80 hover:text-white hover:bg-white/10'
              }`}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        {/* Theme Toggle + CTA */}
        <div className="hidden md:flex items-center gap-3">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl transition-colors text-text-secondary hover:text-text-primary hover:bg-surface-subtle"
            aria-label={resolvedTheme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
          >
            {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <Link href="/contact" className="btn-primary text-sm px-5 py-2.5">
            Hire Me
          </Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`md:hidden p-2 rounded-xl transition-colors ${
            scrolled ? 'text-text-secondary hover:bg-surface-subtle' : 'text-white hover:bg-white/10'
          }`}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="md:hidden bg-surface-elevated border-b border-border-default shadow-lg"
          >
            <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col gap-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setIsOpen(false)}
                  className="px-4 py-3 rounded-xl text-sm font-semibold text-text-secondary hover:text-brand-primary hover:bg-surface-subtle transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              <div className="flex items-center justify-between px-4 py-2 border-t border-border-muted">
                <span className="text-sm font-medium text-text-secondary">Theme</span>
                <button
                  onClick={() => { toggleTheme(); setIsOpen(false); }}
                  className="p-2 rounded-xl text-text-secondary hover:text-text-primary hover:bg-surface-subtle transition-colors"
                >
                  {resolvedTheme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
                </button>
              </div>
              <Link
                href="/contact"
                onClick={() => setIsOpen(false)}
                className="mt-2 btn-primary text-center py-3"
              >
                Hire Me
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
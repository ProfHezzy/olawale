'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, ArrowUpRight, GitBranch, Link2, X } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const navLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Academics', href: '/#academics' },
  { label: 'Certifications', href: '/#certifications' },
  { label: 'Contact', href: '/contact' },
];

const socialLinks = [
  { icon: GitBranch, label: 'GitHub', urlKey: 'github_url', sub: (url: string) => new URL(url).pathname.substring(1) },
  { icon: Link2, label: 'LinkedIn', urlKey: 'linkedin_url', sub: () => 'View Profile' },
  { icon: X, label: 'X (Twitter)', urlKey: 'twitter_url', sub: (url: string) => new URL(url).pathname.substring(1) },
];

export default function Footer() {
  const year = new Date().getFullYear();

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/profile');
      return res.data;
    },
  });

  return (
    <footer className="bg-surface-canvas dark:bg-brand-primary-950 text-text-primary dark:text-text-inverse overflow-hidden relative border-t border-border-default dark:border-brand-primary-900">
      {/* Top Glow — Brand Colors */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-brand-primary/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-20 bg-brand-primary/5 blur-2xl" />
      <div className="absolute top-0 right-0 w-[300px] h-[300px] bg-brand-accent/5 rounded-full blur-[150px] translate-x-1/2 -translate-y-1/2 pointer-events-none" />

      {/* CTA Band */}
      <div className="border-b border-border-muted">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl lg:text-5xl font-extrabold tracking-tighter mb-3"
              >
                Ready to build something <span className="gradient-text">extraordinary</span>?
              </motion.h2>
              <p className="text-text-secondary text-lg">Open for freelance projects, full-time opportunities, and technical mentorship.</p>
            </div>
            <Link
              href="/contact"
              className="group flex items-center gap-3 px-8 py-5 bg-brand-primary text-brand-primary-foreground font-bold rounded-2xl hover:bg-brand-primary-800 transition-all shadow-xl shadow-brand whitespace-nowrap text-lg gradient-border"
            >
              Start a Conversation
              <ArrowUpRight size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
            </Link>
          </div>
        </div>
      </div>

      {/* Main Footer Body */}
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="lg:col-span-2">
            <div className="text-3xl font-extrabold tracking-tighter mb-4">
              HOO<span className="text-brand-primary">.</span>
            </div>
            <p className="text-text-secondary leading-relaxed mb-6 max-w-sm">
              Full-Stack Developer specializing in building robust, scalable digital solutions that solve real-world problems. Available for remote work worldwide.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {profile?.email && (
                <div className="flex items-center gap-3 text-text-secondary text-sm">
                  <div className="w-8 h-8 rounded-lg bg-surface-subtle flex items-center justify-center">
                    <Mail size={14} className="text-brand-primary" />
                  </div>
                  <a href={`mailto:${profile.email}`} className="hover:text-brand-primary transition-colors">{profile.email}</a>
                </div>
              )}
              {profile?.location && (
                <div className="flex items-center gap-3 text-text-secondary text-sm">
                  <div className="w-8 h-8 rounded-lg bg-surface-subtle flex items-center justify-center">
                    <MapPin size={14} className="text-brand-primary" />
                  </div>
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.phone && (
                <div className="flex items-center gap-3 text-text-secondary text-sm">
                  <div className="w-8 h-8 rounded-lg bg-surface-subtle flex items-center justify-center">
                    <Phone size={14} className="text-brand-primary" />
                  </div>
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-6">Navigation</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-text-secondary hover:text-brand-primary transition-colors text-sm font-medium flex items-center gap-2 group"
                  >
                    <span className="w-0 h-0.5 bg-brand-primary group-hover:w-4 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Status */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-text-muted mb-6">Connect</h3>
            <div className="space-y-3 mb-8">
              {socialLinks
                .filter((s) => profile?.[s.urlKey as keyof typeof profile])
                .map((social) => {
                  const url = profile[social.urlKey as keyof typeof profile] as string;
                  const Icon = social.icon;
                  return (
                    <a
                      key={social.label}
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-3 rounded-xl bg-surface-subtle hover:bg-surface-interactive transition-colors group border border-border-muted hover:border-brand-primary/30"
                    >
                      <span className="text-text-secondary group-hover:text-brand-primary transition-colors">
                        <Icon size={20} />
                      </span>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">{social.label}</p>
                        <p className="text-[10px] text-text-muted">{social.sub(url)}</p>
                      </div>
                    </a>
                  );
                })}
            </div>

            {/* Availability Badge */}
            <div className="flex items-center gap-2 px-3 py-2 bg-status-success-bg border border-status-success-border rounded-xl w-fit">
              <span className="w-2 h-2 rounded-full bg-status-success-icon animate-pulse" />
              <span className="text-status-success-text text-xs font-bold">Available for hire</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-border-muted">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-text-muted text-sm">
            © {year} {profile?.full_name || 'Hezekiah Olawale Ojenike'}. Crafted with ❤️ using Next.js & NestJS.
          </p>
        </div>
      </div>
    </footer>
  );
}
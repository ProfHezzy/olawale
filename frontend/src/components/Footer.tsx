'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Mail, MapPin, Phone, ArrowUpRight } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

const GithubIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

const LinkedinIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/>
    <rect width="4" height="12" x="2" y="9"/>
    <circle cx="4" cy="4" r="2"/>
  </svg>
);

const TwitterIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 4l11.733 16H20L8.267 4z"/><path d="M4 20l6.768-6.768M20 4l-6.768 6.768"/>
  </svg>
);

const navLinks = [
  { label: 'About', href: '/#about' },
  { label: 'Skills', href: '/#skills' },
  { label: 'Projects', href: '/projects' },
  { label: 'Blog', href: '/blog' },
  { label: 'Academics', href: '/#academics' },
  { label: 'Certifications', href: '/#certifications' },
  { label: 'Contact', href: '/contact' },
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
    <footer className="bg-slate-950 text-white overflow-hidden relative">
      {/* Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[1px] bg-gradient-to-r from-transparent via-primary/50 to-transparent" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-20 bg-primary/5 blur-2xl" />

      {/* CTA Band */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-8">
            <div>
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-4xl lg:text-5xl font-extrabold tracking-tighter mb-3"
              >
                Ready to build something <span className="text-primary">extraordinary</span>?
              </motion.h2>
              <p className="text-slate-400 text-lg">Open for freelance projects, full-time opportunities, and technical mentorship.</p>
            </div>
            <Link
              href="/contact"
              className="group flex items-center gap-3 px-8 py-5 bg-primary text-white font-bold rounded-2xl hover:bg-primary/90 transition-all shadow-xl shadow-blue-500/30 whitespace-nowrap text-lg"
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
              HOO<span className="text-primary">.</span>
            </div>
            <p className="text-slate-400 leading-relaxed mb-6 max-w-sm">
              Full-Stack Developer specializing in building robust, scalable digital solutions that solve real-world problems. Available for remote work worldwide.
            </p>

            {/* Contact Info */}
            <div className="space-y-3">
              {profile?.email && (
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Mail size={14} className="text-primary" />
                  </div>
                  <a href={`mailto:${profile.email}`} className="hover:text-white transition-colors">{profile.email}</a>
                </div>
              )}
              {profile?.location && (
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <MapPin size={14} className="text-primary" />
                  </div>
                  <span>{profile.location}</span>
                </div>
              )}
              {profile?.phone && (
                <div className="flex items-center gap-3 text-slate-400 text-sm">
                  <div className="w-8 h-8 rounded-lg bg-white/5 flex items-center justify-center">
                    <Phone size={14} className="text-primary" />
                  </div>
                  <span>{profile.phone}</span>
                </div>
              )}
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Navigation</h3>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center gap-2 group">
                    <span className="w-0 h-0.5 bg-primary group-hover:w-4 transition-all" />
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Social & Status */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest text-slate-500 mb-6">Connect</h3>
            <div className="space-y-3 mb-8">
              {[
                { icon: <GithubIcon />, label: 'GitHub', href: profile?.github_url, sub: profile?.github_url ? new URL(profile.github_url).pathname.substring(1) : '' },
                { icon: <LinkedinIcon />, label: 'LinkedIn', href: profile?.linkedin_url, sub: profile?.linkedin_url ? 'View Profile' : '' },
                { icon: <TwitterIcon />, label: 'X (Twitter)', href: profile?.twitter_url, sub: profile?.twitter_url ? new URL(profile.twitter_url).pathname.substring(1) : '' },
              ].filter(s => s.href).map((social) => (
                <a
                  key={social.label}
                  href={social.href}
                  target="_blank"
                  rel="noreferrer"
                  className="flex items-center gap-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-colors group"
                >
                  <span className="text-slate-400 group-hover:text-white transition-colors">{social.icon}</span>
                  <div>
                    <p className="text-sm font-semibold text-white">{social.label}</p>
                    <p className="text-[10px] text-slate-500">{social.sub}</p>
                  </div>
                </a>
              ))}
            </div>

            {/* Availability Badge */}
            <div className="flex items-center gap-2 px-3 py-2 bg-emerald-500/10 rounded-xl border border-emerald-500/20 w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-xs font-bold">Available for hire</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            © {year} {profile?.full_name || 'Hezekiah Olawale Ojenike'}. Crafted with ❤️ using Next.js & NestJS.
          </p>
        </div>
      </div>
    </footer>
  );
}

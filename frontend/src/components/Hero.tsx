'use client';

import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export default function Hero() {
  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/profile');
      return res.data;
    },
  });

  return (
    <section className="relative pt-32 pb-20 overflow-hidden section-lg">
      {/* Background Glow — Brand Colors */}
      <div className="absolute top-0 right-0 -translate-y-1/2 translate-x-1/4 w-[600px] h-[600px] bg-brand-primary/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/2 -translate-x-1/4 w-[500px] h-[500px] bg-brand-highlight/10 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-accent/5 rounded-full blur-[150px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
          {/* Text Content */}
          <div className="flex-1 text-center lg:text-left">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.25, 1, 0.5, 1] }}
              className="animate-in"
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-brand-primary/10 text-brand-primary text-sm font-semibold mb-6 border border-brand-primary/20">
                Available for New Projects
              </span>
              <h1 className="text-5xl lg:text-7xl font-extrabold leading-[1.1] mb-6 text-text-primary tracking-tight">
                {profile?.full_name ? (
                  <>{profile.full_name}</>
                ) : (
                  <>Building Scalable <span className="gradient-text">Web Systems</span> That Drive Real Results</>
                )}
              </h1>
              <p className="text-lg lg:text-xl text-text-secondary mb-10 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                {profile?.bio || 'Bridging the gap between robust backend architecture and seamless frontend experiences through precision and passion.'}
              </p>

              <div className="flex flex-wrap items-center justify-center lg:justify-start gap-4">
                <Link href="/contact" className="btn-primary flex items-center gap-2 gradient-border">
                  Hire Me <ArrowRight size={18} />
                </Link>
                <Link href="#projects" className="btn-ghost flex items-center gap-2">
                  View Projects <ArrowRight size={18} />
                </Link>
              </div>
            </motion.div>
          </div>

          {/* Hero Avatar / Illustration */}
          <motion.div
            className="flex-1 relative"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
          >
            <div className="relative w-72 h-72 md:w-[500px] md:h-[500px] mx-auto">
              {/* Profile Avatar or Custom Illustration */}
              <div className="absolute inset-0 w-full h-full">
                {profile?.avatar_url ? (
                  <img
                    src={profile.avatar_url}
                    alt={profile.full_name || 'Profile'}
                    className="w-full h-full object-cover rounded-[50%] animate-float-slow border-4 border-white/20 dark:border-brand-primary-900/50"
                  />
                ) : (
                  <img
                    src="/illustrations/hero-illustration.svg"
                    alt="Hezekiah Ojenike - Full Stack Software Engineer building scalable web systems"
                    className="w-full h-full object-contain animate-float-slow"
                  />
                )}
              </div>

              {/* Floating Elements — Brand Accent */}
              <div className="absolute -top-4 -right-4 bg-surface-elevated p-4 rounded-2xl shadow-lg border border-border-brand/20 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-accent/10 flex items-center justify-center text-brand-accent font-bold text-xs">
                    {profile?.years_experience || '3+'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary">Years Exp.</p>
                    <p className="text-[10px] text-text-muted">Full-Stack</p>
                  </div>
                </div>
              </div>

              {/* Additional floating stat */}
              <div className="absolute bottom-4 -left-4 bg-surface-elevated p-4 rounded-2xl shadow-lg border border-border-brand/20 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-brand-highlight/10 flex items-center justify-center text-brand-highlight font-bold text-xs">
                    {profile?.projects_completed || '8+'}
                  </div>
                  <div>
                    <p className="text-xs font-bold text-text-primary">Projects</p>
                    <p className="text-[10px] text-text-muted">Completed</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
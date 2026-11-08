'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Loader2, ExternalLink, Award, BadgeCheck } from 'lucide-react';

interface Certification {
  id: string;
  title: string;
  issuer: string;
  date: string;
  link?: string;
}

// Brand gradient variations for certifications
const brandGradients = [
  'from-brand-primary to-brand-highlight',
  'from-brand-highlight to-brand-accent',
  'from-brand-accent to-brand-primary',
  'from-brand-primary to-blue-600',
  'from-brand-highlight to-emerald-600',
  'from-brand-accent to-violet-600',
];

export default function CertificationsSection() {
  const { data: certifications, isLoading } = useQuery<Certification[]>({
    queryKey: ['certifications'],
    queryFn: () => api.get('/certifications').then(r => r.data),
  });

  return (
    <section id="certifications" className="section-lg bg-surface-canvas dark:bg-brand-primary-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-brand-primary font-bold text-sm tracking-widest uppercase mb-4 block animate-in">Credentials</span>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter mb-4 text-text-primary animate-in animate-in-delay-1">
            Certifications
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto font-medium animate-in animate-in-delay-2">
            Industry-recognized credentials that validate expertise across full-stack development, cloud computing, and data analytics.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-brand-primary" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications?.map((cert: Certification, idx: number) => {
              const gradientClass = brandGradients[idx % brandGradients.length];
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07, duration: 0.5 }}
                  className="group relative card card-brand p-6 hover:shadow-xl hover:shadow-brand-primary/20 dark:hover:shadow-brand-primary/30 hover:-translate-y-2 transition-all duration-300 overflow-hidden h-full flex flex-col"
                >
                  {/* Gradient accent */}
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${gradientClass} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />

                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${gradientClass} flex items-center justify-center text-white shadow-lg shadow-brand-primary/30`}>
                      <Award size={28} />
                    </div>
                    {cert.link && (
                      <a href={cert.link} target="_blank" rel="noreferrer" className="p-2 text-text-muted hover:text-brand-primary transition-colors bg-surface-card dark:bg-brand-primary-900 rounded-xl hover:border-brand-primary/30 border border-border-muted dark:border-brand-primary-800">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>

                  <h3 className="font-extrabold text-text-primary mb-1 leading-snug group-hover:text-brand-primary transition-colors duration-300">{cert.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <BadgeCheck size={12} className="text-brand-primary" />
                    <span className="text-sm font-semibold text-brand-primary">{cert.issuer}</span>
                    <span className="text-text-muted text-xs">• {cert.date}</span>
                  </div>

                  {/* Verified badge */}
                  <div className="mt-auto pt-4 border-t border-border-muted dark:border-brand-primary-800">
                    <div className="flex items-center gap-2 px-3 py-2 bg-status-success-bg border border-status-success-border rounded-xl w-fit">
                      <span className="w-1.5 h-1.5 rounded-full bg-status-success-icon animate-pulse" />
                      <span className="text-status-success-text text-xs font-bold">Verified Credential</span>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Loader2, GraduationCap, Calendar, MapPin, Award, BookOpen } from 'lucide-react';

interface AcademicItem {
  id: string;
  degree: string;
  institution: string;
  location?: string;
  period: string;
  description?: string;
  grade?: string;
  field?: string;
}

export default function AcademicsSection() {
  const { data: academics, isLoading } = useQuery<AcademicItem[]>({
    queryKey: ['academics'],
    queryFn: () => api.get('/academics').then(r => r.data),
  });
  return (
    <section id="academics" className="section-lg bg-surface-subtle dark:bg-brand-primary-900/50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-brand-primary font-bold text-sm tracking-widest uppercase mb-4 block animate-in">Education</span>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter mb-4 text-text-primary animate-in animate-in-delay-1">
            Academic Journey
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto font-medium animate-in animate-in-delay-2">
            The foundation of solid engineering principles, built through rigorous academic training and hands-on learning.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-brand-primary" size={40} />
          </div>
        ) : (
          <div className="relative space-y-12">
            {/* Center timeline line */}
            <div className="absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2 bg-gradient-to-b from-brand-primary via-brand-highlight to-brand-accent hidden lg:block" />

            {academics?.map((item: AcademicItem, idx: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative flex flex-col lg:flex-row gap-8 items-center"
              >
                {/* Timeline Node - centered */}
                <div className="relative z-10 shrink-0 lg:w-[200px] lg:flex lg:items-center lg:justify-center">
                  <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-brand-primary to-brand-highlight flex items-center justify-center text-2xl shadow-lg shadow-brand-primary/30 text-white">
                    <GraduationCap size={32} />
                  </div>
                  {/* Connector dot */}
                  <div className="absolute left-1/2 top-[32px] w-3 h-3 rounded-full bg-brand-primary border-4 border-surface-subtle dark:border-brand-primary-900/50 -translate-x-1/2 lg:block hidden" />
                </div>

                {/* Content Card */}
                <div className="flex-1 lg:w-1/2">
                  <div className="card card-brand p-8 hover:shadow-xl hover:shadow-brand-primary/10 dark:hover:shadow-brand-primary/20 transition-all duration-300 group">
                    {/* Period Badge */}
                    <div className="flex items-center gap-2 text-xs font-bold text-text-muted mb-4">
                      <Calendar size={12} className="text-brand-primary" />
                      <span>{item.period}</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-text-primary mb-1 tracking-tight group-hover:text-brand-primary transition-colors duration-300">{item.degree}</h3>

                    <div className="flex items-center gap-3 mb-4">
                      <span className="font-bold text-brand-primary text-sm">{item.institution}</span>
                      {item.location && (
                        <>
                          <span className="text-border-default dark:text-brand-primary-800">•</span>
                          <span className="text-text-secondary text-sm flex items-center gap-1">
                            <MapPin size={12} className="text-brand-primary" /> {item.location}
                          </span>
                        </>
                      )}
                    </div>

                    {item.description && <p className="text-text-secondary text-sm leading-relaxed mb-5">{item.description}</p>}

                    {item.grade && (
                      <div className="flex">
                        <span className="flex items-center gap-2 px-3 py-1.5 bg-status-success-bg border border-status-success-border text-status-success-text text-xs font-bold rounded-xl">
                          <Award size={12} /> {item.grade}
                        </span>
                      </div>
                    )}

                    {/* Field of study if available */}
                    {item.field && (
                      <div className="mt-6 flex items-center gap-2">
                        <BookOpen size={14} className="text-brand-primary" />
                        <span className="px-3 py-1.5 bg-brand-primary/10 dark:bg-brand-primary-900/30 text-brand-primary text-xs font-semibold rounded-xl border border-brand-primary/20">
                          {item.field}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

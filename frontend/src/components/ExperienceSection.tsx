'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Loader2 } from 'lucide-react';

interface Experience {
  id: string;
  position: string;
  company: string;
  location?: string;
  period: string;
  description: string;
  techStack?: string[];
}

export default function ExperienceSection() {
  const { data: experiences, isLoading } = useQuery<Experience[]>({
    queryKey: ['experiences'],
    queryFn: () => api.get('/experience').then(r => r.data),
  });

  return (
    <section id="experience" className="section-lg bg-surface-canvas dark:bg-brand-primary-950 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-brand-primary font-bold text-sm tracking-widest uppercase mb-4 block animate-in">Career Path</span>
          <h2 className="text-4xl lg:text-5xl font-extrabold tracking-tighter mb-4 text-text-primary animate-in animate-in-delay-1">
            Work Experience
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto font-medium animate-in animate-in-delay-2">
            A journey through different roles and organizations, focused on building impactful software and solving complex problems.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-brand-primary" size={40} />
          </div>
        ) : (
          <div className="relative space-y-8">
            {/* Desktop Timeline Line - Brand gradient */}
            <div className="absolute left-[31px] top-0 bottom-0 w-px hidden md:block bg-gradient-to-b from-brand-primary via-brand-highlight to-brand-accent" />

            {experiences?.map((exp: Experience, idx: number) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.5 }}
                className="relative flex flex-col md:flex-row gap-6 md:gap-12"
              >
                {/* Icon & Connector */}
                <div className="relative z-10 shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-surface-card dark:bg-brand-primary-900 border border-border-default dark:border-brand-primary-800 shadow-sm flex items-center justify-center text-brand-primary group-hover:scale-110 transition-transform duration-300 group-hover:shadow-lg group-hover:shadow-brand-primary/20">
                    <Briefcase size={28} />
                  </div>
                  {/* Timeline dot on the line */}
                  <div className="absolute left-[31px] top-4 w-3 h-3 rounded-full bg-brand-primary border-4 border-surface-canvas dark:border-brand-primary-950 md:block hidden" />
                </div>

                {/* Content Card */}
                <div className="flex-1 card card-brand p-8 hover:shadow-xl hover:shadow-brand-primary/10 dark:hover:shadow-brand-primary/20 transition-all duration-300 group">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-extrabold text-text-primary tracking-tight group-hover:text-brand-primary transition-colors duration-300">{exp.position}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-brand-primary">{exp.company}</span>
                        {exp.location && (
                          <>
                            <span className="text-border-default dark:text-brand-primary-800">•</span>
                            <span className="text-text-secondary text-sm flex items-center gap-1 font-medium">
                              <MapPin size={12} className="text-brand-primary" /> {exp.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-surface-card dark:bg-brand-primary-900 rounded-full border border-border-muted dark:border-brand-primary-800 shadow-sm self-start">
                      <Calendar size={14} className="text-brand-primary" />
                      <span className="text-sm font-bold text-text-secondary">{exp.period}</span>
                    </div>
                  </div>
                  <p className="text-text-secondary leading-relaxed font-medium">
                    {exp.description}
                  </p>

                  {/* Tech stack if available */}
                  {exp.techStack && exp.techStack.length > 0 && (
                    <div className="mt-6 flex flex-wrap gap-2">
                      {exp.techStack.map((tech: string, techIdx: number) => (
                        <motion.span
                          key={tech}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: techIdx * 0.03 }}
                          className="px-3 py-1.5 bg-surface-subtle dark:bg-brand-primary-900/50 text-text-secondary dark:text-text-inverse rounded-xl text-xs font-semibold border border-border-muted dark:border-brand-primary-800 hover:border-brand-primary/30 hover:text-brand-primary transition-all duration-200"
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Briefcase, Calendar, MapPin, Loader2 } from 'lucide-react';

export default function ExperienceSection() {
  const { data: experiences, isLoading } = useQuery({
    queryKey: ['experiences'],
    queryFn: () => api.get('/experience').then(r => r.data),
  });

  return (
    <section id="experience" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-sm tracking-widest uppercase mb-4 block">Career Path</span>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4">Work Experience</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            A journey through different roles and organizations, focused on building impactful software and solving complex problems.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : (
          <div className="relative space-y-8">
            {/* Desktop Timeline Line */}
            <div className="absolute left-[31px] top-0 bottom-0 w-px bg-slate-100 hidden md:block" />

            {experiences?.map((exp: any, idx: number) => (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="relative flex flex-col md:flex-row gap-6 md:gap-12"
              >
                {/* Icon & Connector */}
                <div className="relative z-10 shrink-0">
                  <div className="w-16 h-16 rounded-2xl bg-white border border-slate-100 shadow-sm flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                    <Briefcase size={28} />
                  </div>
                </div>

                {/* Content Card */}
                <div className="flex-1 bg-slate-50/50 rounded-[32px] p-8 hover:bg-white hover:shadow-xl hover:shadow-blue-500/5 transition-all duration-300 border border-transparent hover:border-slate-100">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
                    <div>
                      <h3 className="text-xl font-extrabold text-slate-900 tracking-tight">{exp.position}</h3>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="font-bold text-primary">{exp.company}</span>
                        {exp.location && (
                          <>
                            <span className="text-slate-300">•</span>
                            <span className="text-slate-500 text-sm flex items-center gap-1 font-medium">
                              <MapPin size={12} /> {exp.location}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2 px-4 py-2 bg-white rounded-full border border-slate-100 shadow-sm self-start">
                      <Calendar size={14} className="text-slate-400" />
                      <span className="text-sm font-bold text-slate-600">{exp.period}</span>
                    </div>
                  </div>
                  <p className="text-slate-500 leading-relaxed font-medium">
                    {exp.description}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

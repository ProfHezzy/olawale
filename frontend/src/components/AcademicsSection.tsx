import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Loader2, GraduationCap, Calendar, MapPin, Award } from 'lucide-react';

export default function AcademicsSection() {
  const { data: academics, isLoading } = useQuery({
    queryKey: ['academics'],
    queryFn: () => api.get('/academics').then(r => r.data),
  });
  return (
    <section id="academics" className="py-24 bg-slate-50 overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-sm tracking-widest uppercase mb-4 block">Education</span>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4">Academic Journey</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            The foundation of solid engineering principles, built through rigorous academic training and hands-on learning.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : (
          <div className="space-y-12">
            {academics?.map((item: any, idx: number) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, x: idx % 2 === 0 ? -40 : 40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className={`grid grid-cols-1 lg:grid-cols-2 gap-8 items-center ${idx % 2 !== 0 ? 'lg:text-right' : ''}`}
              >
                {/* Content */}
                <div className={idx % 2 !== 0 ? 'lg:order-2' : ''}>
                  <div className={`bg-white rounded-[28px] p-8 shadow-sm border border-slate-100 hover:shadow-xl hover:shadow-blue-500/10 hover:-translate-y-1 transition-all duration-300 ${idx % 2 !== 0 ? 'lg:ml-8' : 'lg:mr-8'}`}>
                    {/* Period Badge */}
                    <div className={`flex items-center gap-2 text-xs font-bold text-slate-400 mb-4 ${idx % 2 !== 0 ? 'lg:justify-end' : ''}`}>
                      <Calendar size={12} />
                      <span>{item.period}</span>
                    </div>

                    <h3 className="text-xl font-extrabold text-slate-900 mb-1 tracking-tight">{item.degree}</h3>
                    
                    <div className={`flex items-center gap-3 mb-4 ${idx % 2 !== 0 ? 'lg:justify-end' : ''}`}>
                      <span className="font-bold text-primary text-sm">{item.institution}</span>
                      {item.location && (
                        <>
                          <span className="text-slate-300">•</span>
                          <span className="text-slate-500 text-sm flex items-center gap-1">
                            <MapPin size={12} /> {item.location}
                          </span>
                        </>
                      )}
                    </div>

                    {item.description && <p className="text-slate-500 text-sm leading-relaxed mb-5">{item.description}</p>}

                    {item.grade && (
                      <div className={`flex ${idx % 2 !== 0 ? 'lg:justify-end' : ''}`}>
                        <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-bold rounded-xl border border-emerald-100">
                          <Award size={12} /> {item.grade}
                        </span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Timeline Node */}
                <div className={`hidden lg:flex items-center justify-center ${idx % 2 !== 0 ? 'lg:order-1 justify-end' : 'justify-start'}`}>
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${idx % 2 === 0 ? 'from-blue-500 to-primary' : 'from-emerald-500 to-teal-600'} flex items-center justify-center text-2xl shadow-lg text-white`}>
                    <GraduationCap size={32} />
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

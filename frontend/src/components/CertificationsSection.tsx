import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { motion } from 'framer-motion';
import { Loader2, ExternalLink, Award } from 'lucide-react';

export default function CertificationsSection() {
  const { data: certifications, isLoading } = useQuery({
    queryKey: ['certifications'],
    queryFn: () => api.get('/certifications').then(r => r.data),
  });

  const colors = [
    'from-orange-400 to-yellow-500',
    'from-blue-500 to-indigo-600',
    'from-green-500 to-emerald-600',
    'from-sky-500 to-blue-600',
    'from-blue-600 to-cyan-600',
    'from-red-500 to-rose-600',
  ];
  return (
    <section id="certifications" className="py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-sm tracking-widest uppercase mb-4 block">Credentials</span>
          <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900 mb-4">Certifications</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            Industry-recognized credentials that validate expertise across full-stack development, cloud computing, and data analytics.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {certifications?.map((cert: any, idx: number) => {
              const colorClass = colors[idx % colors.length];
              return (
                <motion.div
                  key={cert.id}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.07 }}
                  className="group relative bg-white border border-slate-100 rounded-[28px] p-6 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300 overflow-hidden h-full flex flex-col"
                >
                  <div className={`absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl ${colorClass} opacity-5 rounded-full blur-2xl group-hover:opacity-10 transition-opacity`} />

                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${colorClass} flex items-center justify-center text-white shadow-md`}>
                      <Award size={28} />
                    </div>
                    {cert.link && (
                      <a href={cert.link} target="_blank" rel="noreferrer" className="p-2 text-slate-300 hover:text-primary transition-colors">
                        <ExternalLink size={16} />
                      </a>
                    )}
                  </div>

                  <h3 className="font-bold text-slate-900 mb-1 leading-snug">{cert.title}</h3>
                  <div className="flex items-center gap-2 mb-4">
                    <Award size={12} className="text-primary" />
                    <span className="text-sm font-medium text-primary">{cert.issuer}</span>
                    <span className="text-slate-300 text-xs">• {cert.date}</span>
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

'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import { 
  Layout, 
  Server, 
  Database, 
  Terminal, 
  Wrench, 
  Layers,
  Loader2 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { motion } from 'framer-motion';

const iconMap: Record<string, any> = {
  frontend: <Layout className="text-blue-500" size={20} />,
  backend: <Server className="text-purple-500" size={20} />,
  database: <Database className="text-green-500" size={20} />,
  tools: <Wrench className="text-orange-500" size={20} />,
  default: <Layers className="text-slate-500" size={20} />
};

export default function SkillsBento() {
  const { data: skills, isLoading } = useQuery({
    queryKey: ['skills'],
    queryFn: async () => {
      const res = await api.get('/skills');
      return res.data;
    },
  });

  // Group skills by category
  const groupedSkills = skills?.reduce((acc: any, skill: any) => {
    const category = skill.category.toLowerCase();
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {}) || {};

  return (
    <section id="skills" className="py-24">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-primary font-bold text-sm tracking-widest uppercase mb-4 block">Expertise</span>
          <h2 className="text-4xl font-bold mb-4 tracking-tight text-slate-900">Technical Arsenal</h2>
          <p className="text-slate-500 max-w-2xl mx-auto font-medium">
            A comprehensive set of tools and technologies I use to build robust, scalable, and modern digital solutions.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-primary" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Object.keys(groupedSkills).map((category, idx) => (
              <motion.div
                key={category}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
                className="glass-card p-8 rounded-[32px] flex flex-col group hover:shadow-card-hover transition-all duration-300 h-[340px]"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="p-3 bg-slate-50 rounded-2xl group-hover:bg-white transition-colors">
                    {iconMap[category] || iconMap.default}
                  </div>
                  <span className="text-[10px] font-bold text-slate-300 group-hover:text-primary transition-colors uppercase tracking-widest">
                    {groupedSkills[category].length} Skills
                  </span>
                </div>
                
                <div className="flex-1 overflow-hidden flex flex-col">
                  <h3 className="text-lg font-bold text-slate-900 mb-4 capitalize shrink-0">{category}</h3>
                  <div className="flex flex-wrap gap-2 overflow-y-auto pr-2 custom-scrollbar">
                    {groupedSkills[category].map((skill: any) => (
                      <span 
                        key={skill.id}
                        className="px-3 py-1 bg-slate-50 text-slate-600 rounded-lg text-xs font-semibold group-hover:bg-white transition-colors border border-transparent group-hover:border-blue-500/10"
                      >
                        {skill.name}
                      </span>
                    ))}
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

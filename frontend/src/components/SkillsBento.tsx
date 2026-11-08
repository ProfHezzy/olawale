'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import {
  Layout,
  Server,
  Database,
  Wrench,
  Layers,
  Loader2,
  Brain,
  Cloud,
  GitBranch,
  BarChart2,
} from 'lucide-react';
import { motion } from 'framer-motion';

export interface Skill {
  id: string;
  name: string;
  category: string;
  level?: string;
}

interface GroupedSkills {
  [category: string]: Skill[];
}

const categoryConfig: Record<string, { icon: React.ReactNode; gradient: string; ring: string }> = {
  frontend: {
    icon: <Layout size={22} />,
    gradient: 'from-brand-primary to-brand-highlight',
    ring: 'ring-brand-primary/20',
  },
  backend: {
    icon: <Server size={22} />,
    gradient: 'from-brand-highlight to-brand-accent',
    ring: 'ring-brand-highlight/20',
  },
  database: {
    icon: <Database size={22} />,
    gradient: 'from-emerald-500 to-teal-600',
    ring: 'ring-emerald-500/20',
  },
  'data analysis': {
    icon: <BarChart2 size={22} />,
    gradient: 'from-amber-500 to-orange-500',
    ring: 'ring-amber-500/20',
  },
  tools: {
    icon: <Wrench size={22} />,
    gradient: 'from-slate-600 to-zinc-700',
    ring: 'ring-slate-500/20',
  },
  ai: {
    icon: <Brain size={22} />,
    gradient: 'from-violet-500 to-fuchsia-600',
    ring: 'ring-violet-500/20',
  },
  cloud: {
    icon: <Cloud size={22} />,
    gradient: 'from-sky-500 to-blue-600',
    ring: 'ring-sky-500/20',
  },
  devops: {
    icon: <GitBranch size={22} />,
    gradient: 'from-orange-500 to-red-600',
    ring: 'ring-orange-500/20',
  },
  default: {
    icon: <Layers size={22} />,
    gradient: 'from-brand-primary to-brand-highlight',
    ring: 'ring-brand-primary/20',
  },
};

export default function SkillsBento() {
  const { data: skills, isLoading } = useQuery<Skill[]>({
    queryKey: ['skills'],
    queryFn: async () => {
      const res = await api.get('/skills');
      return res.data;
    },
  });

  // Group skills by category
  const groupedSkills = skills?.reduce((acc: GroupedSkills, skill: Skill) => {
    const category = skill.category.toLowerCase();
    if (!acc[category]) acc[category] = [];
    acc[category].push(skill);
    return acc;
  }, {} as GroupedSkills) || {};

  const categories = Object.keys(groupedSkills).sort();

  return (
    <section id="skills" className="section-lg">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center mb-16">
          <span className="text-brand-primary font-bold text-sm tracking-widest uppercase mb-4 block animate-in">Expertise</span>
          <h2 className="text-4xl lg:text-5xl font-extrabold mb-4 tracking-tight text-text-primary animate-in animate-in-delay-1">
            Technical Arsenal
          </h2>
          <p className="text-text-secondary max-w-2xl mx-auto font-medium animate-in animate-in-delay-2">
            A comprehensive set of tools and technologies I use to build robust, scalable, and modern digital solutions.
          </p>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="animate-spin text-brand-primary" size={40} />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories.map((category, idx) => {
              const config = categoryConfig[category] || categoryConfig.default;
              const categorySkills = groupedSkills[category];

              return (
                <motion.div
                  key={category}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-100px' }}
                  transition={{ duration: 0.5, delay: idx * 0.08, ease: [0.25, 1, 0.5, 1] }}
                  className="group relative card card-brand p-8 rounded-3xl flex flex-col h-[380px] overflow-hidden"
                >
                  {/* Gradient Top Border */}
                  <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r bg-gradient-to-r bg-[var(--color-brand-primary)] bg-[var(--color-brand-highlight)] bg-[var(--color-brand-accent)]" style={{ background: `linear-gradient(90deg, var(--color-brand-primary), var(--color-brand-highlight), var(--color-brand-accent))`, backgroundSize: '200% 100%', animation: 'gradient-shift 3s ease infinite' }} />

                  {/* Category Header */}
                  <div className="flex items-start justify-between mb-6 relative z-10">
                    <div className={`p-3 rounded-2xl bg-gradient-to-br ${config.gradient} text-white shadow-lg ${config.ring} group-hover:scale-110 transition-transform duration-300`}>
                      {config.icon}
                    </div>
                    <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">
                      {categorySkills.length} Skills
                    </span>
                  </div>

                  {/* Skills List */}
                  <div className="flex-1 overflow-hidden flex flex-col min-h-0">
                    <h3 className="text-lg font-bold text-text-primary mb-4 capitalize shrink-0">{category}</h3>
                    <div className="flex flex-wrap gap-2 overflow-y-auto pr-2 custom-scrollbar flex-1">
                      {categorySkills.map((skill: Skill, skillIdx: number) => (
                        <motion.span
                          key={skill.id}
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ delay: skillIdx * 0.03, duration: 0.3 }}
                          className="px-3 py-1.5 bg-surface-subtle text-text-secondary rounded-xl text-xs font-semibold group-hover:bg-surface-interactive transition-all duration-200 border border-border-muted hover:border-brand-primary/30 hover:text-text-primary cursor-default"
                        >
                          {skill.name}
                          {skill.level && (
                            <span className="ml-1.5 px-1.5 py-0.5 bg-brand-primary/10 text-brand-primary text-[9px] font-bold rounded-full uppercase tracking-wider">
                              {skill.level}
                            </span>
                          )}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        )}
      </div>

      <style jsx global>{`
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 200% 50%; }
        }
      `}</style>
    </section>
  );
}
'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ExternalLink, ArrowRight, Loader2, Filter, GitBranch } from 'lucide-react';
import { useState } from 'react';

interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  tech_stack: string[] | string;
  featured?: boolean;
  github_url?: string;
  live_url?: string;
  image?: string;
}

export default function ProjectsPage() {
  const [activeCategory, setActiveCategory] = useState('All');

  const { data: projects, isLoading } = useQuery<Project[]>({
    queryKey: ['projects'],
    queryFn: async () => {
      const res = await api.get('/projects');
      return res.data;
    },
  });

  const categories = ['All', ...Array.from(new Set(projects?.map((p) => p.category) || []))];
  const filtered = activeCategory === 'All'
    ? projects
    : projects?.filter((p) => p.category === activeCategory);

  return (
    <main className="min-h-screen bg-surface-canvas dark:bg-brand-primary-950">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-brand-primary-950 text-brand-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-highlight/10 rounded-full blur-[150px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-brand-primary font-bold text-sm tracking-widest uppercase mb-4 block animate-in">My Work</span>
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter mb-6 animate-in animate-in-delay-1">
                  All Projects
                </h1>
                <p className="text-xl text-brand-primary-foreground/70 max-w-2xl animate-in animate-in-delay-2">
                  A curated collection of products, tools, and experiments I have built across web development, AI, and software engineering.
                </p>
              </motion.div>
            </div>
            <div className="flex-1 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                className="relative w-full max-w-[500px] mx-auto"
              >
                <img
                  src="/illustrations/projects-illustration.svg"
                  alt="Project portfolio showcase - web development, AI, and software engineering projects"
                  className="w-full h-auto object-contain animate-float-slow"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Filter Bar */}
      <section className="sticky top-16 z-30 bg-surface-canvas/80 dark:bg-brand-primary-950/80 backdrop-blur-xl border-b border-border-muted dark:border-brand-primary-800 shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-3 overflow-x-auto scrollbar-hide">
          <Filter size={16} className="text-text-muted shrink-0" />
          {categories.map((cat: string) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                activeCategory === cat
                  ? 'bg-brand-primary text-brand-primary-foreground shadow-md shadow-brand-primary/30'
                  : 'bg-surface-subtle dark:bg-brand-primary-900 text-text-secondary hover:bg-surface-interactive dark:hover:bg-brand-primary-800 hover:text-text-primary'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* Projects Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-brand-primary" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered?.map((project: Project, idx: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05, duration: 0.5 }}
                  className="group card card-brand overflow-hidden hover:shadow-xl hover:shadow-brand-primary/10 dark:hover:shadow-brand-primary/20 hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="aspect-[16/10] bg-gradient-to-br from-surface-subtle to-surface-interactive relative overflow-hidden">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-6xl font-black text-border-muted dark:text-brand-primary-800">{project.title?.[0]}</span>
                      </div>
                    )}
                    {project.featured && (
                      <div className="absolute top-4 left-4 px-3 py-1 bg-brand-primary text-brand-primary-foreground text-[10px] font-black uppercase tracking-widest rounded-full shadow-lg">
                        Featured
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-6 gap-3">
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noreferrer" className="p-2 bg-white/20 backdrop-blur-md rounded-full text-white hover:bg-white/40 transition-colors">
                          <GitBranch size={18} />
                        </a>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noreferrer" className="p-2 bg-brand-accent rounded-full text-brand-accent-foreground hover:scale-110 transition-transform">
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-3">
                      <h3 className="font-extrabold text-xl text-text-primary group-hover:text-brand-primary transition-colors duration-300 leading-tight">{project.title}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-widest text-brand-primary bg-brand-primary/10 dark:bg-brand-primary-900/30 px-2 py-1 rounded-full whitespace-nowrap">{project.category}</span>
                    </div>
                    <p className="text-sm text-text-secondary leading-relaxed mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {(Array.isArray(project.tech_stack) ? project.tech_stack : (project.tech_stack?.split(',') || [])).slice(0, 4).map((tech: string) => (
                        <span key={tech} className="text-[10px] font-bold px-2 py-1 bg-surface-subtle dark:bg-brand-primary-900/50 text-text-secondary dark:text-text-inverse rounded-md uppercase tracking-wider border border-border-muted dark:border-brand-primary-800">{tech.trim()}</span>
                      ))}
                    </div>
                    <Link href={`/projects/${project.slug}`} className="flex items-center gap-2 text-sm font-bold text-brand-primary hover:gap-3 transition-all">
                      View Details <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}
            </div>
          )}

          {!isLoading && filtered?.length === 0 && (
            <div className="py-20 text-center">
              <p className="text-text-muted text-lg">No projects in this category yet.</p>
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

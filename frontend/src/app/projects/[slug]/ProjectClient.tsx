'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import CommentSection from '@/components/CommentSection';
import { ArrowLeft, ExternalLink, Calendar, Tag, Loader2, Heart, Share2, GitBranch } from 'lucide-react';

export default function ProjectClient({ slug }: { slug: string }) {
  const queryClient = useQueryClient();

  const { data: project, isLoading } = useQuery({
    queryKey: ['project', slug],
    queryFn: async () => {
      const res = await api.get(`/projects/${slug}`);
      return res.data;
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => api.patch(`/projects/${project.id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', slug] });
      toast.success('Glad you liked it!');
    }
  });

  const shareMutation = useMutation({
    mutationFn: () => api.patch(`/projects/${project.id}/share`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['project', slug] });
    }
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: project.title,
        text: project.description,
        url: window.location.href,
      }).then(() => shareMutation.mutate());
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Link copied to clipboard!');
      shareMutation.mutate();
    }
  };

  if (isLoading) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <Loader2 className="animate-spin text-brand-primary" size={48} />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-extrabold text-text-primary">Project not found</h1>
        <Link href="/projects" className="btn-primary">Back to Projects</Link>
      </main>
    );
  }

  const techStack = Array.isArray(project.tech_stack) ? project.tech_stack : (project.tech_stack?.split(',') || []);

  return (
    <main className="min-h-screen bg-surface-canvas dark:bg-brand-primary-950">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-28 bg-brand-primary-950 text-brand-primary-foreground relative overflow-hidden min-h-[60vh] flex items-end">
        <div className="absolute inset-0">
          {project.image ? (
            <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-30" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-brand-primary/30 to-brand-highlight/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-primary-950 via-brand-primary-950/80 to-brand-primary-950/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
          <Link href="/projects" className="flex items-center gap-2 text-brand-primary-foreground/60 hover:text-brand-primary-foreground transition-colors mb-8 text-sm font-medium w-fit">
            <ArrowLeft size={16} /> Back to Projects
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-brand-primary text-brand-primary-foreground text-xs font-bold uppercase tracking-widest rounded-full">{project.category}</span>
              {project.featured && <span className="px-3 py-1 bg-brand-highlight/20 text-brand-highlight text-xs font-bold uppercase tracking-widest rounded-full border border-brand-highlight/30">Featured</span>}
              <div className="flex items-center gap-4 ml-auto">
                <button onClick={() => likeMutation.mutate()} className="flex items-center gap-1.5 text-brand-primary-foreground/60 hover:text-status-error-text transition-colors text-sm font-bold">
                  <Heart size={18} className={project.likes > 0 ? 'fill-current' : ''} /> {project.likes || 0}
                </button>
                <button onClick={handleShare} className="flex items-center gap-1.5 text-brand-primary-foreground/60 hover:text-brand-accent transition-colors text-sm font-bold">
                  <Share2 size={18} /> {project.shares || 0}
                </button>
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tighter mb-4">{project.title}</h1>
            <p className="text-xl text-brand-primary-foreground/70 max-w-3xl leading-relaxed">{project.description}</p>
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Content */}
            <div className="lg:col-span-2 space-y-10">
              {/* About Project */}
              <div className="card card-brand p-8">
                <h2 className="text-2xl font-extrabold text-text-primary mb-4">About this Project</h2>
                <p className="text-text-secondary leading-relaxed text-lg">{project.description}</p>
              </div>

              {/* Tech Stack */}
              <div className="card card-brand p-8">
                <h2 className="text-2xl font-extrabold text-text-primary mb-6 flex items-center gap-2">
                  <Tag size={20} className="text-brand-primary" /> Technology Stack
                </h2>
                <div className="flex flex-wrap gap-3">
                  {techStack.map((tech: string) => (
                    <span key={tech} className="px-4 py-2 bg-brand-primary/10 dark:bg-brand-primary-900/30 text-brand-primary font-bold rounded-xl text-sm border border-brand-primary/20">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-3 text-text-muted text-sm">
                <Calendar size={16} className="text-brand-primary" />
                <span>Created: {new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              {/* Comments Section */}
              <CommentSection targetType="project" targetId={project.id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="card card-brand p-6 space-y-3">
                <h3 className="font-extrabold text-text-primary mb-4">Project Links</h3>
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-brand-primary text-brand-primary-foreground font-bold rounded-xl hover:bg-brand-primary/90 transition-colors"
                  >
                    <ExternalLink size={18} /> View Live Project
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-brand-primary-900 dark:bg-brand-primary-800 text-brand-primary-foreground font-bold rounded-xl hover:bg-brand-primary-800 dark:hover:bg-brand-primary-700 transition-colors"
                  >
                    <GitBranch size={18} /> View Source Code
                  </a>
                )}
                {!project.live_url && !project.github_url && (
                  <p className="text-sm text-text-muted text-center py-2">No links available for this project.</p>
                )}
              </div>

              {/* Engagement Card */}
              <div className="card card-brand p-6 space-y-4">
                <h3 className="font-extrabold text-text-primary mb-2">Engagement</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => likeMutation.mutate()} className="flex flex-col items-center justify-center p-4 bg-surface-subtle dark:bg-brand-primary-900/50 rounded-2xl hover:bg-status-error-bg hover:text-status-error-text transition-colors group border border-border-muted dark:border-brand-primary-800">
                    <Heart size={20} className={project.likes > 0 ? 'fill-current' : 'text-text-muted group-hover:text-status-error-text'} />
                    <span className="text-xs font-bold mt-1">{project.likes || 0}</span>
                  </button>
                  <button onClick={handleShare} className="flex flex-col items-center justify-center p-4 bg-surface-subtle dark:bg-brand-primary-900/50 rounded-2xl hover:bg-brand-accent/10 hover:text-brand-accent transition-colors group border border-border-muted dark:border-brand-primary-800">
                    <Share2 size={20} className="text-text-muted group-hover:text-brand-accent" />
                    <span className="text-xs font-bold mt-1">{project.shares || 0}</span>
                  </button>
                </div>
              </div>

              {/* Category Card */}
              <div className="card card-brand p-6">
                <h3 className="font-extrabold text-text-primary mb-2">Category</h3>
                <span className="px-3 py-1 bg-brand-primary/10 dark:bg-brand-primary-900/30 text-brand-primary text-sm font-bold rounded-lg border border-brand-primary/20">{project.category}</span>
              </div>

              {/* Back CTA */}
              <Link href="/projects" className="flex items-center justify-center gap-2 w-full py-3 border border-border-muted dark:border-brand-primary-800 text-text-secondary font-bold rounded-xl hover:border-brand-primary hover:text-brand-primary transition-all text-sm">
                <ArrowLeft size={16} /> All Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-brand-primary-950 text-brand-primary-foreground text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-extrabold mb-4">Interested in working together?</h2>
          <p className="text-brand-primary-foreground/60 mb-8">Let&apos;s build something amazing. Reach out and let&apos;s discuss your project.</p>
          <Link href="/contact" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg shadow-xl shadow-brand-primary/30">
            Get in Touch <ExternalLink size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

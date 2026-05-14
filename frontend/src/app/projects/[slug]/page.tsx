'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { use } from 'react';
import { motion } from 'framer-motion';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import CommentSection from '@/components/CommentSection';
import { ArrowLeft, ExternalLink, Calendar, Tag, Loader2, Heart, Share2 } from 'lucide-react';

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
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
        <Loader2 className="animate-spin text-primary" size={48} />
      </main>
    );
  }

  if (!project) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Project not found</h1>
        <Link href="/projects" className="btn-primary">Back to Projects</Link>
      </main>
    );
  }

  const techStack = Array.isArray(project.tech_stack) ? project.tech_stack : (project.tech_stack?.split(',') || []);

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero Banner */}
      <section className="pt-28 bg-slate-900 text-white relative overflow-hidden min-h-[60vh] flex items-end">
        <div className="absolute inset-0">
          {project.image ? (
            <img src={project.image} alt={project.title} className="w-full h-full object-cover opacity-30" />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-primary/30 to-secondary/30" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/40" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 pb-16 w-full">
          <Link href="/projects" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium w-fit">
            <ArrowLeft size={16} /> Back to Projects
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            <div className="flex flex-wrap items-center gap-3 mb-4">
              <span className="px-3 py-1 bg-primary text-white text-xs font-bold uppercase tracking-widest rounded-full">{project.category}</span>
              {project.featured && <span className="px-3 py-1 bg-secondary/20 text-secondary text-xs font-bold uppercase tracking-widest rounded-full border border-secondary/30">Featured</span>}
              <div className="flex items-center gap-4 ml-auto">
                <button onClick={() => likeMutation.mutate()} className="flex items-center gap-1.5 text-slate-300 hover:text-red-400 transition-colors text-sm font-bold">
                  <Heart size={18} className={project.likes > 0 ? 'fill-red-400 text-red-400' : ''} /> {project.likes || 0}
                </button>
                <button onClick={handleShare} className="flex items-center gap-1.5 text-slate-300 hover:text-blue-400 transition-colors text-sm font-bold">
                  <Share2 size={18} /> {project.shares || 0}
                </button>
              </div>
            </div>
            <h1 className="text-4xl lg:text-6xl font-extrabold tracking-tighter mb-4">{project.title}</h1>
            <p className="text-xl text-slate-300 max-w-3xl leading-relaxed">{project.description}</p>
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
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-4">About this Project</h2>
                <p className="text-slate-600 leading-relaxed text-lg">{project.description}</p>
              </div>

              {/* Tech Stack */}
              <div>
                <h2 className="text-2xl font-bold text-slate-900 mb-6 flex items-center gap-2">
                  <Tag size={20} className="text-primary" /> Technology Stack
                </h2>
                <div className="flex flex-wrap gap-3">
                  {techStack.map((tech: string) => (
                    <span key={tech} className="px-4 py-2 bg-blue-50 text-primary font-bold rounded-xl text-sm border border-blue-100">
                      {tech.trim()}
                    </span>
                  ))}
                </div>
              </div>

              {/* Timeline */}
              <div className="flex items-center gap-3 text-slate-400 text-sm">
                <Calendar size={16} />
                <span>Created: {new Date(project.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
              </div>

              {/* Comments Section */}
              <CommentSection targetType="project" targetId={project.id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Action Buttons */}
              <div className="bg-slate-50 p-6 rounded-[24px] space-y-3">
                <h3 className="font-bold text-slate-900 mb-4">Project Links</h3>
                {project.live_url && (
                  <a
                    href={project.live_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-colors"
                  >
                    <ExternalLink size={18} /> View Live Project
                  </a>
                )}
                {project.github_url && (
                  <a
                    href={project.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center justify-center gap-2 w-full py-3 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-colors"
                  >
                    <GithubIcon size={18} /> View Source Code
                  </a>
                )}
                {!project.live_url && !project.github_url && (
                  <p className="text-sm text-slate-400 text-center py-2">No links available for this project.</p>
                )}
              </div>

              {/* Engagement Card */}
              <div className="bg-white border border-slate-100 p-6 rounded-[24px] space-y-4">
                <h3 className="font-bold text-slate-900 mb-2">Engagement</h3>
                <div className="grid grid-cols-2 gap-3">
                  <button onClick={() => likeMutation.mutate()} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-red-50 hover:text-red-500 transition-colors group">
                    <Heart size={20} className={project.likes > 0 ? 'fill-red-400 text-red-400' : 'text-slate-400 group-hover:text-red-400'} />
                    <span className="text-xs font-bold mt-1">{project.likes || 0}</span>
                  </button>
                  <button onClick={handleShare} className="flex flex-col items-center justify-center p-4 bg-slate-50 rounded-2xl hover:bg-blue-50 hover:text-blue-500 transition-colors group">
                    <Share2 size={20} className="text-slate-400 group-hover:text-blue-400" />
                    <span className="text-xs font-bold mt-1">{project.shares || 0}</span>
                  </button>
                </div>
              </div>

              {/* Category Card */}
              <div className="bg-white border border-slate-100 p-6 rounded-[24px]">
                <h3 className="font-bold text-slate-900 mb-2">Category</h3>
                <span className="px-3 py-1 bg-primary/10 text-primary text-sm font-bold rounded-lg">{project.category}</span>
              </div>

              {/* Back CTA */}
              <Link href="/projects" className="flex items-center justify-center gap-2 w-full py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:border-primary hover:text-primary transition-all text-sm">
                <ArrowLeft size={16} /> All Projects
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 bg-slate-900 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Interested in working together?</h2>
          <p className="text-slate-400 mb-8">Let&apos;s build something amazing. Reach out and let&apos;s discuss your project.</p>
          <Link href="/contact" className="btn-primary inline-flex items-center gap-2 px-8 py-4 text-lg shadow-xl shadow-blue-500/20">
            Get in Touch <ExternalLink size={18} />
          </Link>
        </div>
      </section>
    </main>
  );
}

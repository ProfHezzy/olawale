'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Loader2, ExternalLink, Star, X, Search, GitBranch } from 'lucide-react';
import toast from 'react-hot-toast';

type Project = {
  id: string; title: string; slug: string; description: string;
  tech_stack: string[] | string; category: string; featured: boolean;
  github_url: string; live_url: string; image?: string;
};

function ProjectModal({ project, onClose }: { project?: Project | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const isEdit = !!project;

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      title: project?.title || '',
      slug: project?.slug || '',
      description: project?.description || '',
      tech_stack: Array.isArray(project?.tech_stack) ? project.tech_stack.join(', ') : project?.tech_stack || '',
      category: project?.category || '',
      featured: project?.featured || false,
      github_url: project?.github_url || '',
      live_url: project?.live_url || '',
      image: project?.image || '',
    },
  });

  type ProjectFormData = {
  title: string;
  slug: string;
  description: string;
  tech_stack: string;
  category: string;
  featured: boolean;
  github_url: string;
  live_url: string;
  image: string;
};

  const onSubmit = async (data: ProjectFormData) => {
    try {
      const payload = {
        ...data,
        tech_stack: data.tech_stack.split(',').map((t) => t.trim()).filter(Boolean),
        featured: data.featured,
        slug: data.slug || data.title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, ''),
      };
      if (isEdit) {
        await api.patch(`/projects/${project.id}`, payload);
        toast.success('Project updated!');
      } else {
        await api.post('/projects', payload);
        toast.success('Project created!');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-projects'] });
      onClose();
    } catch (err: unknown) {
      const error = err as { response?: { data?: { message?: string } } };
      toast.error(error.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 dark:bg-black/70 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-surface-card dark:bg-brand-primary-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-brand-primary/20 dark:shadow-brand-primary/30 border border-border-default dark:border-brand-primary-800">
        <div className="flex items-center justify-between p-6 border-b border-border-default dark:border-brand-primary-800">
          <h2 className="text-xl font-extrabold text-text-primary">{isEdit ? 'Edit Project' : 'New Project'}</h2>
          <button onClick={onClose} className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-subtle dark:hover:bg-brand-primary-800 rounded-xl transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Title *</label>
              <input {...register('title', { required: true })} placeholder="My Amazing Project" className="w-full px-4 py-3 bg-surface-subtle dark:bg-brand-primary-900/50 border border-border-muted dark:border-brand-primary-800 rounded-xl text-text-primary placeholder-text-muted focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Slug</label>
              <input {...register('slug')} placeholder="auto-generated" className="w-full px-4 py-3 bg-surface-subtle dark:bg-brand-primary-900/50 border border-border-muted dark:border-brand-primary-800 rounded-xl text-text-primary placeholder-text-muted focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Category *</label>
              <input {...register('category', { required: true })} placeholder="Web App, SaaS, AI & ML..." className="w-full px-4 py-3 bg-surface-subtle dark:bg-brand-primary-900/50 border border-border-muted dark:border-brand-primary-800 rounded-xl text-text-primary placeholder-text-muted focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Description *</label>
            <textarea {...register('description', { required: true })} rows={3} placeholder="Describe what this project does..." className="w-full px-4 py-3 bg-surface-subtle dark:bg-brand-primary-900/50 border border-border-muted dark:border-brand-primary-800 rounded-xl text-text-primary placeholder-text-muted focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all resize-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Tech Stack (comma-separated)</label>
            <input {...register('tech_stack')} placeholder="React, NestJS, PostgreSQL, Docker" className="w-full px-4 py-3 bg-surface-subtle dark:bg-brand-primary-900/50 border border-border-muted dark:border-brand-primary-800 rounded-xl text-text-primary placeholder-text-muted focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">GitHub URL</label>
              <input {...register('github_url')} placeholder="https://github.com/..." className="w-full px-4 py-3 bg-surface-subtle dark:bg-brand-primary-900/50 border border-border-muted dark:border-brand-primary-800 rounded-xl text-text-primary placeholder-text-muted focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
            </div>
            <div>
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Live URL</label>
              <input {...register('live_url')} placeholder="https://example.com" className="w-full px-4 py-3 bg-surface-subtle dark:bg-brand-primary-900/50 border border-border-muted dark:border-brand-primary-800 rounded-xl text-text-primary placeholder-text-muted focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
            </div>
            <div className="col-span-2">
              <label className="block text-xs font-bold text-text-muted uppercase tracking-wider mb-1.5">Image URL</label>
              <input {...register('image')} placeholder="https://images.unsplash.com/..." className="w-full px-4 py-3 bg-surface-subtle dark:bg-brand-primary-900/50 border border-border-muted dark:border-brand-primary-800 rounded-xl text-text-primary placeholder-text-muted focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all" />
            </div>
          </div>
          <div className="flex items-center gap-3 pt-1">
            <input type="checkbox" {...register('featured')} id="featured" className="w-4 h-4 accent-brand-primary rounded border-border-muted dark:border-brand-primary-800" />
            <label htmlFor="featured" className="text-sm font-semibold text-text-secondary cursor-pointer">Mark as Featured</label>
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-border-muted dark:border-brand-primary-800 rounded-xl font-bold text-text-secondary hover:bg-surface-subtle dark:hover:bg-brand-primary-800 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-brand-primary text-brand-primary-foreground rounded-xl font-bold hover:bg-brand-primary/90 transition-colors flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
              {isEdit ? 'Save Changes' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminProjectsPage() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<'create' | Project | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data: projects, isLoading } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => api.get('/projects').then(r => r.data),
    refetchInterval: 10000,
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/projects/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-projects'] }); toast.success('Project deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const filtered = projects?.filter((p: Project) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  ) || [];

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  // Reset to page 1 when search changes
  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-text-primary">Projects</h1>
          <p className="text-text-muted text-sm">{projects?.length || 0} total projects</p>
        </div>
        <button onClick={() => setModal('create')} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> New Project
        </button>
      </div>

      {/* Search */}
      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" />
        <input
          placeholder="Search projects..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-surface-card dark:bg-brand-primary-900 border border-border-muted dark:border-brand-primary-800 rounded-xl text-sm text-text-primary placeholder-text-muted focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/20 outline-none transition-all"
        />
      </div>

      {/* Table */}
      <div className="bg-surface-card dark:bg-brand-primary-900 rounded-2xl border border-border-default dark:border-brand-primary-800 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-text-muted" size={32} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-border-muted dark:border-brand-primary-800 bg-surface-subtle/60 dark:bg-brand-primary-900/60">
                  <th className="text-left px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Project</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider hidden md:table-cell">Tech Stack</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-text-muted uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border-muted dark:divide-brand-primary-800/50">
                {paginatedData.map((project: Project) => (
                  <tr key={project.id} className="hover:bg-surface-subtle/60 dark:hover:bg-brand-primary-800/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-highlight flex items-center justify-center text-white font-bold text-sm shrink-0">
                          {project.title[0]}
                        </div>
                        <div>
                          <p className="font-semibold text-text-primary text-sm">{project.title}</p>
                          <p className="text-xs text-text-muted">{project.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-2.5 py-1 bg-brand-primary/10 dark:bg-brand-primary-900/30 text-brand-primary rounded-full border border-brand-primary/20">{project.category}</span>
                    </td>
                    <td className="px-6 py-4 hidden md:table-cell">
                      <div className="flex flex-wrap gap-1">
                        {(Array.isArray(project.tech_stack) ? project.tech_stack : (project.tech_stack as string)?.split(',') || []).slice(0, 3).map((t: string) => (
                          <span key={t} className="text-[10px] px-1.5 py-0.5 bg-surface-subtle dark:bg-brand-primary-900/50 text-text-secondary dark:text-text-inverse rounded font-medium border border-border-muted dark:border-brand-primary-800">{t.trim()}</span>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {project.featured ? (
                        <span className="flex items-center gap-1 text-xs font-bold text-brand-accent bg-brand-accent/10 dark:bg-brand-accent/20 px-2.5 py-1 rounded-full w-fit border border-brand-accent/20">
                          <Star size={10} fill="currentColor" /> Featured
                        </span>
                      ) : (
                        <span className="text-xs font-bold text-text-muted bg-surface-subtle dark:bg-brand-primary-900/50 px-2.5 py-1 rounded-full border border-border-muted dark:border-brand-primary-800">Standard</span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        {project.github_url && (
                          <a href={project.github_url} target="_blank" rel="noreferrer" className="p-2 text-text-muted hover:text-text-primary hover:bg-surface-subtle dark:hover:bg-brand-primary-800 rounded-lg transition-colors">
                            <GitBranch size={15} />
                          </a>
                        )}
                        {project.live_url && (
                          <a href={project.live_url} target="_blank" rel="noreferrer" className="p-2 text-text-muted hover:text-brand-primary hover:bg-brand-primary/10 dark:hover:bg-brand-primary/20 rounded-lg transition-colors">
                            <ExternalLink size={15} />
                          </a>
                        )}
                        <button onClick={() => setModal(project)} className="p-2 text-text-muted hover:text-brand-primary hover:bg-brand-primary/10 dark:hover:bg-brand-primary/20 rounded-lg transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete "${project.title}"?`)) deleteMutation.mutate(project.id);
                          }}
                          className="p-2 text-text-muted hover:text-status-error-text hover:bg-status-error-bg dark:hover:bg-status-error-bg/20 rounded-lg transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination Controls */}
            {totalPages > 1 && (
              <div className="px-6 py-4 bg-surface-subtle/60 dark:bg-brand-primary-900/60 border-t border-border-muted dark:border-brand-primary-800 flex items-center justify-between">
                <p className="text-xs font-bold text-text-muted uppercase tracking-widest">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-4 py-2 bg-surface-card dark:bg-brand-primary-900 border border-border-muted dark:border-brand-primary-800 rounded-lg text-xs font-bold text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-subtle dark:hover:bg-brand-primary-800 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-4 py-2 bg-surface-card dark:bg-brand-primary-900 border border-border-muted dark:border-brand-primary-800 rounded-lg text-xs font-bold text-text-secondary disabled:opacity-50 disabled:cursor-not-allowed hover:bg-surface-subtle dark:hover:bg-brand-primary-800 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {filtered?.length === 0 && (
              <div className="py-16 text-center text-text-muted">
                <p className="font-medium">No projects found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {modal && (
        <ProjectModal
          project={modal === 'create' ? null : modal as Project}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

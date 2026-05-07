'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Loader2, X, Search, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

type Skill = {
  id: string; name: string; category: string; level: string; order: number;
};

function SkillModal({ skill, onClose }: { skill?: Skill | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const isEdit = !!skill;

  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      name: skill?.name || '',
      category: skill?.category || '',
      level: skill?.level || 'Intermediate',
      order: skill?.order || 0,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      const payload = { ...data, order: Number(data.order) };
      if (isEdit) {
        await api.patch(`/skills/${skill.id}`, payload);
        toast.success('Skill updated!');
      } else {
        await api.post('/skills', payload);
        toast.success('Skill created!');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-skills'] });
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-lg shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Skill' : 'New Skill'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Skill Name *</label>
            <input {...register('name', { required: true })} placeholder="React, Python, AWS..." className="admin-input" />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Category *</label>
              <select {...register('category', { required: true })} className="admin-input">
                <option value="frontend">Frontend</option>
                <option value="backend">Backend</option>
                <option value="database">Database</option>
                <option value="tools">Tools & Cloud</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Proficiency Level</label>
              <select {...register('level')} className="admin-input">
                <option value="Beginner">Beginner</option>
                <option value="Intermediate">Intermediate</option>
                <option value="Advanced">Advanced</option>
                <option value="Expert">Expert</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Display Order (Sorting)</label>
            <input {...register('order')} type="number" placeholder="0" className="admin-input" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-emerald-600 text-white rounded-xl font-bold hover:bg-emerald-700 transition-colors flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : <CheckCircle size={18} />}
              {isEdit ? 'Save Changes' : 'Add Skill'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminSkillsPage() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<'create' | Skill | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data: skills, isLoading } = useQuery({
    queryKey: ['admin-skills'],
    queryFn: () => api.get('/skills').then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/skills/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-skills'] }); toast.success('Skill deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const filtered = (skills?.filter((s: Skill) =>
    s.name.toLowerCase().includes(search.toLowerCase()) ||
    s.category.toLowerCase().includes(search.toLowerCase())
  ) || []).sort((a: Skill, b: Skill) => a.order - b.order);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Skills & Tech Stack</h1>
          <p className="text-slate-500 text-sm">{skills?.length || 0} skills managed</p>
        </div>
        <button onClick={() => setModal('create')} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 text-white font-bold rounded-xl hover:bg-emerald-700 transition-colors">
          <Plus size={18} /> Add Skill
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input placeholder="Search skills..." value={search} onChange={e => handleSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 outline-none transition-all"
        />
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-16"><Loader2 className="animate-spin text-slate-300" size={32} /></div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60">
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Skill Name</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Category</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Level</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedData.map((skill: Skill) => (
                  <tr key={skill.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <p className="font-bold text-slate-900 text-sm">{skill.name}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full capitalize">{skill.category}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm font-medium text-slate-500">{skill.level}</span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setModal(skill)} className="p-2 text-slate-400 hover:text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => { if (window.confirm(`Delete "${skill.name}"?`)) deleteMutation.mutate(skill.id); }}
                          className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
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
              <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">
                  Page {currentPage} of {totalPages}
                </p>
                <div className="flex gap-2">
                  <button
                    disabled={currentPage === 1}
                    onClick={() => setCurrentPage(prev => prev - 1)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                  >
                    Previous
                  </button>
                  <button
                    disabled={currentPage === totalPages}
                    onClick={() => setCurrentPage(prev => prev + 1)}
                    className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
            {filtered?.length === 0 && (
              <div className="py-16 text-center text-slate-400">
                <p className="font-medium">No skills found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {modal && (
        <SkillModal skill={modal === 'create' ? null : modal as Skill} onClose={() => setModal(null)} />
      )}
    </div>
  );
}

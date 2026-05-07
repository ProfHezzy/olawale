'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Loader2, X, Search, Briefcase } from 'lucide-react';
import toast from 'react-hot-toast';

type Experience = {
  id: string;
  company: string;
  position: string;
  location: string;
  period: string;
  description: string;
  order: number;
};

function ExperienceModal({ experience, onClose }: { experience?: Experience | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const isEdit = !!experience;
  
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      company: experience?.company || '',
      position: experience?.position || '',
      location: experience?.location || '',
      period: experience?.period || '',
      description: experience?.description || '',
      order: experience?.order || 0,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (isEdit) {
        await api.patch(`/experience/${experience.id}`, data);
        toast.success('Experience updated!');
      } else {
        await api.post('/experience', data);
        toast.success('Experience created!');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-experience'] });
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Experience' : 'New Experience'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Company *</label>
              <input {...register('company', { required: true })} placeholder="e.g. Google" className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Position *</label>
              <input {...register('position', { required: true })} placeholder="e.g. Senior Developer" className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Period *</label>
              <input {...register('period', { required: true })} placeholder="e.g. Jan 2020 - Present" className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
              <input {...register('location')} placeholder="e.g. Lagos, Nigeria" className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Display Order</label>
              <input {...register('order')} type="number" className="admin-input" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description *</label>
            <textarea {...register('description', { required: true })} rows={4} placeholder="Describe your roles and achievements..." className="admin-input resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
              {isEdit ? 'Save Changes' : 'Create Experience'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminExperiencePage() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<'create' | Experience | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data: experiences, isLoading } = useQuery({
    queryKey: ['admin-experience'],
    queryFn: () => api.get('/experience').then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/experience/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-experience'] }); toast.success('Experience deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const filtered = (experiences?.filter((e: Experience) =>
    e.company.toLowerCase().includes(search.toLowerCase()) ||
    e.position.toLowerCase().includes(search.toLowerCase())
  ) || []).sort((a: Experience, b: Experience) => a.order - b.order);

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Work Experience</h1>
          <p className="text-slate-500 text-sm">{experiences?.length || 0} entries found</p>
        </div>
        <button onClick={() => setModal('create')} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Experience
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Search company or position..."
          value={search}
          onChange={e => handleSearch(e.target.value)}
          className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all"
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
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Company & Position</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Period</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Order</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedData.map((exp: Experience) => (
                  <tr key={exp.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          <Briefcase size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{exp.company}</p>
                          <p className="text-xs text-slate-400">{exp.position}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600">{exp.period}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-400">{exp.order}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setModal(exp)} className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete experience at "${exp.company}"?`)) deleteMutation.mutate(exp.id);
                          }}
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
                <p className="font-medium">No experience entries found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {modal && (
        <ExperienceModal
          experience={modal === 'create' ? null : modal as Experience}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

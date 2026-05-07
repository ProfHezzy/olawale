'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Plus, Pencil, Trash2, Loader2, X, Search, GraduationCap } from 'lucide-react';
import toast from 'react-hot-toast';

type Academic = {
  id: string;
  institution: string;
  degree: string;
  location: string;
  period: string;
  grade: string;
  description: string;
  order: number;
};

function AcademicModal({ academic, onClose }: { academic?: Academic | null; onClose: () => void }) {
  const queryClient = useQueryClient();
  const isEdit = !!academic;
  
  const { register, handleSubmit, formState: { isSubmitting } } = useForm({
    defaultValues: {
      institution: academic?.institution || '',
      degree: academic?.degree || '',
      location: academic?.location || '',
      period: academic?.period || '',
      grade: academic?.grade || '',
      description: academic?.description || '',
      order: academic?.order || 0,
    },
  });

  const onSubmit = async (data: any) => {
    try {
      if (isEdit) {
        await api.patch(`/academics/${academic.id}`, data);
        toast.success('Academic entry updated!');
      } else {
        await api.post('/academics', data);
        toast.success('Academic entry created!');
      }
      queryClient.invalidateQueries({ queryKey: ['admin-academics'] });
      onClose();
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Something went wrong');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="flex items-center justify-between p-6 border-b border-slate-100">
          <h2 className="text-xl font-bold text-slate-900">{isEdit ? 'Edit Academic Entry' : 'New Academic Entry'}</h2>
          <button onClick={onClose} className="p-2 text-slate-400 hover:bg-slate-100 rounded-xl transition-colors"><X size={20} /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="col-span-2">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Institution *</label>
              <input {...register('institution', { required: true })} placeholder="e.g. University of Lagos" className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Degree *</label>
              <input {...register('degree', { required: true })} placeholder="e.g. B.Sc in Computer Science" className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Period *</label>
              <input {...register('period', { required: true })} placeholder="e.g. 2015 - 2019" className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Location</label>
              <input {...register('location')} placeholder="e.g. Lagos, Nigeria" className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Grade / CGPA</label>
              <input {...register('grade')} placeholder="e.g. First Class" className="admin-input" />
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Display Order</label>
              <input {...register('order')} type="number" className="admin-input" />
            </div>
          </div>
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Description</label>
            <textarea {...register('description')} rows={3} placeholder="Describe your focus, achievements, etc." className="admin-input resize-none" />
          </div>
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-3 border border-slate-200 rounded-xl font-bold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="flex-1 py-3 bg-primary text-white rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2">
              {isSubmitting ? <Loader2 className="animate-spin" size={18} /> : null}
              {isEdit ? 'Save Changes' : 'Create Entry'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function AdminAcademicsPage() {
  const queryClient = useQueryClient();
  const [modal, setModal] = useState<'create' | Academic | null>(null);
  const [search, setSearch] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data: academics, isLoading } = useQuery({
    queryKey: ['admin-academics'],
    queryFn: () => api.get('/academics').then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/academics/${id}`),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-academics'] }); toast.success('Entry deleted'); },
    onError: () => toast.error('Failed to delete'),
  });

  const filtered = (academics?.filter((a: Academic) =>
    a.institution.toLowerCase().includes(search.toLowerCase()) ||
    a.degree.toLowerCase().includes(search.toLowerCase())
  ) || []).sort((a: Academic, b: Academic) => a.order - b.order);

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
          <h1 className="text-2xl font-bold text-slate-900">Academic History</h1>
          <p className="text-slate-500 text-sm">{academics?.length || 0} entries found</p>
        </div>
        <button onClick={() => setModal('create')} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Add Academic Entry
        </button>
      </div>

      <div className="relative">
        <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          placeholder="Search institution or degree..."
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
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Institution & Degree</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Period</th>
                  <th className="text-left px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Grade</th>
                  <th className="text-right px-6 py-4 text-xs font-bold text-slate-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {paginatedData.map((acad: Academic) => (
                  <tr key={acad.id} className="hover:bg-slate-50/60 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0">
                          <GraduationCap size={18} />
                        </div>
                        <div>
                          <p className="font-semibold text-slate-900 text-sm">{acad.institution}</p>
                          <p className="text-xs text-slate-400">{acad.degree}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-600">{acad.period}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-bold text-slate-400">{acad.grade || 'N/A'}</span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button onClick={() => setModal(acad)} className="p-2 text-slate-400 hover:text-primary hover:bg-blue-50 rounded-lg transition-colors">
                          <Pencil size={15} />
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Delete academic entry for "${acad.institution}"?`)) deleteMutation.mutate(acad.id);
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
                <p className="font-medium">No academic entries found.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {modal && (
        <AcademicModal
          academic={modal === 'create' ? null : modal as Academic}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}

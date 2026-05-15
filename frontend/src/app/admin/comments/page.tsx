'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { MessageSquare, Check, Trash2, Loader2, ExternalLink, Clock, Tag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

export default function AdminCommentsPage() {
  const queryClient = useQueryClient();

  const { data: comments, isLoading } = useQuery({
    queryKey: ['admin-comments'],
    queryFn: () => api.get('/comments').then(r => r.data),
    refetchInterval: 5000, // Real-time polling
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/comments/${id}/approve`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      toast.success('Comment approved!');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/comments/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-comments'] });
      toast.success('Comment deleted');
    }
  });

  if (isLoading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={48} />
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div>
        <h1 className="text-3xl font-black text-slate-900 tracking-tight">Comment Moderation</h1>
        <p className="text-slate-500 font-medium">Manage user engagement across your portfolio.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        <AnimatePresence mode="popLayout">
          {comments?.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="bg-white p-12 rounded-[32px] border border-slate-100 text-center"
            >
              <MessageSquare size={48} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-500 font-bold">No comments yet</p>
            </motion.div>
          ) : (
            comments.map((comment: any) => (
              <motion.div
                key={comment.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className={`bg-white p-6 rounded-3xl border border-slate-100 shadow-sm flex flex-col md:flex-row gap-6 items-start transition-all ${!comment.approved ? 'border-l-4 border-l-yellow-400' : ''}`}
              >
                {/* Author Avatar/Info */}
                <div className="flex items-center gap-4 shrink-0">
                  <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-lg uppercase">
                    {comment.author_name[0]}
                  </div>
                  <div>
                    <p className="font-bold text-slate-900">{comment.author_name}</p>
                    <p className="text-xs text-slate-400 flex items-center gap-1">
                      <Clock size={12} /> {new Date(comment.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-2">
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${comment.target_type === 'blog' ? 'bg-purple-50 text-purple-600' : 'bg-blue-50 text-blue-600'}`}>
                      {comment.target_type}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${comment.approved ? 'bg-emerald-50 text-emerald-600' : 'bg-yellow-50 text-yellow-600'}`}>
                      {comment.approved ? 'Approved' : 'Pending Approval'}
                    </span>
                  </div>
                  <p className="text-slate-600 text-sm leading-relaxed">{comment.content}</p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2 shrink-0 self-end md:self-start">
                  {!comment.approved && (
                    <button
                      onClick={() => approveMutation.mutate(comment.id)}
                      className="p-3 bg-emerald-500 text-white rounded-xl hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20"
                      title="Approve Comment"
                    >
                      <Check size={18} />
                    </button>
                  )}
                  <button
                    onClick={() => { if (confirm('Delete this comment?')) deleteMutation.mutate(comment.id); }}
                    className="p-3 bg-white border border-slate-200 text-slate-400 hover:text-red-500 hover:border-red-100 hover:bg-red-50 rounded-xl transition-all"
                    title="Delete Comment"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { MessageSquare, Send, User, Clock, Loader2, CheckCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

interface CommentSectionProps {
  targetType: 'blog' | 'project';
  targetId: string;
}

export default function CommentSection({ targetType, targetId }: CommentSectionProps) {
  const queryClient = useQueryClient();
  const [name, setName] = useState('');
  const [content, setContent] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const { data: comments, isLoading } = useQuery({
    queryKey: ['comments', targetType, targetId],
    queryFn: async () => {
      const res = await api.get(`/comments/${targetType}/${targetId}`);
      return res.data;
    },
  });

  const mutation = useMutation({
    mutationFn: async (newComment: any) => {
      return api.post('/comments', newComment);
    },
    onSuccess: () => {
      setIsSubmitted(true);
      setName('');
      setContent('');
      toast.success('Comment submitted! It will appear after approval.');
      // We don't invalidate here because they aren't approved yet, 
      // but if they were instant, we would use:
      // queryClient.invalidateQueries({ queryKey: ['comments', targetType, targetId] });
    },
    onError: () => {
      toast.error('Failed to post comment. Please try again.');
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !content.trim()) return;
    mutation.mutate({
      author_name: name,
      content,
      target_type: targetType,
      target_id: targetId,
    });
  };

  return (
    <div className="mt-16 pt-16 border-t border-slate-100">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
          <MessageSquare size={20} />
        </div>
        <h3 className="text-2xl font-bold text-slate-900">Discussion ({comments?.length || 0})</h3>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Form */}
        <div className="lg:col-span-1">
          <div className="bg-slate-50 rounded-2xl p-6 sticky top-24">
            <h4 className="font-bold text-slate-900 mb-4">Leave a comment</h4>
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-8"
                >
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle size={24} />
                  </div>
                  <p className="font-bold text-slate-900 mb-1">Thank you!</p>
                  <p className="text-sm text-slate-500 mb-4">Your comment is awaiting moderation.</p>
                  <button 
                    onClick={() => setIsSubmitted(false)}
                    className="text-sm font-bold text-primary hover:underline"
                  >
                    Post another
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  onSubmit={handleSubmit}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Name</label>
                    <div className="relative">
                      <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Your name"
                        required
                        className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Comment</label>
                    <textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Share your thoughts..."
                      required
                      rows={4}
                      className="w-full px-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:border-primary transition-all resize-none"
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={mutation.isPending}
                    className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary/90 transition-all flex items-center justify-center gap-2 shadow-lg shadow-blue-500/20 disabled:opacity-50"
                  >
                    {mutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Send size={18} />}
                    Post Comment
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* List */}
        <div className="lg:col-span-2">
          {isLoading ? (
            <div className="flex justify-center py-12"><Loader2 className="animate-spin text-slate-200" size={32} /></div>
          ) : comments?.length > 0 ? (
            <div className="space-y-8">
              {comments.map((comment: any) => (
                <div key={comment.id} className="flex gap-4">
                  <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 shrink-0">
                    <User size={20} />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className="font-bold text-slate-900">{comment.author_name}</h5>
                      <span className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock size={10} /> {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <p className="text-slate-600 text-sm leading-relaxed">{comment.content}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12 bg-slate-50 rounded-3xl border border-dashed border-slate-200">
              <MessageSquare size={32} className="text-slate-200 mx-auto mb-3" />
              <p className="text-slate-400 font-medium">No comments yet. Be the first to start the conversation!</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

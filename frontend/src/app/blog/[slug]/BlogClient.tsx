'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import CommentSection from '@/components/CommentSection';
import toast from 'react-hot-toast';
import { Heart, Share2, ArrowLeft, Calendar, Clock, Tag, Loader2 } from 'lucide-react';

export default function BlogClient({ slug }: { slug: string }) {
  const queryClient = useQueryClient();

  const { data: post, isLoading } = useQuery({
    queryKey: ['blog', slug],
    queryFn: async () => {
      const res = await api.get(`/blog/${slug}`);
      return res.data;
    },
  });

  const likeMutation = useMutation({
    mutationFn: () => api.patch(`/blog/${post.id}/like`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', slug] });
      toast.success('Thanks for the like!');
    }
  });

  const shareMutation = useMutation({
    mutationFn: () => api.patch(`/blog/${post.id}/share`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['blog', slug] });
    }
  });

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: post.title,
        text: post.excerpt,
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

  if (!post) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center gap-4">
        <h1 className="text-3xl font-bold text-slate-900">Article not found</h1>
        <Link href="/blog" className="btn-primary">Back to Blog</Link>
      </main>
    );
  }

  const tags = post.tags ? post.tags.split(',') : [];

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-28 pb-0 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute inset-0">
          {post.cover_image && (
            <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover opacity-20" />
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/80 to-slate-900/50" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 pb-12">
          <Link href="/blog" className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors mb-8 text-sm font-medium w-fit">
            <ArrowLeft size={16} /> Back to Blog
          </Link>

          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}>
            {/* Tags */}
            {tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {tags.map((tag: string) => (
                  <span key={tag} className="px-3 py-1 bg-emerald-400/20 text-emerald-400 text-xs font-bold rounded-full border border-emerald-400/20">
                    {tag.trim()}
                  </span>
                ))}
              </div>
            )}

            <h1 className="text-3xl lg:text-5xl font-extrabold tracking-tight mb-6 leading-tight">{post.title}</h1>

            {/* Meta */}
            <div className="flex flex-wrap items-center gap-6 text-slate-400 text-sm font-medium">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} /> {new Date(post.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
              </span>
              {post.read_time && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} /> {post.read_time} min read
                </span>
              )}
              <div className="flex items-center gap-4 ml-auto">
                <button 
                  onClick={() => likeMutation.mutate()}
                  className="flex items-center gap-1.5 hover:text-red-400 transition-colors"
                >
                  <Heart size={16} className={post.likes > 0 ? 'fill-red-400 text-red-400' : ''} /> {post.likes || 0}
                </button>
                <button 
                  onClick={handleShare}
                  className="flex items-center gap-1.5 hover:text-blue-400 transition-colors"
                >
                  <Share2 size={16} /> {post.shares || 0}
                </button>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Cover Image Full */}
        {post.cover_image && (
          <div className="relative z-10 max-w-5xl mx-auto px-6">
            <div className="aspect-[16/7] rounded-t-[32px] overflow-hidden">
              <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </section>

      {/* Article Body */}
      <section className="py-16">
        <div className="max-w-4xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Excerpt */}
              {post.excerpt && (
                <p className="text-xl text-slate-500 font-medium leading-relaxed mb-10 pb-10 border-b border-slate-100">
                  {post.excerpt}
                </p>
              )}

              {/* Content */}
              <div
                className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-primary prose-img:rounded-2xl"
                dangerouslySetInnerHTML={{ __html: post.content || '<p class="text-slate-500">Full article content will appear here.</p>' }}
              />

              {/* Tags */}
              {tags.length > 0 && (
                <div className="mt-12 pt-8 border-t border-slate-100">
                  <p className="text-sm font-bold text-slate-500 mb-4 flex items-center gap-2 uppercase tracking-wider"><Tag size={14} /> Tags</p>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag: string) => (
                      <span key={tag} className="px-3 py-1.5 bg-slate-100 text-slate-600 text-sm font-semibold rounded-xl">{tag.trim()}</span>
                    ))}
                  </div>
                </div>
              )}

              {/* Comments Section */}
              <CommentSection targetType="blog" targetId={post.id} />
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Share */}
              <div className="bg-slate-50 p-5 rounded-[20px]">
                <h3 className="font-bold text-slate-900 mb-4 text-sm uppercase tracking-wider">Engagement</h3>
                <div className="space-y-4">
                  <button
                    onClick={() => likeMutation.mutate()}
                    className="flex items-center gap-3 w-full p-3 bg-white border border-slate-100 rounded-xl text-slate-600 font-bold hover:border-red-200 hover:text-red-500 transition-all text-sm shadow-sm"
                  >
                    <Heart size={18} className={post.likes > 0 ? 'fill-current' : ''} />
                    Like Article ({post.likes || 0})
                  </button>
                  <button
                    onClick={handleShare}
                    className="flex items-center gap-3 w-full p-3 bg-white border border-slate-100 rounded-xl text-slate-600 font-bold hover:border-blue-200 hover:text-blue-500 transition-all text-sm shadow-sm"
                  >
                    <Share2 size={18} />
                    Share ({post.shares || 0})
                  </button>
                </div>
              </div>

              {/* Back to Blog */}
              <Link href="/blog" className="flex items-center justify-center gap-2 w-full py-3 border border-slate-200 text-slate-600 font-bold rounded-xl hover:border-primary hover:text-primary transition-all text-sm">
                <ArrowLeft size={16} /> More Articles
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-gradient-to-br from-primary to-blue-700 text-white text-center">
        <div className="max-w-2xl mx-auto px-6">
          <h2 className="text-3xl font-bold mb-4">Enjoyed this article?</h2>
          <p className="text-blue-100 mb-8">Let&apos;s connect and build something great together.</p>
          <Link href="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-white text-primary font-bold rounded-2xl hover:shadow-xl hover:shadow-blue-900/30 transition-all text-lg">
            Get in Touch
          </Link>
        </div>
      </section>
    </main>
  );
}

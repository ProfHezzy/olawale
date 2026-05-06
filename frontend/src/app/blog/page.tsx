'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Tag, Loader2, Search } from 'lucide-react';
import { useState } from 'react';

export default function BlogPage() {
  const [search, setSearch] = useState('');

  const { data: posts, isLoading } = useQuery({
    queryKey: ['blog'],
    queryFn: async () => {
      const res = await api.get('/blog');
      return res.data;
    },
  });

  const filtered = posts?.filter((p: any) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.excerpt?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-white">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-slate-900 text-white relative overflow-hidden">
        <div className="absolute top-0 left-0 w-[400px] h-[400px] bg-emerald-500/10 rounded-full blur-[120px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <span className="text-emerald-400 font-bold text-sm tracking-widest uppercase mb-4 block">My Thoughts</span>
            <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter mb-6">The Blog</h1>
            <p className="text-xl text-slate-400 max-w-2xl mb-10">
              Insights on full-stack development, architecture patterns, career growth, and lessons learned from the field.
            </p>

            {/* Search */}
            <div className="flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/10 rounded-2xl px-5 py-3 max-w-md">
              <Search size={18} className="text-slate-400" />
              <input
                type="text"
                placeholder="Search articles..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="bg-transparent text-white placeholder:text-slate-400 outline-none flex-1 font-medium"
              />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : filtered?.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✍️</div>
              <h3 className="text-xl font-bold text-slate-700 mb-2">{search ? 'No articles found' : 'No articles yet'}</h3>
              <p className="text-slate-400">{search ? 'Try a different search term.' : 'Check back soon for new content!'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered?.map((post: any, idx: number) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group bg-white border border-slate-100 rounded-[28px] overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Cover Image */}
                  <div className="aspect-[16/9] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                    {post.cover_image ? (
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl font-black text-slate-200">✍️</span>
                      </div>
                    )}
                    {post.tags && (
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {post.tags.split(',').slice(0, 2).map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 bg-white/90 backdrop-blur-sm text-primary text-[10px] font-bold rounded-full">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-slate-400 text-xs font-medium mb-3">
                      <Clock size={12} />
                      <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {post.read_time && <><span>·</span><span>{post.read_time} min read</span></>}
                    </div>
                    <h2 className="font-bold text-xl text-slate-900 group-hover:text-primary transition-colors mb-3 leading-snug line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all">
                      Read Article <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </div>
      </section>
    </main>
  );
}

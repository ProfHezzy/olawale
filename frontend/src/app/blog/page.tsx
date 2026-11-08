'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Navbar from '@/components/Navbar';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, Loader2, Search } from 'lucide-react';
import { useState } from 'react';

interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  cover_image?: string;
  created_at: string;
  updated_at?: string;
  read_time?: number;
  tags?: string;
  likes?: number;
  shares?: number;
}

export default function BlogPage() {
  const [search, setSearch] = useState('');

  const { data: posts, isLoading } = useQuery<BlogPost[]>({
    queryKey: ['blog'],
    queryFn: async () => {
      const res = await api.get('/blog');
      return res.data;
    },
  });

  const filtered = posts?.filter((p) =>
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.excerpt?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <main className="min-h-screen bg-surface-canvas dark:bg-brand-primary-950">
      <Navbar />

      {/* Hero */}
      <section className="pt-32 pb-16 bg-brand-primary-950 text-brand-primary-foreground relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-5" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-brand-primary/20 rounded-full blur-[120px]" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-brand-highlight/10 rounded-full blur-[150px]" />
        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
            <div className="flex-1">
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                <span className="text-brand-primary font-bold text-sm tracking-widest uppercase mb-4 block animate-in">My Thoughts</span>
                <h1 className="text-5xl lg:text-7xl font-extrabold tracking-tighter mb-6 animate-in animate-in-delay-1">
                  The Blog
                </h1>
                <p className="text-xl text-brand-primary-foreground/70 max-w-2xl mb-10 animate-in animate-in-delay-2">
                  Insights on full-stack development, architecture patterns, career growth, and lessons learned from the field.
                </p>

                {/* Search */}
                <div className="flex items-center gap-3 bg-brand-primary/10 backdrop-blur-md border border-brand-primary/20 rounded-2xl px-5 py-3 max-w-md">
                  <Search size={18} className="text-brand-primary/70" />
                  <input
                    type="text"
                    placeholder="Search articles..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="bg-transparent text-brand-primary-foreground placeholder:text-brand-primary-foreground/50 outline-none flex-1 font-medium"
                  />
                </div>
              </motion.div>
            </div>
            <div className="flex-1 hidden lg:block">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
                className="relative w-full max-w-[500px] mx-auto"
              >
                <img
                  src="/illustrations/blog-illustration.svg"
                  alt="Blog articles and insights on full-stack development, AI, and software engineering"
                  className="w-full h-auto object-contain animate-float-slow"
                />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Posts Grid */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-6">
          {isLoading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-brand-primary" size={40} />
            </div>
          ) : filtered?.length === 0 ? (
            <div className="py-20 text-center">
              <div className="w-20 h-20 bg-surface-subtle dark:bg-brand-primary-900/50 rounded-full flex items-center justify-center mx-auto mb-4 text-3xl">✍️</div>
              <h3 className="text-xl font-bold text-text-primary mb-2">{search ? 'No articles found' : 'No articles yet'}</h3>
              <p className="text-text-muted">{search ? 'Try a different search term.' : 'Check back soon for new content!'}</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filtered?.map((post, idx: number) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: idx * 0.05 }}
                  className="group card card-brand overflow-hidden hover:shadow-xl hover:shadow-brand-primary/10 dark:hover:shadow-brand-primary/20 hover:-translate-y-2 transition-all duration-300"
                >
                  {/* Cover Image */}
                  <div className="aspect-[16/9] bg-gradient-to-br from-surface-subtle to-surface-interactive relative overflow-hidden">
                    {post.cover_image ? (
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-5xl font-black text-border-muted dark:text-brand-primary-800">✍️</span>
                      </div>
                    )}
                    {post.tags && (
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        {post.tags.split(',').slice(0, 2).map((tag: string) => (
                          <span key={tag} className="px-2 py-0.5 bg-brand-primary/10 dark:bg-brand-primary-900/30 text-brand-primary text-[10px] font-bold rounded-full border border-brand-primary/20">
                            {tag.trim()}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-text-muted text-xs font-medium mb-3">
                      <Clock size={12} />
                      <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                      {post.read_time && <><span>·</span><span>{post.read_time} min read</span></>}
                    </div>
                    <h2 className="font-bold text-xl text-text-primary group-hover:text-brand-primary transition-colors mb-3 leading-snug line-clamp-2">
                      {post.title}
                    </h2>
                    <p className="text-sm text-text-secondary leading-relaxed mb-5 line-clamp-3">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 text-sm font-bold text-brand-primary hover:gap-3 transition-all">
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

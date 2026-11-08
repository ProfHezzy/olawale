'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { Briefcase, BookOpen, Award, MessageSquare, TrendingUp, ArrowRight, Plus, Loader2, CheckCircle, Clock, Bot, Sparkles, Zap } from 'lucide-react';
import { motion } from 'framer-motion';
import { useState } from 'react';
import toast from 'react-hot-toast';

interface Project {
  id: string;
  title: string;
  description: string;
  slug: string;
  category: string;
  tech_stack: string[];
  featured: boolean;
  github_url?: string;
  live_url?: string;
  image?: string;
}

interface Message {
  id: string;
  name: string;
  subject: string;
  read: boolean;
  created_at: string;
}

export default function AdminDashboard() {
  const { data: statsData } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => api.get('/admin/stats').then(r => r.data),
    refetchInterval: 5000
  });
  const { data: projects } = useQuery({
    queryKey: ['admin-projects'],
    queryFn: () => api.get('/projects').then(r => r.data),
    refetchInterval: 10000
  });
  const { data: messages } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => api.get('/messages').then(r => r.data),
    refetchInterval: 5000
  });

  const stats = [
    { name: 'Total Projects', value: statsData?.projects?.total ?? '—', icon: Briefcase, color: 'text-brand-primary', bg: 'bg-brand-primary/10', href: '/admin/projects', trend: `${statsData?.projects?.likes || 0} likes` },
    { name: 'Blog Engagement', value: statsData?.blogs?.total ?? '—', icon: BookOpen, color: 'text-brand-highlight', bg: 'bg-brand-highlight/10', href: '/admin/blog', trend: `${statsData?.blogs?.likes || 0} total likes` },
    { name: 'Total Comments', value: statsData?.engagement?.totalComments ?? '—', icon: MessageSquare, color: 'text-brand-accent', bg: 'bg-brand-accent/10', href: '/admin/blog', trend: `${statsData?.engagement?.pendingComments || 0} pending` },
    { name: 'Total Shares', value: statsData?.engagement?.totalShares ?? '—', icon: TrendingUp, color: 'text-brand-accent', bg: 'bg-brand-accent/10', href: '/admin/projects', trend: 'Across all platforms' },
  ];

  const quickActions = [
    { label: 'New Project', href: '/admin/projects', icon: Briefcase, color: 'bg-brand-primary hover:bg-brand-primary/90' },
    { label: 'Write Post', href: '/admin/blog', icon: BookOpen, color: 'bg-brand-highlight hover:bg-brand-highlight/90' },
    { label: 'Add Skill', href: '/admin/skills', icon: Award, color: 'bg-brand-accent hover:bg-brand-accent/90' },
    { label: 'Messages', href: '/admin/messages', icon: MessageSquare, color: 'bg-brand-primary/80 hover:bg-brand-primary' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-brand-primary-950 to-brand-primary-900 rounded-2xl p-8 text-brand-primary-foreground relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-brand-primary/20 rounded-full blur-3xl" />
        <div className="absolute top-0 left-0 w-48 h-48 bg-brand-highlight/10 rounded-full blur-3xl" />
        <div className="relative z-10">
          <p className="text-brand-primary-foreground/60 text-sm font-medium mb-1">Good day,</p>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Hezekiah 👋</h2>
          <p className="text-brand-primary-foreground/60">Here&apos;s what&apos;s happening with your portfolio today.</p>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        {stats.map((stat, idx) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.07 }}
            >
              <Link href={stat.href} className="block card card-brand p-6 hover:shadow-xl hover:shadow-brand-primary/10 dark:hover:shadow-brand-primary/20 hover:-translate-y-0.5 transition-all group">
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <Icon size={22} />
                  </div>
                  <ArrowRight size={16} className="text-text-muted group-hover:text-brand-primary group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-3xl font-extrabold text-text-primary mb-1">{stat.value}</h3>
                <p className="text-sm text-text-secondary font-medium">{stat.name}</p>
                <p className="text-xs text-text-muted mt-1">{stat.trend}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 card card-brand overflow-hidden">
          <div className="p-6 border-b border-border-default dark:border-brand-primary-800 flex items-center justify-between">
            <h3 className="font-extrabold text-text-primary">Recent Projects</h3>
            <Link href="/admin/projects" className="text-sm font-bold text-brand-primary hover:text-brand-primary/80 flex items-center gap-1">
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-border-muted dark:divide-brand-primary-800/50">
            {!projects ? (
              <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-text-muted" /></div>
            ) : projects.slice(0, 5).map((project: Project) => (
              <div key={project.id} className="p-4 flex items-center gap-4 hover:bg-surface-subtle dark:hover:bg-brand-primary-800/50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-brand-primary to-brand-highlight flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {project.title[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-text-primary text-sm truncate">{project.title}</p>
                  <p className="text-xs text-text-muted">{project.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  {project.featured && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-brand-accent/10 dark:bg-brand-accent/20 text-brand-accent rounded-full border border-brand-accent/20">
                      Featured
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-brand-primary/10 dark:bg-brand-primary-900/30 text-brand-primary rounded-full border border-brand-primary/20">{project.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions + Activity */}
        <div className="space-y-5">
          {/* AI Blog Autopilot */}
          <AiBlogPanel />

          {/* Quick Actions */}
          <div className="card card-brand overflow-hidden">
            <div className="p-6 border-b border-border-default dark:border-brand-primary-800">
              <h3 className="font-extrabold text-text-primary">Quick Actions</h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} href={action.href}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl text-brand-primary-foreground font-bold text-xs text-center gap-2 transition-all hover:scale-105 ${action.color}`}
                  >
                    <Plus size={16} />
                    <Icon size={18} />
                    {action.label}
                  </Link>
                );
              })}
            </div>
          </div>

          {/* Recent Messages Preview */}
          <div className="card card-brand overflow-hidden">
            <div className="p-6 border-b border-border-default dark:border-brand-primary-800 flex items-center justify-between">
              <h3 className="font-extrabold text-text-primary">Messages</h3>
              <Link href="/admin/messages" className="text-sm font-bold text-brand-primary hover:text-brand-primary/80 flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-border-muted dark:divide-brand-primary-800/50">
              {!messages ? (
                <div className="p-6 flex justify-center"><Loader2 className="animate-spin text-text-muted" size={20} /></div>
              ) : messages.length === 0 ? (
                <div className="p-6 text-center">
                  <CheckCircle size={28} className="text-status-success-icon mx-auto mb-2" />
                  <p className="text-sm text-text-muted font-medium">No messages yet</p>
                </div>
              ) : messages.slice(0, 3).map((msg: Message) => (
                <div key={msg.id} className="p-3 flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${msg.read ? 'bg-text-muted' : 'bg-brand-primary'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-text-primary truncate">{msg.name}</p>
                    <p className="text-xs text-text-muted truncate">{msg.subject}</p>
                    <p className="text-xs text-text-muted/70 flex items-center gap-1 mt-0.5">
                      <Clock size={10} /> {new Date(msg.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function AiBlogPanel() {
  const [lastResult, setLastResult] = useState<string | null>(null);
  const [generating, setGenerating] = useState<string | null>(null);

  const handleGenerate = async (type: string) => {
    setGenerating(type);
    setLastResult(null);
    try {
      const res = await api.post(`/ai-blog/generate?type=${type}`);
      if (res.data.success) {
        toast.success('AI blog post published!');
        setLastResult(`✅ ${res.data.message}`);
      } else {
        toast.error('Generation failed');
        setLastResult(`❌ ${res.data.message}`);
      }
    } catch {
      toast.error('Could not connect to AI service');
      setLastResult('❌ Connection failed. Check your Gemini API key.');
    } finally {
      setGenerating(null);
    }
  };

  const buttons = [
    { type: 'expertise', label: '📝 Article', color: 'bg-brand-primary/20 hover:bg-brand-primary/30' },
    { type: 'news', label: '📰 Tech News', color: 'bg-brand-highlight/20 hover:bg-brand-highlight/30' },
    { type: 'jobs', label: '💼 Job Board', color: 'bg-brand-accent/20 hover:bg-brand-accent/30' },
  ];

  return (
    <div className="bg-gradient-to-br from-brand-primary to-brand-highlight rounded-2xl overflow-hidden text-brand-primary-foreground">
      <div className="p-5">
        <div className="flex items-center gap-2 mb-2">
          <Bot size={18} className="text-brand-primary-foreground/70" />
          <h3 className="font-bold text-sm">AI Blog Autopilot</h3>
        </div>
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-brand-primary-foreground/20 px-2 py-0.5 rounded-full">
            <Zap size={9} /> 8AM
          </span>
          <span className="flex items-center gap-1 text-[10px] font-black uppercase tracking-wider bg-brand-primary-foreground/20 px-2 py-0.5 rounded-full">
            <Zap size={9} /> 2PM
          </span>
          <span className="text-[10px] text-brand-primary-foreground/70">Daily WAT</span>
        </div>
        <p className="text-brand-primary-foreground/70 text-xs leading-relaxed mb-4">
          Gemini AI auto-posts articles, tech news & job listings. Click below to publish one now.
        </p>
        <div className="grid grid-cols-3 gap-2 mb-2">
          {buttons.map((btn) => (
            <button
              key={btn.type}
              onClick={() => handleGenerate(btn.type)}
              disabled={generating !== null}
              className={`flex items-center justify-center gap-1 py-2 text-[11px] font-bold rounded-lg transition-all disabled:opacity-50 ${btn.color}`}
            >
              {generating === btn.type ? (
                <Loader2 size={12} className="animate-spin" />
              ) : (
                btn.label
              )}
            </button>
          ))}
        </div>
        <button
          onClick={() => handleGenerate('expertise')}
          disabled={generating !== null}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-brand-primary-foreground text-brand-primary font-black text-sm rounded-xl hover:bg-brand-primary-foreground/90 transition-all disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {generating ? (
            <><Loader2 size={15} className="animate-spin" /> Generating...</>
          ) : (
            <><Sparkles size={15} /> Quick Generate</>
          )}
        </button>
        {lastResult && (
          <p className="text-[10px] text-brand-primary-foreground/70 mt-2 text-center">{lastResult}</p>
        )}
      </div>
    </div>
  );
}
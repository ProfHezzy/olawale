'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Link from 'next/link';
import { Briefcase, BookOpen, Award, MessageSquare, TrendingUp, ArrowRight, Plus, Loader2, CheckCircle, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AdminDashboard() {
  const { data: projects } = useQuery({ queryKey: ['admin-projects'], queryFn: () => api.get('/projects').then(r => r.data) });
  const { data: posts } = useQuery({ queryKey: ['admin-posts'], queryFn: () => api.get('/blog').then(r => r.data) });
  const { data: skills } = useQuery({ queryKey: ['admin-skills'], queryFn: () => api.get('/skills').then(r => r.data) });
  const { data: messages } = useQuery({ queryKey: ['admin-messages'], queryFn: () => api.get('/messages').then(r => r.data) });

  const unread = messages?.filter((m: any) => !m.read)?.length || 0;

  const stats = [
    { name: 'Total Projects', value: projects?.length ?? '—', icon: Briefcase, color: 'text-blue-600', bg: 'bg-blue-50', href: '/admin/projects', trend: `${projects?.filter((p: any) => p.featured)?.length || 0} featured` },
    { name: 'Blog Posts', value: posts?.length ?? '—', icon: BookOpen, color: 'text-purple-600', bg: 'bg-purple-50', href: '/admin/blog', trend: `${posts?.filter((p: any) => p.published)?.length || 0} published` },
    { name: 'Skills', value: skills?.length ?? '—', icon: Award, color: 'text-emerald-600', bg: 'bg-emerald-50', href: '/admin/skills', trend: 'Across categories' },
    { name: 'Unread Messages', value: unread, icon: MessageSquare, color: 'text-orange-600', bg: 'bg-orange-50', href: '/admin/messages', trend: `${messages?.length || 0} total` },
  ];

  const quickActions = [
    { label: 'New Project', href: '/admin/projects', icon: Briefcase, color: 'bg-blue-500 hover:bg-blue-600' },
    { label: 'Write Post', href: '/admin/blog', icon: BookOpen, color: 'bg-purple-500 hover:bg-purple-600' },
    { label: 'Add Skill', href: '/admin/skills', icon: Award, color: 'bg-emerald-500 hover:bg-emerald-600' },
    { label: 'Messages', href: '/admin/messages', icon: MessageSquare, color: 'bg-orange-500 hover:bg-orange-600' },
  ];

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-slate-900 to-slate-800 rounded-2xl p-8 text-white relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-primary/20 rounded-full blur-3xl" />
        <div className="relative z-10">
          <p className="text-slate-400 text-sm font-medium mb-1">Good day,</p>
          <h2 className="text-3xl font-extrabold tracking-tight mb-2">Hezekiah 👋</h2>
          <p className="text-slate-400">Here&apos;s what&apos;s happening with your portfolio today.</p>
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
              <Link href={stat.href} className="block bg-white p-6 rounded-2xl border border-slate-100 hover:shadow-lg hover:shadow-slate-200/60 hover:-translate-y-0.5 transition-all group">
                <div className="flex items-center justify-between mb-5">
                  <div className={`p-3 rounded-xl ${stat.bg} ${stat.color}`}>
                    <Icon size={22} />
                  </div>
                  <ArrowRight size={16} className="text-slate-300 group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-900 mb-1">{stat.value}</h3>
                <p className="text-sm text-slate-500 font-medium">{stat.name}</p>
                <p className="text-xs text-slate-400 mt-1">{stat.trend}</p>
              </Link>
            </motion.div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Projects */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-100 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
            <h3 className="font-bold text-slate-900">Recent Projects</h3>
            <Link href="/admin/projects" className="text-sm font-bold text-primary hover:text-blue-700 flex items-center gap-1">
              Manage <ArrowRight size={14} />
            </Link>
          </div>
          <div className="divide-y divide-slate-50">
            {!projects ? (
              <div className="p-8 flex justify-center"><Loader2 className="animate-spin text-slate-300" /></div>
            ) : projects.slice(0, 5).map((project: any) => (
              <div key={project.id} className="px-6 py-4 flex items-center gap-4 hover:bg-slate-50 transition-colors">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-primary flex items-center justify-center text-white font-bold text-sm shrink-0">
                  {project.title[0]}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-900 text-sm truncate">{project.title}</p>
                  <p className="text-xs text-slate-400">{project.category}</p>
                </div>
                <div className="flex items-center gap-2">
                  {project.featured && (
                    <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 bg-yellow-50 text-yellow-600 rounded-full border border-yellow-100">
                      Featured
                    </span>
                  )}
                  <span className="text-[10px] font-bold px-2 py-0.5 bg-blue-50 text-blue-600 rounded-full">{project.category}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions + Activity */}
        <div className="space-y-5">
          {/* Quick Actions */}
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100">
              <h3 className="font-bold text-slate-900">Quick Actions</h3>
            </div>
            <div className="p-4 grid grid-cols-2 gap-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link key={action.label} href={action.href}
                    className={`flex flex-col items-center justify-center p-4 rounded-xl text-white font-bold text-xs text-center gap-2 transition-all hover:scale-105 ${action.color}`}
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
          <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
              <h3 className="font-bold text-slate-900">Messages</h3>
              <Link href="/admin/messages" className="text-sm font-bold text-primary hover:text-blue-700 flex items-center gap-1">
                View All <ArrowRight size={14} />
              </Link>
            </div>
            <div className="divide-y divide-slate-50">
              {!messages ? (
                <div className="p-6 flex justify-center"><Loader2 className="animate-spin text-slate-300" size={20} /></div>
              ) : messages.length === 0 ? (
                <div className="p-6 text-center">
                  <CheckCircle size={28} className="text-emerald-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400 font-medium">No messages yet</p>
                </div>
              ) : messages.slice(0, 3).map((msg: any) => (
                <div key={msg.id} className="px-6 py-3 flex items-start gap-3">
                  <div className={`w-2 h-2 rounded-full mt-2 shrink-0 ${msg.read ? 'bg-slate-200' : 'bg-primary'}`} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-slate-900 truncate">{msg.name}</p>
                    <p className="text-xs text-slate-400 truncate">{msg.subject}</p>
                    <p className="text-xs text-slate-300 flex items-center gap-1 mt-0.5">
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

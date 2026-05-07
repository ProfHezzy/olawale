'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useState } from 'react';
import { Trash2, Loader2, Search, CheckCircle, Mail, Calendar, User, AlignLeft } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

type Message = {
  id: string; name: string; email: string; subject: string; message: string; read: boolean; created_at: string;
};

export default function AdminMessagesPage() {
  const queryClient = useQueryClient();
  const [search, setSearch] = useState('');
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  const { data: messages, isLoading } = useQuery({
    queryKey: ['admin-messages'],
    queryFn: () => api.get('/messages').then(r => r.data),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/messages/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-messages'] });
      toast.success('Message deleted');
      setSelectedMessage(null);
    },
    onError: () => toast.error('Failed to delete'),
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/messages/${id}`, { read: true }),
    onSuccess: () => { queryClient.invalidateQueries({ queryKey: ['admin-messages'] }); },
  });

  const filtered = (messages?.filter((m: Message) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.subject.toLowerCase().includes(search.toLowerCase()) ||
    m.email.toLowerCase().includes(search.toLowerCase())
  ) || []).sort((a: Message, b: Message) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());

  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedData = filtered.slice((currentPage - 1) * ITEMS_PER_PAGE, currentPage * ITEMS_PER_PAGE);

  const handleSearch = (val: string) => {
    setSearch(val);
    setCurrentPage(1);
  };

  const handleSelectMessage = (msg: Message) => {
    setSelectedMessage(msg);
    if (!msg.read) {
      markReadMutation.mutate(msg.id);
    }
  };

  return (
    <div className="max-w-7xl mx-auto h-[calc(100vh-8rem)] flex flex-col space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 shrink-0">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Messages</h1>
          <p className="text-slate-500 text-sm">
            {messages?.filter((m: Message) => !m.read).length || 0} unread messages
          </p>
        </div>
        <div className="relative w-full sm:w-72">
          <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input placeholder="Search messages..." value={search} onChange={e => handleSearch(e.target.value)}
            className="w-full pl-11 pr-4 py-2.5 bg-white border border-slate-200 rounded-xl text-sm focus:border-orange-500 focus:ring-2 focus:ring-orange-500/20 outline-none transition-all"
          />
        </div>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 flex-1 flex overflow-hidden min-h-0 shadow-sm">
        {isLoading ? (
          <div className="flex items-center justify-center w-full"><Loader2 className="animate-spin text-slate-300" size={32} /></div>
        ) : (
          <>
            {/* List Sidebar */}
            <div className="w-full md:w-1/3 border-r border-slate-100 flex flex-col h-full bg-slate-50/30">
              <div className="overflow-y-auto flex-1 divide-y divide-slate-100">
                {filtered?.length === 0 ? (
                  <div className="p-8 text-center text-slate-400">
                    <CheckCircle size={32} className="mx-auto mb-3 text-slate-200" />
                    <p className="font-medium">All caught up!</p>
                  </div>
                ) : (
                  paginatedData.map((msg: Message) => (
                    <button
                      key={msg.id}
                      onClick={() => handleSelectMessage(msg)}
                      className={`w-full text-left p-5 transition-colors border-l-4 ${
                        selectedMessage?.id === msg.id
                          ? 'bg-orange-50 border-orange-500'
                          : msg.read
                            ? 'bg-transparent border-transparent hover:bg-slate-50'
                            : 'bg-white border-primary hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <p className={`font-bold text-sm truncate ${msg.read ? 'text-slate-700' : 'text-slate-900'}`}>{msg.name}</p>
                        <p className="text-[10px] font-bold text-slate-400 shrink-0 uppercase tracking-wider">
                          {new Date(msg.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                        </p>
                      </div>
                      <p className={`text-xs truncate mb-1 ${msg.read ? 'text-slate-500' : 'text-slate-700 font-semibold'}`}>{msg.subject}</p>
                      <p className="text-xs text-slate-400 line-clamp-2 leading-relaxed">{msg.message}</p>
                    </button>
                  ))
                )}
              </div>

              {/* Pagination Controls */}
              {totalPages > 1 && (
                <div className="px-4 py-3 bg-white border-t border-slate-100 flex items-center justify-between shrink-0">
                  <div className="flex gap-2 w-full">
                    <button
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(prev => prev - 1)}
                      className="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                    >
                      Prev
                    </button>
                    <div className="flex items-center px-2 text-[10px] font-black text-slate-400 uppercase tracking-tighter">
                      {currentPage}/{totalPages}
                    </div>
                    <button
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(prev => prev + 1)}
                      className="flex-1 py-2 border border-slate-200 rounded-lg text-xs font-bold text-slate-600 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-50 transition-colors"
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Detail View */}
            <div className="hidden md:flex flex-1 flex-col h-full bg-white relative">
              <AnimatePresence mode="wait">
                {selectedMessage ? (
                  <motion.div
                    key={selectedMessage.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="flex flex-col h-full"
                  >
                    {/* Header */}
                    <div className="p-8 border-b border-slate-100 shrink-0">
                      <div className="flex items-start justify-between gap-4 mb-6">
                        <h2 className="text-2xl font-extrabold text-slate-900 leading-tight">{selectedMessage.subject}</h2>
                        <button
                          onClick={() => { if (window.confirm('Delete this message?')) deleteMutation.mutate(selectedMessage.id); }}
                          className="p-2.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-xl transition-colors shrink-0"
                          title="Delete Message"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-full bg-orange-100 flex items-center justify-center text-orange-600 font-bold text-lg shrink-0">
                          {selectedMessage.name[0]}
                        </div>
                        <div className="space-y-1">
                          <p className="font-bold text-slate-900 text-sm flex items-center gap-2">
                            <User size={14} className="text-slate-400" /> {selectedMessage.name}
                          </p>
                          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500 font-medium">
                            <span className="flex items-center gap-1.5"><Mail size={12} className="text-slate-400" /> {selectedMessage.email}</span>
                            <span className="flex items-center gap-1.5"><Calendar size={12} className="text-slate-400" /> {new Date(selectedMessage.created_at).toLocaleString()}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Body */}
                    <div className="flex-1 overflow-y-auto p-8">
                      <div className="flex items-center gap-2 mb-6">
                        <AlignLeft size={16} className="text-slate-300" />
                        <span className="text-xs font-bold uppercase tracking-widest text-slate-400">Message Content</span>
                      </div>
                      <div className="prose prose-sm prose-slate max-w-none">
                        {selectedMessage.message.split('\n').map((paragraph, i) => (
                          <p key={i} className="text-slate-600 text-[15px] leading-relaxed mb-4">{paragraph}</p>
                        ))}
                      </div>
                    </div>
                    
                    {/* Action Footer */}
                    <div className="p-6 border-t border-slate-100 bg-slate-50 shrink-0">
                       <a href={`mailto:${selectedMessage.email}?subject=Re: ${selectedMessage.subject}`} className="btn-primary w-fit flex items-center gap-2 bg-orange-500 hover:bg-orange-600">
                         <Mail size={16} /> Reply via Email
                       </a>
                    </div>
                  </motion.div>
                ) : (
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
                    <Mail size={48} className="text-slate-200 mb-4" />
                    <p className="font-medium text-lg text-slate-500 mb-1">Select a message</p>
                    <p className="text-sm">Choose a message from the list to read it here.</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

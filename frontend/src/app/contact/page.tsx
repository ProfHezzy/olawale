'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, User, Send, MessageCircle, Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import toast from 'react-hot-toast';

const contactSchema = z.object({
  name: z.string().min(2, 'Name is required'),
  email: z.string().email('Invalid email address'),
  subject: z.string().min(5, 'Subject must be at least 5 characters'),
  budget_range: z.string().optional(),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

export default function ContactPage() {
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(contactSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      await api.post('/messages', data);
      toast.success('Message sent! I will get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      
      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Left Side: Info */}
          <div>
            <span className="text-primary font-bold text-sm tracking-widest uppercase mb-4 block">Get in Touch</span>
            <h1 className="text-5xl lg:text-6xl font-bold text-slate-900 mb-8 tracking-tighter">
              Let&apos;s build something <span className="text-primary">great</span> together.
            </h1>
            <p className="text-xl text-slate-600 mb-12 leading-relaxed">
              Have a project in mind? Or just want to say hi? Feel free to reach out. I&apos;m always open to new opportunities and interesting conversations.
            </p>

            <div className="space-y-8">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Email Me</p>
                  <p className="text-lg font-bold text-slate-900">hello@hezekiah.dev</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-400 uppercase tracking-widest">Social Presence</p>
                  <p className="text-lg font-bold text-slate-900">LinkedIn • GitHub • X</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side: Form */}
          <div className="bg-white p-8 lg:p-12 rounded-[32px] shadow-xl shadow-blue-500/5 border border-slate-100">
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Full Name</label>
                  <input 
                    {...register('name')}
                    placeholder="John Doe"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 font-medium"
                  />
                  {errors.name && <p className="text-xs text-red-500 font-medium">{errors.name.message as string}</p>}
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-700">Email Address</label>
                  <input 
                    {...register('email')}
                    placeholder="john@example.com"
                    className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 font-medium"
                  />
                  {errors.email && <p className="text-xs text-red-500 font-medium">{errors.email.message as string}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Subject</label>
                <input 
                  {...register('subject')}
                  placeholder="How can I help you?"
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 font-medium"
                />
                {errors.subject && <p className="text-xs text-red-500 font-medium">{errors.subject.message as string}</p>}
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Budget Range (Optional)</label>
                <select 
                  {...register('budget_range')}
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 font-medium appearance-none"
                >
                  <option value="">Select a range</option>
                  <option value="<$5k">&lt; $5,000</option>
                  <option value="$5k-$10k">$5,000 - $10,000</option>
                  <option value="$10k+">$10,000+</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-700">Message</label>
                <textarea 
                  {...register('message')}
                  rows={5}
                  placeholder="Tell me about your project..."
                  className="w-full px-5 py-4 rounded-2xl bg-slate-50 border-none focus:ring-2 focus:ring-primary/20 outline-none transition-all text-slate-900 font-medium resize-none"
                />
                {errors.message && <p className="text-xs text-red-500 font-medium">{errors.message.message as string}</p>}
              </div>

              <button 
                type="submit" 
                disabled={isSubmitting}
                className="btn-primary w-full py-5 flex items-center justify-center gap-3 text-lg"
              >
                {isSubmitting ? <Loader2 className="animate-spin" /> : <Send size={20} />}
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>
    </main>
  );
}

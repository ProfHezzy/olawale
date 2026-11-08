'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Mail, Send, MessageCircle, Loader2, MapPin, GitBranch, Link2, X } from 'lucide-react';
import Navbar from '@/components/Navbar';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';

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

  type ContactFormData = z.infer<typeof contactSchema>;

  const onSubmit = async (data: ContactFormData) => {
    try {
      await api.post('/messages', data);
      toast.success('Message sent! I will get back to you soon.');
      reset();
    } catch (error) {
      toast.error('Failed to send message. Please try again.');
    }
  };

  return (
    <main className="min-h-screen bg-surface-canvas dark:bg-brand-primary-950">
      <Navbar />

      <div className="max-w-7xl mx-auto px-6 pt-32 pb-24">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-brand-primary/5 rounded-full blur-[200px] pointer-events-none" />
        <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-brand-accent/5 rounded-full blur-[150px] pointer-events-none translate-x-1/2 translate-y-1/2" />

        <div className="relative grid grid-cols-1 lg:grid-cols-2 gap-16 items-start">
          {/* Custom Illustration on larger screens */}
          <div className="hidden lg:block lg:col-span-1 relative w-full max-w-[500px] mx-auto">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: [0.25, 1, 0.5, 1] }}
            >
              <img
                src="/illustrations/contact-illustration.svg"
                alt="Get in touch - let's build something extraordinary together"
                className="w-full h-auto object-contain animate-float-slow"
              />
            </motion.div>
          </div>

          {/* Form Side */}
          <div className="relative z-10 lg:col-span-1">
            <span className="text-brand-primary font-bold text-sm tracking-widest uppercase mb-4 block animate-in">Get in Touch</span>
            <h1 className="text-5xl lg:text-6xl font-extrabold text-text-primary mb-8 tracking-tighter animate-in animate-in-delay-1">
              Let&apos;s build something <span className="gradient-text">extraordinary</span> together.
            </h1>
            <p className="text-xl text-text-secondary mb-12 leading-relaxed animate-in animate-in-delay-2">
              Have a project in mind? Or just want to say hi? Feel free to reach out. I&apos;m always open to new opportunities and interesting conversations.
            </p>

            <div className="space-y-8 mb-12">
              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-surface-card dark:bg-brand-primary-900 shadow-sm flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-brand-primary-foreground transition-all duration-300 border border-border-default dark:border-brand-primary-800">
                  <Mail size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-muted uppercase tracking-widest">Email Me</p>
                  <p className="text-lg font-extrabold text-text-primary">hello@hezekiah.dev</p>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-surface-card dark:bg-brand-primary-900 shadow-sm flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-brand-primary-foreground transition-all duration-300 border border-border-default dark:border-brand-primary-800">
                  <MessageCircle size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-muted uppercase tracking-widest">Social Presence</p>
                  <div className="flex items-center gap-4 mt-1">
                    <a href="https://linkedin.com/in/hezekiahojenike" target="_blank" rel="noreferrer" className="p-2 text-text-secondary hover:text-brand-primary transition-colors bg-surface-card dark:bg-brand-primary-900 rounded-xl hover:border-brand-primary/30 border border-border-muted dark:border-brand-primary-800">
                      <Link2 size={20} />
                    </a>
                    <a href="https://github.com/ProfHezzy" target="_blank" rel="noreferrer" className="p-2 text-text-secondary hover:text-brand-primary transition-colors bg-surface-card dark:bg-brand-primary-900 rounded-xl hover:border-brand-primary/30 border border-border-muted dark:border-brand-primary-800">
                      <GitBranch size={20} />
                    </a>
                    <a href="https://twitter.com/hezekiah_dev" target="_blank" rel="noreferrer" className="p-2 text-text-secondary hover:text-brand-primary transition-colors bg-surface-card dark:bg-brand-primary-900 rounded-xl hover:border-brand-primary/30 border border-border-muted dark:border-brand-primary-800">
                      <X size={20} />
                    </a>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-6 group">
                <div className="w-14 h-14 rounded-2xl bg-surface-card dark:bg-brand-primary-900 shadow-sm flex items-center justify-center text-brand-primary group-hover:bg-brand-primary group-hover:text-brand-primary-foreground transition-all duration-300 border border-border-default dark:border-brand-primary-800">
                  <MapPin size={24} />
                </div>
                <div>
                  <p className="text-sm font-bold text-text-muted uppercase tracking-widest">Location</p>
                  <p className="text-lg font-extrabold text-text-primary">Ibarapa North, Oyo State, NG</p>
                </div>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="card card-brand p-8 lg:p-12">
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-bold text-text-secondary">Full Name</label>
                    <input
                      id="name"
                      {...register('name')}
                      placeholder="John Doe"
                      className="w-full px-5 py-4 rounded-2xl bg-surface-subtle dark:bg-brand-primary-900/50 border border-border-muted dark:border-brand-primary-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-text-primary font-medium placeholder-text-muted"
                    />
                    {errors.name && <p className="text-xs text-status-error-text font-medium">{errors.name.message as string}</p>}
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-bold text-text-secondary">Email Address</label>
                    <input
                      id="email"
                      {...register('email')}
                      placeholder="john@example.com"
                      className="w-full px-5 py-4 rounded-2xl bg-surface-subtle dark:bg-brand-primary-900/50 border border-border-muted dark:border-brand-primary-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-text-primary font-medium placeholder-text-muted"
                    />
                    {errors.email && <p className="text-xs text-status-error-text font-medium">{errors.email.message as string}</p>}
                  </div>
                </div>

                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-bold text-text-secondary">Subject</label>
                  <input
                    id="subject"
                    {...register('subject')}
                    placeholder="How can I help you?"
                    className="w-full px-5 py-4 rounded-2xl bg-surface-subtle dark:bg-brand-primary-900/50 border border-border-muted dark:border-brand-primary-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-text-primary font-medium placeholder-text-muted"
                  />
                  {errors.subject && <p className="text-xs text-status-error-text font-medium">{errors.subject.message as string}</p>}
                </div>

                <div className="space-y-2">
                  <label htmlFor="budget_range" className="text-sm font-bold text-text-secondary">Budget Range (Optional)</label>
                  <select
                    id="budget_range"
                    {...register('budget_range')}
                    className="w-full px-5 py-4 rounded-2xl bg-surface-subtle dark:bg-brand-primary-900/50 border border-border-muted dark:border-brand-primary-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-text-primary font-medium appearance-none"
                  >
                    <option value="">Select a range</option>
                    <option value="lt-5000">Under $5,000</option>
                    <option value="5k-10k">$5,000 - $10,000</option>
                    <option value="10k-plus">$10,000+</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-bold text-text-secondary">Message</label>
                  <textarea
                    id="message"
                    {...register('message')}
                    rows={5}
                    placeholder="Tell me about your project..."
                    className="w-full px-5 py-4 rounded-2xl bg-surface-subtle dark:bg-brand-primary-900/50 border border-border-muted dark:border-brand-primary-800 focus:ring-2 focus:ring-brand-primary/20 focus:border-brand-primary outline-none transition-all text-text-primary font-medium placeholder-text-muted resize-none"
                  />
                  {errors.message && <p className="text-xs text-status-error-text font-medium">{errors.message.message as string}</p>}
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
      </div>
    </main>
  );
}
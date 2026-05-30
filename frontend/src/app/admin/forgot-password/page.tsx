'use client';

import { useState } from 'react';
import api from '@/lib/api';
import Link from 'next/link';
import { ArrowLeft, Mail, Loader2, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/auth/forgot-password', {});
      setSent(true);
      toast.success('Reset link sent to your email!');
    } catch (error) {
      toast.error('Could not send reset link. Please check the email.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-md w-full bg-white rounded-[32px] shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100"
      >
        <Link href="/admin/login" className="inline-flex items-center gap-2 text-slate-400 hover:text-primary transition-colors text-sm font-bold mb-8">
          <ArrowLeft size={16} /> Back to Login
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Forgot Password?</h1>
          <p className="text-slate-500 font-medium leading-relaxed">
            {sent 
              ? "We've sent a recovery link to your email address." 
              : "Enter your email and we'll send you a link to reset your password."}
          </p>
        </div>

        {sent ? (
          <div className="text-center py-8">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle size={40} className="text-emerald-500" />
            </div>
            <p className="text-slate-600 font-bold mb-8">Check your inbox for instructions.</p>
            <Link href="/admin/login" className="btn-primary w-full">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <p className="text-slate-600 text-sm font-medium bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100">
              For security, the password reset link will only be sent to the administrator email address on file.
            </p>

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full py-4 text-lg shadow-lg shadow-blue-500/20 disabled:opacity-70 flex items-center justify-center gap-2"
            >
              {loading ? <Loader2 className="animate-spin" size={24} /> : <Mail size={20} />}
              {loading ? "Sending..." : "Send Reset Link to My Email"}
            </button>
          </form>
        )}
      </motion.div>
    </main>
  );
}

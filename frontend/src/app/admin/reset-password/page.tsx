'use client';

import { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import api from '@/lib/api';
import Link from 'next/link';
import { Lock, Loader2, CheckCircle, Eye, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';

function ResetPasswordForm() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token');

  const [newPass, setNewPass] = useState('');
  const [confirmPass, setConfirmPass] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [showPass, setShowPass] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPass !== confirmPass) {
      return toast.error('Passwords do not match');
    }
    if (newPass.length < 6) {
      return toast.error('Password must be at least 6 characters');
    }

    setLoading(true);
    try {
      await api.post('/auth/reset-password', { token, newPass });
      setSuccess(true);
      toast.success('Password updated successfully!');
      setTimeout(() => router.push('/admin/login'), 3000);
    } catch (error) {
      toast.error('Invalid or expired reset token');
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="text-center py-8">
        <p className="text-red-500 font-bold mb-6">Invalid Reset Link</p>
        <Link href="/admin/forgot-password" size={24} className="btn-primary w-full">Request New Link</Link>
      </div>
    );
  }

  return (
    <div className="max-w-md w-full bg-white rounded-[32px] shadow-xl shadow-slate-200/50 p-8 md:p-10 border border-slate-100">
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-900 tracking-tight mb-2">Set New Password</h1>
        <p className="text-slate-500 font-medium leading-relaxed">
          Create a strong password to secure your admin account.
        </p>
      </div>

      {success ? (
        <div className="text-center py-8">
          <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={40} className="text-emerald-500" />
          </div>
          <p className="text-slate-600 font-bold mb-4">Password reset successful!</p>
          <p className="text-sm text-slate-400">Redirecting to login...</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showPass ? "text" : "password"}
                required
                placeholder="••••••••"
                className="admin-input pl-12"
                value={newPass}
                onChange={(e) => setNewPass(e.target.value)}
              />
              <button 
                type="button" 
                onClick={() => setShowPass(!showPass)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
              >
                {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-bold text-slate-700 ml-1">Confirm New Password</label>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type={showPass ? "text" : "password"}
                required
                placeholder="••••••••"
                className="admin-input pl-12"
                value={confirmPass}
                onChange={(e) => setConfirmPass(e.target.value)}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 text-lg shadow-lg shadow-blue-500/20 disabled:opacity-70"
          >
            {loading ? <Loader2 className="animate-spin mx-auto" size={24} /> : "Update Password"}
          </button>
        </form>
      )}
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="min-h-screen bg-slate-50 flex items-center justify-center p-6">
      <Suspense fallback={<Loader2 className="animate-spin text-primary" />}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}

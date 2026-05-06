'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import api from '@/lib/api';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { Loader2, Lock, User, Eye, EyeOff } from 'lucide-react';
import toast from 'react-hot-toast';

const loginSchema = z.object({
  username: z.string().min(1, 'Username is required'),
  password: z.string().min(1, 'Password is required'),
});

export default function AdminLoginPage() {
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: any) => {
    try {
      const res = await api.post('/auth/login', data);
      localStorage.setItem('auth_token', res.data.access_token);
      toast.success('Welcome back, Admin!');
      router.push('/admin');
    } catch (err: any) {
      toast.error(err.response?.data?.message || 'Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
      {/* Background */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/10 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-primary rounded-2xl mb-4 shadow-xl shadow-blue-500/30">
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-3xl font-extrabold text-white tracking-tighter">Admin Portal</h1>
          <p className="text-slate-500 mt-1 font-medium">Sign in to manage your portfolio</p>
        </div>

        {/* Card */}
        <div className="bg-slate-900 border border-white/10 rounded-3xl p-8 shadow-2xl">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Username</label>
              <div className="relative">
                <User size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  {...register('username')}
                  placeholder="admin"
                  className="w-full pl-11 pr-4 py-3.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                />
              </div>
              {errors.username && <p className="text-xs text-red-400 font-medium">{errors.username.message as string}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-bold text-slate-400 uppercase tracking-wider">Password</label>
              <div className="relative">
                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  {...register('password')}
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-slate-800 border border-white/10 rounded-xl text-white placeholder:text-slate-600 focus:border-primary focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
              {errors.password && <p className="text-xs text-red-400 font-medium">{errors.password.message as string}</p>}
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-all active:scale-95 flex items-center justify-center gap-2 mt-2 shadow-lg shadow-blue-500/30"
            >
              {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Lock size={20} />}
              Sign In
            </button>
          </form>

          <p className="text-center text-xs text-slate-600 mt-6 font-medium">
            Default: <span className="text-slate-400 font-mono">admin</span> / <span className="text-slate-400 font-mono">admin123</span>
          </p>
        </div>
      </div>
    </div>
  );
}

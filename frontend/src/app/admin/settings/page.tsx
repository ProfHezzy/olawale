'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import { useForm } from 'react-hook-form';
import { User, Save, Loader2, Link as LinkIcon, Image as ImageIcon, Briefcase, FileText, Upload } from 'lucide-react';
import toast from 'react-hot-toast';
import { useEffect, useRef, useState } from 'react';

export default function AdminSettingsPage() {
  const queryClient = useQueryClient();
  const avatarInputRef = useRef<HTMLInputElement>(null);
  const aboutImageInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [isUploadingAboutImage, setIsUploadingAboutImage] = useState(false);

  const { data: profile, isLoading } = useQuery({
    queryKey: ['admin-profile'],
    queryFn: () => api.get('/profile').then((r) => r.data),
  });

  const { register, handleSubmit, formState: { isSubmitting }, reset, setValue, watch } = useForm();
  
  const currentAvatarUrl = watch('avatar_url');
  const currentAboutImageUrl = watch('about_image_url');

  useEffect(() => {
    if (profile) {
      reset({
        full_name: profile.full_name,
        bio: profile.bio,
        about_me: profile.about_me,
        avatar_url: profile.avatar_url,
        about_image_url: profile.about_image_url,
        email: profile.email,
        location: profile.location,
        phone: profile.phone,
        github_url: profile.github_url,
        linkedin_url: profile.linkedin_url,
        twitter_url: profile.twitter_url,
        resume_url: profile.resume_url,
        years_experience: profile.years_experience,
        projects_completed: profile.projects_completed,
        students_taught: profile.students_taught,
      });
    }
  }, [profile, reset]);

  const updateMutation = useMutation({
    mutationFn: (data: any) => api.patch('/profile', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-profile'] });
      toast.success('Profile updated successfully!');
    },
    onError: () => toast.error('Failed to update profile'),
  });

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>, fieldName: 'avatar_url' | 'about_image_url') => {
    const file = event.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);

    const isAvatar = fieldName === 'avatar_url';

    try {
      if (isAvatar) setIsUploadingAvatar(true);
      else setIsUploadingAboutImage(true);

      const res = await api.post('/upload', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      const fullUrl = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001'}${res.data.url}`;
      setValue(fieldName, fullUrl, { shouldDirty: true, shouldValidate: true });
      toast.success('Image uploaded!');
    } catch (error) {
      toast.error('Failed to upload image');
      console.error(error);
    } finally {
      if (isAvatar) {
        setIsUploadingAvatar(false);
        if (avatarInputRef.current) avatarInputRef.current.value = '';
      } else {
        setIsUploadingAboutImage(false);
        if (aboutImageInputRef.current) aboutImageInputRef.current.value = '';
      }
    }
  };

  const onSubmit = (data: any) => {
    updateMutation.mutate(data);
  };

  if (isLoading) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-primary" size={40} /></div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Profile Settings</h1>
        <p className="text-slate-500 text-sm">Manage your personal information, bio, and social links displayed on your portfolio.</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-100 overflow-hidden shadow-sm">
        <form onSubmit={handleSubmit(onSubmit)} className="divide-y divide-slate-100">
          
          {/* General Info */}
          <div className="p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><User size={20} className="text-primary"/> Personal Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Full Name</label>
                <input {...register('full_name')} className="admin-input" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Short Bio (Hero)</label>
                <input {...register('bio')} className="admin-input" placeholder="e.g. Full-Stack Developer" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Profile Image URL (Avatar)</label>
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                    {isUploadingAvatar ? (
                      <Loader2 className="animate-spin text-slate-400" size={24} />
                    ) : currentAvatarUrl ? (
                      <img src={currentAvatarUrl} alt="Avatar Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={24} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row gap-3">
                    <input {...register('avatar_url')} className="admin-input flex-1" placeholder="https://... or upload below" />
                    <button 
                      type="button" 
                      onClick={() => avatarInputRef.current?.click()}
                      disabled={isUploadingAvatar}
                      className="btn-ghost py-3 px-4 shrink-0 gap-2 flex items-center justify-center text-sm"
                    >
                      <Upload size={16} /> Upload Image
                    </button>
                    <input 
                      type="file" 
                      ref={avatarInputRef} 
                      onChange={(e) => handleFileUpload(e, 'avatar_url')} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">About Section Image URL</label>
                <div className="flex gap-4 items-center">
                  <div className="w-16 h-16 rounded-xl bg-slate-100 flex items-center justify-center overflow-hidden shrink-0 border border-slate-200">
                    {isUploadingAboutImage ? (
                      <Loader2 className="animate-spin text-slate-400" size={24} />
                    ) : currentAboutImageUrl ? (
                      <img src={currentAboutImageUrl} alt="About Image Preview" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon size={24} className="text-slate-400" />
                    )}
                  </div>
                  <div className="flex-1 flex flex-col sm:flex-row gap-3">
                    <input {...register('about_image_url')} className="admin-input flex-1" placeholder="https://... or upload below" />
                    <button 
                      type="button" 
                      onClick={() => aboutImageInputRef.current?.click()}
                      disabled={isUploadingAboutImage}
                      className="btn-ghost py-3 px-4 shrink-0 gap-2 flex items-center justify-center text-sm"
                    >
                      <Upload size={16} /> Upload Image
                    </button>
                    <input 
                      type="file" 
                      ref={aboutImageInputRef} 
                      onChange={(e) => handleFileUpload(e, 'about_image_url')} 
                      accept="image/*" 
                      className="hidden" 
                    />
                  </div>
                </div>
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">About Me</label>
              <textarea {...register('about_me')} rows={5} className="admin-input resize-y leading-relaxed" />
            </div>
          </div>

          {/* Contact & Location */}
          <div className="p-8 space-y-6">
             <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><FileText size={20} className="text-primary"/> Contact Details</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Email Address</label>
                <input {...register('email')} type="email" className="admin-input" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Phone Number</label>
                <input {...register('phone')} className="admin-input" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Location</label>
                <input {...register('location')} className="admin-input" placeholder="e.g. Lagos, Nigeria" />
              </div>
            </div>
          </div>

          {/* Social Links */}
          <div className="p-8 space-y-6">
            <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><LinkIcon size={20} className="text-primary"/> Social & External Links</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">GitHub URL</label>
                <input {...register('github_url')} className="admin-input" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">LinkedIn URL</label>
                <input {...register('linkedin_url')} className="admin-input" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Twitter / X URL</label>
                <input {...register('twitter_url')} className="admin-input" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Resume / CV URL</label>
                <input {...register('resume_url')} className="admin-input" placeholder="Link to PDF" />
              </div>
            </div>
          </div>

          {/* Stats */}
          <div className="p-8 space-y-6">
             <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2"><Briefcase size={20} className="text-primary"/> Highlight Stats</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Years Exp.</label>
                <input {...register('years_experience')} className="admin-input" placeholder="e.g. 5+" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Projects</label>
                <input {...register('projects_completed')} className="admin-input" placeholder="e.g. 40+" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Students/Clients</label>
                <input {...register('students_taught')} className="admin-input" placeholder="e.g. 100+" />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="p-8 bg-slate-50 flex justify-end">
            <button 
              type="submit" 
              disabled={isSubmitting || updateMutation.isPending}
              className="flex items-center gap-2 px-8 py-3.5 bg-primary text-white font-bold rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20"
            >
              {isSubmitting || updateMutation.isPending ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
              Save Profile Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

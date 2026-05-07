'use client';

import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';
import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import SkillsBento from "@/components/SkillsBento";
import AcademicsSection from "@/components/AcademicsSection";
import CertificationsSection from "@/components/CertificationsSection";
import ExperienceSection from "@/components/ExperienceSection";
import Footer from "@/components/Footer";
import { ArrowRight, ExternalLink, Loader2, Clock, BookOpen } from "lucide-react";
import Link from 'next/link';
import { motion } from 'framer-motion';

const GithubIcon = ({ size = 20 }: { size?: number }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export default function Home() {
  const { data: featuredProjects, isLoading: loadingProjects } = useQuery({
    queryKey: ['projects', 'featured'],
    queryFn: async () => {
      const res = await api.get('/projects/featured');
      return res.data;
    },
  });

  const { data: latestPosts, isLoading: loadingPosts } = useQuery({
    queryKey: ['blog', 'latest'],
    queryFn: async () => {
      const res = await api.get('/blog');
      return res.data?.slice(0, 3);
    },
  });

  const { data: profile } = useQuery({
    queryKey: ['profile'],
    queryFn: async () => {
      const res = await api.get('/profile');
      return res.data;
    },
  });

  return (
    <main className="min-h-screen">
      <Navbar />
      <Hero />

      {/* ── About Section ── */}
      <section id="about" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col lg:flex-row gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <div className="aspect-square rounded-[40px] bg-white p-5 shadow-2xl shadow-blue-500/10 overflow-hidden relative max-w-sm mx-auto">
                <div className="w-full h-full rounded-[30px] bg-gradient-to-br from-slate-100 via-blue-50 to-slate-100 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 via-transparent to-secondary/10" />
                  {profile?.about_image_url ? (
                    <img src={profile.about_image_url} alt="About Me" className="w-full h-full object-cover" />
                  ) : (
                    <span className="text-8xl font-black text-slate-200 select-none">
                      {profile?.full_name ? profile.full_name.split(' ').map((n: string) => n[0]).join('').substring(0, 3).toUpperCase() : 'HOO'}
                    </span>
                  )}
                  {/* Floating Stats */}
                  <div className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-md rounded-2xl p-4 shadow-lg">
                    <div className="flex justify-between text-center">
                      {[[profile?.years_experience || '5+', 'Years Exp.'], [profile?.projects_completed || '40+', 'Projects'], [profile?.students_taught || '100+', 'Students']].map(([num, label]) => (
                        <div key={label}>
                          <p className="text-lg font-extrabold text-primary tracking-tighter">{num}</p>
                          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="flex-1"
            >
              <span className="text-primary font-bold text-sm tracking-widest uppercase mb-4 block">About Me</span>
              <h2 className="text-4xl lg:text-5xl font-bold mb-6 tracking-tight text-slate-900 leading-tight">
                {profile?.full_name ? (
                  <>I am {profile.full_name.split(' ')[0]} <span className="text-primary">{profile.full_name.split(' ').slice(1).join(' ')}</span></>
                ) : (
                  <>I am Hezekiah <span className="text-primary">Olawale</span> Ojenike</>
                )}
              </h2>
              {profile?.about_me ? (
                profile.about_me.split('\n\n').map((paragraph: string, i: number) => (
                  <p key={i} className="text-lg text-slate-600 mb-6 leading-relaxed">
                    {paragraph}
                  </p>
                ))
              ) : (
                <>
                  <p className="text-lg text-slate-600 mb-6 leading-relaxed">
                    A dedicated Full-Stack Developer and Tech Instructor based in Lagos, Nigeria. I specialize in crafting high-performance web applications that merge elegant frontend experiences with powerful backend architectures.
                  </p>
                  <p className="text-lg text-slate-600 mb-10 leading-relaxed">
                    When I&apos;m not shipping production-ready code, I&apos;m mentoring developers, exploring distributed systems, or writing about software craftsmanship. Let&apos;s build something exceptional together.
                  </p>
                </>
              )}
              <div className="flex flex-wrap gap-4 mt-10">
                <Link href="/contact" className="btn-primary flex items-center gap-2">
                  Hire Me <ArrowRight size={18} />
                </Link>
                {profile?.github_url && (
                  <a
                    href={profile.github_url}
                    target="_blank"
                    rel="noreferrer"
                    className="btn-ghost flex items-center gap-2"
                  >
                    <GithubIcon size={18} /> View GitHub
                  </a>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── Skills Bento ── */}
      <SkillsBento />

      {/* ── Work Experience ── */}
      <ExperienceSection />

      {/* ── Featured Projects ── */}
      <section id="projects" className="py-24 bg-slate-900 text-white overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-secondary font-bold text-sm tracking-widest uppercase mb-4 block">Selected Work</span>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight">Featured Projects</h2>
            </div>
            <Link href="/projects" className="text-secondary hover:text-white transition-colors flex items-center gap-2 font-semibold shrink-0">
              View All Projects <ArrowRight size={20} />
            </Link>
          </div>

          {loadingProjects ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-secondary" size={40} />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProjects?.map((project: any, idx: number) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white/5 border border-white/10 rounded-[28px] overflow-hidden hover:bg-white/10 hover:border-white/20 transition-all duration-300"
                >
                  {/* Image */}
                  <div className="aspect-[4/3] bg-slate-800 relative overflow-hidden">
                    {project.image ? (
                      <img src={project.image} alt={project.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-60" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <span className="text-7xl font-black text-white/10">{project.title?.[0]}</span>
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent" />
                    {/* Hover Actions */}
                    <div className="absolute inset-0 flex items-center justify-center gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                      {project.github_url && (
                        <a href={project.github_url} target="_blank" rel="noreferrer" className="p-3 bg-white/10 backdrop-blur-md rounded-full text-white hover:bg-white/20 transition-colors">
                          <GithubIcon size={18} />
                        </a>
                      )}
                      {project.live_url && (
                        <a href={project.live_url} target="_blank" rel="noreferrer" className="p-3 bg-secondary rounded-full text-white hover:scale-110 transition-transform">
                          <ExternalLink size={18} />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <h3 className="text-xl font-bold group-hover:text-secondary transition-colors leading-tight">{project.title}</h3>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 bg-white/5 px-2 py-1 rounded-full shrink-0">{project.category}</span>
                    </div>
                    <p className="text-slate-400 text-sm leading-relaxed mb-4 line-clamp-2">{project.description}</p>
                    <div className="flex flex-wrap gap-2 mb-5">
                      {(Array.isArray(project.tech_stack) ? project.tech_stack : (project.tech_stack?.split(',') || [])).slice(0, 3).map((tech: string) => (
                        <span key={tech} className="text-[10px] font-bold px-2 py-1 bg-white/10 rounded-md uppercase tracking-wider text-slate-300">{tech.trim()}</span>
                      ))}
                    </div>
                    <Link
                      href={`/projects/${project.slug}`}
                      className="flex items-center gap-2 text-sm font-bold text-secondary hover:gap-3 transition-all"
                    >
                      View Details <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.div>
              ))}

              {(!featuredProjects || featuredProjects.length === 0) && (
                <div className="col-span-full py-20 text-center border border-dashed border-slate-700 rounded-3xl">
                  <p className="text-slate-500">No featured projects yet. Add them via the admin dashboard.</p>
                </div>
              )}
            </div>
          )}
        </div>
      </section>

      {/* ── Academics ── */}
      <AcademicsSection />

      {/* ── Certifications ── */}
      <CertificationsSection />

      {/* ── Blog Preview ── */}
      <section id="blog" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <span className="text-primary font-bold text-sm tracking-widest uppercase mb-4 block">Latest Thoughts</span>
              <h2 className="text-4xl lg:text-5xl font-bold tracking-tight text-slate-900">From the Blog</h2>
            </div>
            <Link href="/blog" className="text-primary hover:text-primary/80 transition-colors flex items-center gap-2 font-semibold shrink-0">
              All Articles <ArrowRight size={20} />
            </Link>
          </div>

          {loadingPosts ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="animate-spin text-primary" size={40} />
            </div>
          ) : latestPosts?.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {latestPosts.map((post: any, idx: number) => (
                <motion.article
                  key={post.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1 }}
                  className="group bg-white rounded-[28px] border border-slate-100 overflow-hidden hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-2 transition-all duration-300"
                >
                  <div className="aspect-[16/9] bg-gradient-to-br from-slate-100 to-slate-200 relative overflow-hidden">
                    {post.cover_image ? (
                      <img src={post.cover_image} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-4xl">✍️</div>
                    )}
                  </div>
                  <div className="p-6">
                    <div className="flex items-center gap-3 text-slate-400 text-xs mb-3">
                      <Clock size={12} />
                      <span>{new Date(post.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                    </div>
                    <h3 className="font-bold text-xl text-slate-900 group-hover:text-primary transition-colors mb-3 line-clamp-2 leading-snug">{post.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed mb-5 line-clamp-2">{post.excerpt}</p>
                    <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 text-sm font-bold text-primary hover:gap-3 transition-all">
                      Read Article <ArrowRight size={16} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          ) : (
            <div className="py-20 text-center border border-dashed border-slate-200 rounded-3xl">
              <BookOpen size={48} className="text-slate-200 mx-auto mb-4" />
              <p className="text-slate-400 font-medium">No blog posts published yet.</p>
              <p className="text-slate-300 text-sm mt-1">Check back soon for insightful articles.</p>
            </div>
          )}
        </div>
      </section>

      {/* ── Contact CTA ── */}
      <section id="contact" className="py-24 bg-gradient-to-br from-primary via-blue-600 to-secondary text-white relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="grid grid-cols-12 h-full">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="border-r border-white h-full" />
            ))}
          </div>
        </div>
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl" />

        <div className="max-w-4xl mx-auto px-6 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="inline-block px-4 py-1.5 bg-white/10 backdrop-blur-sm text-white text-sm font-bold rounded-full mb-6 border border-white/20">
              💬 Currently Available for Projects
            </span>
            <h2 className="text-5xl lg:text-6xl font-extrabold mb-6 tracking-tighter">
              Let&apos;s build something <br />
              <span className="text-yellow-300">exceptional</span> together.
            </h2>
            <p className="text-xl text-blue-100 mb-12 max-w-2xl mx-auto">
              Whether it&apos;s a startup MVP, enterprise system, or a side project — I bring full-stack expertise and a passion for quality to every engagement.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <Link href="/contact" className="px-10 py-5 bg-white text-primary font-bold rounded-2xl hover:shadow-2xl hover:shadow-blue-900/30 hover:-translate-y-1 transition-all text-lg">
                Start a Project
              </Link>
              <a href={`mailto:${profile?.email || 'hello@hezekiah.dev'}`} className="px-10 py-5 bg-white/10 backdrop-blur-sm text-white font-bold rounded-2xl border border-white/20 hover:bg-white/20 transition-all text-lg">
                Send an Email
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ── Footer ── */}
      <Footer />
    </main>
  );
}

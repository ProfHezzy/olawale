import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ProjectsService } from './projects/projects.service';
import { SkillsService } from './skills/skills.service';
import { AuthService } from './auth/auth.service';
import { BlogService } from './blog/blog.service';
import { ProfileService } from './profile/profile.service';
import { ExperienceService } from './experience/experience.service';
import { AcademicService } from './academics/academic.service';
import { CertificationService } from './certifications/certification.service';

async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const projectsService = app.get(ProjectsService);
  const skillsService = app.get(SkillsService);
  const authService = app.get(AuthService);
  const blogService = app.get(BlogService);
  const profileService = app.get(ProfileService);
  const experienceService = app.get(ExperienceService);
  const academicService = app.get(AcademicService);
  const certificationService = app.get(CertificationService);

  console.log('🌱 Seeding database...');

  // 1. Seed Admin User
  try {
    await authService.register('admin', 'admin123');
    console.log('✅ Admin user created (admin / admin123)');
  } catch (e) {
    console.log('⚠️  Admin user might already exist, skipping...');
  }

  // 1.5 Seed Profile
  try {
    await profileService.updateProfile({
      full_name: 'Hezekiah Olawale Ojenike',
      bio: 'A dedicated Full-Stack Developer and Tech Instructor.',
      about_me: 'A dedicated Full-Stack Developer and Tech Instructor based in Lagos, Nigeria. I specialize in crafting high-performance web applications that merge elegant frontend experiences with powerful backend architectures.\n\nWhen I\'m not shipping production-ready code, I\'m mentoring developers, exploring distributed systems, or writing about software craftsmanship. Let\'s build something exceptional together.',
      email: 'hello@hezekiah.dev',
      location: 'Lagos, Nigeria',
      phone: '+234 123 456 7890',
      github_url: 'https://github.com/ProfHezzy',
      linkedin_url: 'https://linkedin.com/in/hezekiahojenike',
      twitter_url: 'https://twitter.com/hezekiah_dev',
      resume_url: '#',
      years_experience: '5+',
      projects_completed: '40+',
      students_taught: '100+',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=500&auto=format&fit=crop',
      about_image_url: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=500&auto=format&fit=crop',
    });
    console.log('✅ Default profile seeded');
  } catch (e) {
    console.log('⚠️  Failed to seed profile', e);
  }

  // 2. Seed Skills
  const skills = [
    { name: 'Next.js', category: 'frontend', level: 'Expert', order: 1 },
    { name: 'React', category: 'frontend', level: 'Expert', order: 2 },
    { name: 'TypeScript', category: 'frontend', level: 'Advanced', order: 3 },
    { name: 'Tailwind CSS', category: 'frontend', level: 'Advanced', order: 4 },
    { name: 'Framer Motion', category: 'frontend', level: 'Intermediate', order: 5 },
    { name: 'NestJS', category: 'backend', level: 'Expert', order: 6 },
    { name: 'Node.js', category: 'backend', level: 'Expert', order: 7 },
    { name: 'Django', category: 'backend', level: 'Advanced', order: 8 },
    { name: 'FastAPI', category: 'backend', level: 'Intermediate', order: 9 },
    { name: 'GraphQL', category: 'backend', level: 'Intermediate', order: 10 },
    { name: 'PostgreSQL', category: 'database', level: 'Advanced', order: 11 },
    { name: 'MongoDB', category: 'database', level: 'Advanced', order: 12 },
    { name: 'Redis', category: 'database', level: 'Intermediate', order: 13 },
    { name: 'Docker', category: 'tools', level: 'Advanced', order: 14 },
    { name: 'Git & GitHub', category: 'tools', level: 'Expert', order: 15 },
    { name: 'AWS', category: 'tools', level: 'Intermediate', order: 16 },
    { name: 'CI/CD', category: 'tools', level: 'Advanced', order: 17 },
  ];

  for (const skill of skills) {
    try {
      await skillsService.create(skill);
    } catch (e) {
      // skill likely already exists
    }
  }
  console.log('✅ Skills seeded');

  // 3. Seed Featured Projects
  const projects = [
    {
      title: 'Enterprise CRM Platform',
      slug: 'enterprise-crm',
      description: 'A robust CRM system built for large-scale enterprises with real-time analytics, pipeline management, and automated workflows. Handles 10,000+ contacts and integrates with popular email and calendar services.',
      tech_stack: ['Next.js', 'NestJS', 'PostgreSQL', 'Redis', 'Tailwind CSS'],
      featured: true,
      category: 'Web App',
      github_url: 'https://github.com/ProfHezzy',
    },
    {
      title: 'AI Image Generator',
      slug: 'ai-image-gen',
      description: 'A cutting-edge tool leveraging Stable Diffusion to generate high-quality, photorealistic images from text prompts. Features prompt templates, image history, and batch generation.',
      tech_stack: ['React', 'Python', 'FastAPI', 'PyTorch', 'AWS S3'],
      featured: true,
      category: 'AI & ML',
      github_url: 'https://github.com/ProfHezzy',
    },
    {
      title: 'Crypto Wallet Tracker',
      slug: 'crypto-tracker',
      description: 'Real-time tracking of multiple crypto wallets across Ethereum, Bitcoin, and Solana chains. Features price alerts, portfolio analytics, and historical charts powered by WebSocket connections.',
      tech_stack: ['Next.js', 'Go', 'Redis', 'Web3.js', 'Chart.js'],
      featured: true,
      category: 'FinTech',
      github_url: 'https://github.com/ProfHezzy',
    },
    {
      title: 'Developer Learning Platform',
      slug: 'dev-learning-platform',
      description: 'An interactive e-learning platform for aspiring developers with video courses, coding challenges, and mentorship sessions. Hosts 2,000+ students across 50+ structured courses.',
      tech_stack: ['Next.js', 'Django', 'PostgreSQL', 'Stripe', 'AWS CloudFront'],
      featured: false,
      category: 'EdTech',
      github_url: 'https://github.com/ProfHezzy',
    },
    {
      title: 'Real-Time Chat Application',
      slug: 'realtime-chat',
      description: 'A WhatsApp-like messaging application built with Socket.io supporting group chats, file sharing, voice messages, and end-to-end encryption for private conversations.',
      tech_stack: ['React', 'NestJS', 'Socket.io', 'MongoDB', 'WebRTC'],
      featured: false,
      category: 'Web App',
      github_url: 'https://github.com/ProfHezzy',
    },
    {
      title: 'Smart Invoice & Billing SaaS',
      slug: 'invoice-billing-saas',
      description: 'A B2B SaaS platform for freelancers and agencies to generate invoices, track payments, and manage client relationships — with PDF export and payment gateway integrations.',
      tech_stack: ['Next.js', 'NestJS', 'PostgreSQL', 'Stripe', 'PDFKit'],
      featured: false,
      category: 'SaaS',
      github_url: 'https://github.com/ProfHezzy',
    },
  ];

  for (const project of projects) {
    try {
      await projectsService.create(project);
    } catch (e) {
      // project likely already exists
    }
  }
  console.log('✅ Featured projects seeded');

  // 4. Seed Blog Posts
  const posts = [
    {
      title: 'Building Scalable REST APIs with NestJS and TypeORM',
      slug: 'nestjs-typeorm-rest-api',
      excerpt: 'A deep dive into architecting production-grade REST APIs using NestJS, TypeORM, and PostgreSQL — covering guards, interceptors, and advanced TypeORM patterns.',
      content: '<h2>Introduction</h2><p>NestJS is an opinionated Node.js framework that makes it easy to build maintainable, testable server-side applications. In this post, we explore how to structure a scalable REST API using NestJS and TypeORM.</p><h2>Setting Up the Project</h2><p>Start by scaffolding the application using the NestJS CLI and configuring TypeORM with a PostgreSQL database connection...</p>',
      category: 'Backend',
      read_time: '12',
      published: true,
      tags: 'NestJS,TypeORM,PostgreSQL,REST API',
    },
    {
      title: 'The Art of Component Architecture in Next.js',
      slug: 'nextjs-component-architecture',
      excerpt: 'How to think about component composition, co-location, and the right abstractions for building large-scale Next.js applications that your team will love working in.',
      content: '<h2>Why Architecture Matters</h2><p>As your Next.js application grows, poorly structured components become a burden. Good architecture enables faster feature development, easier testing, and better collaboration.</p><h2>Atomic Design Principles</h2><p>Adopt atomic design — organize components as atoms, molecules, organisms, and templates...</p>',
      category: 'Frontend',
      read_time: '10',
      published: true,
      tags: 'Next.js,React,Architecture,Components',
    },
    {
      title: 'Mastering Docker for Full-Stack Development',
      slug: 'docker-fullstack-guide',
      excerpt: 'A practical guide to containerizing your full-stack applications with Docker and Docker Compose — from local development to production deployments.',
      content: '<h2>Why Docker?</h2><p>Docker eliminates the infamous "works on my machine" problem by providing a consistent environment from development to production.</p><h2>Writing Your First Dockerfile</h2><p>Start with a minimal base image and layer your application on top...</p>',
      category: 'DevOps',
      read_time: '15',
      published: true,
      tags: 'Docker,DevOps,Deployment,Containers',
    },
  ];

  for (const post of posts) {
    try {
      await blogService.create(post);
    } catch (e) {
      // post likely already exists
    }
  }
  console.log('✅ Blog posts seeded');

  // 5. Seed Experience
  const experiences = [
    { company: 'Tech Innovators Inc.', position: 'Senior Full-Stack Developer', period: 'Jan 2022 - Present', description: 'Lead development of enterprise cloud solutions using Next.js and NestJS. Managed a team of 5 developers.', order: 1 },
    { company: 'Digital Solutions Ltd.', position: 'Full-Stack Developer', period: 'Mar 2020 - Dec 2021', description: 'Developed and maintained various client websites and internal tools. Focused on React and Node.js.', order: 2 },
    { company: 'Startup Hub', position: 'Junior Web Developer', period: 'Jun 2018 - Feb 2020', description: 'Built responsive web interfaces and assisted in backend development with Django.', order: 3 },
  ];

  for (const exp of experiences) {
    try {
      await experienceService.create(exp);
    } catch (e) {}
  }
  console.log('✅ Experience seeded');

  // 6. Seed Academics
  const academics = [
    { institution: 'Federal University of Technology', degree: 'B.Tech in Computer Science', period: '2014 - 2019', grade: 'First Class Honors', order: 1 },
    { institution: 'Lagos State Polytechnic', degree: 'National Diploma in Computer Engineering', period: '2012 - 2014', grade: 'Distinction', order: 2 },
  ];

  for (const acad of academics) {
    try {
      await academicService.create(acad);
    } catch (e) {}
  }
  console.log('✅ Academics seeded');

  // 7. Seed Certifications
  const certifications = [
    { title: 'AWS Certified Solutions Architect', issuer: 'Amazon Web Services', date: 'Mar 2023', link: '#', order: 1 },
    { title: 'Professional Scrum Master I', issuer: 'Scrum.org', date: 'Nov 2022', link: '#', order: 2 },
    { title: 'Google Professional Cloud Developer', issuer: 'Google Cloud', date: 'Jan 2022', link: '#', order: 3 },
  ];

  for (const cert of certifications) {
    try {
      await certificationService.create(cert);
    } catch (e) {}
  }
  console.log('✅ Certifications seeded');

  console.log('\n🚀 Seeding complete!');
  console.log('🔑 Admin credentials: admin / admin123');
  console.log('🌐 Frontend: http://localhost:3000');
  console.log('📡 Backend:  http://localhost:3001');
  
  await app.close();
}

bootstrap();

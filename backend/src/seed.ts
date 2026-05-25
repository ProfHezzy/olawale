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

  // Check if database already has content to protect user updates
  try {
    const existingProjects = await projectsService.findAll();
    const existingSkills = await skillsService.findAll();
    const hasData = existingProjects.length > 0 || existingSkills.length > 0;
    const forceSeed = process.argv.includes('--force') || process.argv.includes('-f');
    
    if (hasData && !forceSeed) {
      console.log('⚠️  Database already contains existing projects or skills.');
      console.log('⏭️  Skipping database seed to protect your custom changes!');
      console.log('💡 Tip: If you explicitly want to reset and re-seed, run: npm run seed -- --force');
      await app.close();
      return;
    }
  } catch (e) {
    console.log('Checking database status failed, proceeding with seed...', e);
  }

  console.log('🌱 Seeding database with Hezekiah Olawale Ojenike\'s official CV...');

  // 0. Database Cleanup (prevents duplicates when re-seeding)
  console.log('🧹 Clearing existing records to prevent duplication...');

  try {
    const experiences = await experienceService.findAll();
    for (const exp of experiences) {
      await experienceService.remove(exp.id);
    }
    console.log('🗑️  Cleared old experiences');
  } catch (e) {
    console.log('⚠️ Failed to clear experiences', e);
  }

  try {
    const academics = await academicService.findAll();
    for (const acad of academics) {
      await academicService.remove(acad.id);
    }
    console.log('🗑️  Cleared old academics');
  } catch (e) {
    console.log('⚠️ Failed to clear academics', e);
  }

  try {
    const certifications = await certificationService.findAll();
    for (const cert of certifications) {
      await certificationService.remove(cert.id);
    }
    console.log('🗑️  Cleared old certifications');
  } catch (e) {
    console.log('⚠️ Failed to clear certifications', e);
  }

  try {
    const skills = await skillsService.findAll();
    for (const sk of skills) {
      await skillsService.remove(sk.id);
    }
    console.log('🗑️  Cleared old skills');
  } catch (e) {
    console.log('⚠️ Failed to clear skills', e);
  }

  try {
    const projects = await projectsService.findAll();
    for (const proj of projects) {
      await projectsService.remove(proj.id);
    }
    console.log('🗑️  Cleared old projects');
  } catch (e) {
    console.log('⚠️ Failed to clear projects', e);
  }

  try {
    // Note: blogService.findAll() only returns published posts. Let's delete whatever we find.
    const posts = await blogService.findAll();
    for (const post of posts) {
      await blogService.remove(post.id);
    }
    console.log('🗑️  Cleared old blog posts');
  } catch (e) {
    console.log('⚠️ Failed to clear blog posts', e);
  }

  // 1. Seed Admin User
  try {
    await authService.register('admin', 'admin123');
    console.log('✅ Admin user created (admin / admin123)');
  } catch (e) {
    console.log('⚠️  Admin user might already exist, skipping...');
  }

  // 2. Seed Profile
  try {
    await profileService.updateProfile({
      full_name: 'HEZEKIAH OLAWALE OJENIKE',
      bio: 'Full-Stack Developer · Python Engineer · Data Analyst · Technical Instructor',
      about_me: 'Results-driven Full-Stack Developer and Python Engineer with 3+ years of hands-on experience building scalable web applications, backend systems, and data-driven tools across EdTech, FinTech, and SaaS domains. Proficient in Python, Django, JavaScript, PHP, and MySQL, with additional expertise in data analysis using Pandas, NumPy, and Microsoft Excel (advanced dashboards).\n\nBrings a rare combination of deep technical skill and proven instructional ability — having designed and delivered structured programming curricula for 5+ years, mentoring and upskilling 100+ aspiring developers. Equally effective in solo development, collaborative teams, and client-facing roles. Actively seeking opportunities across software engineering, data analysis, and technical training.',
      email: 'hezekiahonline94@gmail.com',
      location: 'Ibarapa North, Oyo State, Nigeria',
      phone: '+234-814-027-2765',
      github_url: 'https://github.com/ProfHezzy',
      linkedin_url: 'https://linkedin.com/in/hezekiahojenike',
      twitter_url: 'https://twitter.com/hezekiah_dev',
      resume_url: '#',
      years_experience: '3+',
      projects_completed: '8+',
      students_taught: '100+',
      avatar_url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=500&auto=format&fit=crop',
      about_image_url: 'https://images.unsplash.com/photo-1531403009284-440f080d1e12?q=80&w=500&auto=format&fit=crop',
    });
    console.log('✅ Official profile seeded');
  } catch (e) {
    console.log('⚠️  Failed to seed profile', e);
  }

  // 3. Seed Core Technical Skills
  const skills = [
    // Languages
    { name: 'Python', category: 'backend', level: 'Expert', order: 1 },
    { name: 'JavaScript', category: 'frontend', level: 'Expert', order: 2 },
    { name: 'TypeScript', category: 'frontend', level: 'Advanced', order: 3 },
    { name: 'PHP', category: 'backend', level: 'Advanced', order: 4 },
    { name: 'HTML5', category: 'frontend', level: 'Expert', order: 5 },
    { name: 'CSS3', category: 'frontend', level: 'Expert', order: 6 },
    { name: 'SQL', category: 'database', level: 'Advanced', order: 7 },

    // Frameworks
    { name: 'Django', category: 'backend', level: 'Expert', order: 8 },
    { name: 'Next.js', category: 'frontend', level: 'Advanced', order: 9 },
    { name: 'NestJS', category: 'backend', level: 'Advanced', order: 10 },
    { name: 'Bootstrap', category: 'frontend', level: 'Advanced', order: 11 },
    { name: 'jQuery', category: 'frontend', level: 'Advanced', order: 12 },

    // Databases
    { name: 'MySQL', category: 'database', level: 'Expert', order: 13 },
    { name: 'SQLite', category: 'database', level: 'Advanced', order: 14 },
    { name: 'Database Design', category: 'database', level: 'Advanced', order: 15 },
    { name: 'REST APIs', category: 'backend', level: 'Advanced', order: 16 },

    // Data & Analysis
    { name: 'Pandas', category: 'data analysis', level: 'Advanced', order: 17 },
    { name: 'NumPy', category: 'data analysis', level: 'Advanced', order: 18 },
    { name: 'Excel Dashboards', category: 'data analysis', level: 'Expert', order: 19 },
    { name: 'Pivot Tables', category: 'data analysis', level: 'Expert', order: 20 },
    { name: 'Data Visualization', category: 'data analysis', level: 'Advanced', order: 21 },

    // Tools & DevOps
    { name: 'Git & GitHub', category: 'tools', level: 'Expert', order: 22 },
    { name: 'VS Code', category: 'tools', level: 'Expert', order: 23 },
    { name: 'XAMPP', category: 'tools', level: 'Advanced', order: 24 },
    { name: 'cPanel', category: 'tools', level: 'Advanced', order: 25 },
    { name: 'Postman', category: 'tools', level: 'Advanced', order: 26 },
  ];

  for (const skill of skills) {
    try {
      await skillsService.create(skill);
    } catch (e) {
      console.log(`⚠️ Failed to seed skill ${skill.name}`);
    }
  }
  console.log('✅ Technical skills successfully seeded');

  // 4. Seed Professional Experience
  const experiences = [
    {
      company: 'Mindset Information Technology',
      position: 'Full-Stack Web Developer',
      period: '2022 – Present',
      description: '• Designed and developed 4+ dynamic web applications using HTML, CSS, JavaScript, PHP, and MySQL for blogs, e-commerce, and booking systems.\n• Engineered responsive, mobile-first UIs that reduced bounce rates and improved overall UX.\n• Built secure user authentication systems, relational database schemas, and RESTful backend APIs.\n• Optimized web app performance through database query tuning, caching, and code refactorings, reducing load times by up to 40%.\n• Managed entire software development lifecycle, from gathering requirements and prototyping to final deployment on cPanel-hosted production environments.',
      order: 1,
    },
    {
      company: 'Tee-Dev',
      position: 'Python Developer (Contract)',
      period: '2023 (2 Months)',
      description: '• Contributed to the backend development of a robust FinTech application using Python and Django, implementing core payment and transactional models.\n• Integrated multiple third-party financial REST APIs for processing secure payouts and retrieving customer history.\n• Wrote custom automated scripts that optimized backend data processing, reducing manual data entry workflows by 60%.\n• Maintained structured local database storage using SQLite and participated in sprint meetings.',
      order: 2,
    },
    {
      company: 'Quantum Innovation STEAM Academy',
      position: 'Technical Instructor — Programming & Web Development',
      period: '2020 – 2025',
      description: '• Delivered structured programming instruction to 100+ students from beginner to intermediate levels, covering HTML, CSS, JavaScript, Python, and PHP.\n• Authored comprehensive, hands-on programming curricula focused on practical project-based learning.\n• Mentored students through complex capstone engineering projects, improving final graduation and completion rates.\n• Managed intensive coding labs and weekly workshops translating challenging software principles into accessible steps.\n• Created durable slide decks, coding exercises, and lesson guides deployed across multiple tech cohorts.',
      order: 3,
    },
  ];

  for (const exp of experiences) {
    try {
      await experienceService.create(exp);
    } catch (e) {
      console.log(`⚠️ Failed to seed experience for ${exp.company}`);
    }
  }
  console.log('✅ Professional experience successfully seeded');

  // 5. Seed Projects
  const projects = [
    {
      title: 'Agro Market Platform',
      slug: 'agro-market-platform',
      description: 'A full-stack agricultural marketplace connecting farmers, buyers, and agri-enthusiasts — enabling product listing, search, and transaction management. Features a highly modular NestJS architecture with TypeScript, ensuring end-to-end type safety and optimal scaling across payment integrations, user profile databases, and marketplace listings.',
      tech_stack: ['NestJS', 'TypeScript', 'REST API', 'Node.js', 'PostgreSQL'],
      featured: true,
      category: 'Web App',
      github_url: 'https://github.com/ProfHezzy',
      image: 'https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Community Finance App',
      slug: 'community-finance-app',
      description: 'A custom community finance management platform designed to track contributions, microloans, and payouts within traditional local savings groups (the ajo/esusu model). Features custom Django database schemas, relational transaction history, secure user authentication roles, automated balance calculations, and comprehensive PDF financial reports.',
      tech_stack: ['Python', 'Django', 'SQLite', 'Django ORM', 'Bootstrap'],
      featured: true,
      category: 'FinTech',
      github_url: 'https://github.com/ProfHezzy',
      image: 'https://images.unsplash.com/photo-1559526324-4b87b5e36e44?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Travel Booking Platform',
      slug: 'travel-booking-platform',
      description: 'A high-performance travel service and tour booking platform offering real-time seat availability checks, email booking confirmations, payment checkout flows, and a comprehensive admin management dashboard. Built using a normalized relational MySQL schema capable of scaling under high booking concurrency.',
      tech_stack: ['PHP', 'MySQL', 'JavaScript', 'HTML5', 'CSS3'],
      featured: true,
      category: 'Web App',
      github_url: 'https://github.com/ProfHezzy',
      image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Blog & Content Management System',
      slug: 'blog-cms',
      description: 'A multi-user content management system boasting custom role-based access controls (administrator, author, reader tiers). Incorporates rich text document editors, tags and category search indices, fully integrated CRUD controllers, search engines, and a real-time comments moderation dashboard for the admin.',
      tech_stack: ['PHP', 'MySQL', 'JavaScript', 'HTML5', 'CSS3'],
      featured: false,
      category: 'Web App',
      github_url: 'https://github.com/ProfHezzy',
      image: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=600&auto=format&fit=crop',
    },
  ];

  for (const project of projects) {
    try {
      await projectsService.create(project);
    } catch (e) {
      console.log(`⚠️ Failed to seed project: ${project.title}`);
    }
  }
  console.log('✅ Projects successfully seeded');

  // 6. Seed Education (Academics)
  const academics = [
    {
      institution: 'Ronik Polytechnic',
      degree: 'Higher National Diploma (HND) — Computer Science',
      period: '2020 – 2022',
      grade: 'Distinction / Upper Credit Core',
      order: 1,
    },
    {
      institution: 'Ronik Polytechnic',
      degree: 'National Diploma (ND) — Computer Science',
      period: '2017 – 2019',
      grade: 'Distinction / Upper Credit Core',
      order: 2,
    },
    {
      institution: 'Central High School',
      degree: 'Senior Secondary Certificate (SSCE)',
      period: '2010 – 2013',
      grade: 'SSCE Graduate',
      order: 3,
    },
  ];

  for (const acad of academics) {
    try {
      await academicService.create(acad);
    } catch (e) {
      console.log(`⚠️ Failed to seed academic stage for ${acad.degree}`);
    }
  }
  console.log('✅ Academic history successfully seeded');

  // 7. Seed Certifications
  const certifications = [
    {
      title: 'Python for Everyone',
      issuer: 'Udemy',
      date: 'Udemy Certificate',
      link: 'https://udemy.com',
      order: 1,
    },
    {
      title: 'Python Programming',
      issuer: 'Cisco',
      date: 'Cisco Networking Academy',
      link: 'https://cisco.com',
      order: 2,
    },
    {
      title: 'HTML, CSS & JavaScript',
      issuer: 'Udemy',
      date: 'Udemy Certificate',
      link: 'https://udemy.com',
      order: 3,
    },
    {
      title: 'SQL Language',
      issuer: 'Coursera',
      date: 'Coursera Verification',
      link: 'https://coursera.org',
      order: 4,
    },
  ];

  for (const cert of certifications) {
    try {
      await certificationService.create(cert);
    } catch (e) {
      console.log(`⚠️ Failed to seed certification: ${cert.title}`);
    }
  }
  console.log('✅ Certifications successfully seeded');

  // 8. Seed custom blog posts matching Hezekiah's actual core focus
  const posts = [
    {
      title: 'Why NestJS is My Go-To Framework for Modular APIs',
      slug: 'why-nestjs-is-my-go-to-framework',
      excerpt: 'NestJS brings robust modular architecture and strict TypeScript typing to Node.js backend systems. In this article, I explore why it stands out for enterprise developer productivity.',
      content: '<h2>Introduction</h2><p>Building maintainable web applications requires opinionated guidelines. NestJS, an outstanding framework built on Node.js and TypeScript, addresses modular organization beautifully.</p><h2>The Core Benefits</h2><p>1. <strong>Strong Type Safety:</strong> Leveraging TypeScript interfaces and models reduces bugs before runtime.<br/>2. <strong>Modular Codebase:</strong> Modules, controllers, and services ensure concerns are segregated correctly.<br/>3. <strong>Built-in Dependency Injection:</strong> Simplifies unit testing and decouple components.</p><h2>Conclusion</h2><p>For scalable architectures that need to grow over multiple years, NestJS is unmatched in the Node.js ecosystem.</p>',
      category: 'Backend',
      read_time: '8',
      published: true,
      tags: 'NestJS,TypeScript,Backend,Architecture',
      cover_image: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Mastering Django ORM for Financial Ledger Calculations',
      slug: 'mastering-django-orm-fintech',
      excerpt: 'A practical, developer-focused dive into using Django ORM to record complex financial balances, transactional states, and ledger entries cleans and securely.',
      content: '<h2>Handling Community Savings Models</h2><p>In community-based cooperative banking (ajo/esusu models), double-entry security is critical. The database layer must prevent balance arithmetic anomalies under concurrency.</p><h2>Best Practices in Django ORM</h2><p>1. <strong>Transaction Atomicity:</strong> Always wrap deposit payouts in <code>transaction.atomic()</code>.<br/>2. <strong>F-Expressions:</strong> Prevent race conditions by updating database numeric fields relatively: <code>F(\'balance\') + amount</code>.<br/>3. <strong>Normalized Ledgers:</strong> Avoid saving derived balances directly; rely on dynamic database aggregations over clean transaction records.</p>',
      category: 'Backend',
      read_time: '10',
      published: true,
      tags: 'Django,Python,FinTech,ORM',
      cover_image: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=600&auto=format&fit=crop',
    },
    {
      title: 'Building Interactive Excel Dashboards with Pandas Integrations',
      slug: 'excel-dashboards-pandas-integration',
      excerpt: 'Excel is still an incredibly powerful tool for business reporting. Discover how to construct data pipelines with Python Pandas, NumPy, and clean dashboards.',
      content: '<h2>Bypassing Manual Operations</h2><p>Many business workflows are slowed down by manual copy-pasting. Integrating Python Pandas allows us to pre-clean large datasets automatically, generating flawless Excel reporting sheets.</p><h2>Building the Pipeline</h2><p>1. Extract raw transactional Excel sheets with <code>pd.read_excel()</code>.<br/>2. Aggregate data using Pivot Tables inside Pandas: <code>df.pivot_table()</code>.<br/>3. Use xlsxwriter engines in Python to format interactive charts and customized highlights instantly.</p>',
      category: 'Data Analysis',
      read_time: '7',
      published: true,
      tags: 'DataAnalysis,Excel,Pandas,Visualization',
      cover_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=600&auto=format&fit=crop',
    },
  ];

  for (const post of posts) {
    try {
      await blogService.create(post);
    } catch (e) {
      console.log(`⚠️ Failed to seed blog post: ${post.title}`);
    }
  }
  console.log('✅ Custom blog posts successfully seeded');

  console.log('\n🚀 Database seeding is complete!');
  console.log('📁 Your official resume data has been loaded.');
  console.log('🌐 Local Frontend: http://localhost:3000');
  console.log('📡 Local Backend:  http://localhost:3001');
  
  await app.close();
}

bootstrap();

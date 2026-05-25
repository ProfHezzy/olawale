import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BlogService } from '../blog/blog.service';

// === POST TYPE 1: EXPERTISE TOPICS ===
const EXPERTISE_TOPICS = [
  { topic: 'Python Django REST Framework best practices', category: 'Backend', tags: 'Python,Django,REST API,Backend', readTime: '8' },
  { topic: 'Building scalable APIs with NestJS and TypeScript', category: 'Backend', tags: 'NestJS,TypeScript,API,Backend', readTime: '10' },
  { topic: 'MySQL database design and optimization tips', category: 'Database', tags: 'MySQL,Database,SQL,Optimization', readTime: '7' },
  { topic: 'Python data analysis with Pandas and NumPy', category: 'Data Analysis', tags: 'Python,Pandas,NumPy,DataAnalysis', readTime: '9' },
  { topic: 'Full-stack web development with PHP and MySQL', category: 'Web Development', tags: 'PHP,MySQL,FullStack,WebDev', readTime: '8' },
  { topic: 'JavaScript ES6+ features every developer should know', category: 'Frontend', tags: 'JavaScript,ES6,Frontend,WebDev', readTime: '6' },
  { topic: 'Building community finance apps with Django ORM', category: 'Backend', tags: 'Django,Python,FinTech,ORM', readTime: '10' },
  { topic: 'Creating advanced Excel dashboards for business reporting', category: 'Data Analysis', tags: 'Excel,DataAnalysis,Dashboards,Business', readTime: '7' },
  { topic: 'Responsive web design best practices with CSS3', category: 'Frontend', tags: 'CSS3,HTML5,Responsive,WebDesign', readTime: '6' },
  { topic: 'Next.js for full-stack development: a practical guide', category: 'Frontend', tags: 'NextJS,React,FullStack,JavaScript', readTime: '9' },
  { topic: 'Git and GitHub workflow for solo developers and teams', category: 'Tools', tags: 'Git,GitHub,DevTools,Workflow', readTime: '6' },
  { topic: 'REST API design principles every backend developer must know', category: 'Backend', tags: 'REST,API,Backend,BestPractices', readTime: '8' },
  { topic: 'Python automation scripts for everyday developer tasks', category: 'Backend', tags: 'Python,Automation,Scripting,Tools', readTime: '7' },
  { topic: 'Building secure authentication systems in web applications', category: 'Security', tags: 'Security,Authentication,JWT,WebDev', readTime: '9' },
  { topic: 'TypeScript strict mode: why you should always enable it', category: 'Backend', tags: 'TypeScript,BestPractices,JavaScript,Backend', readTime: '7' },
  { topic: 'Teaching programming effectively: lessons from 5 years of experience', category: 'Education', tags: 'Teaching,Programming,Education,Mentorship', readTime: '8' },
  { topic: 'SQLite vs MySQL: choosing the right database for your project', category: 'Database', tags: 'SQLite,MySQL,Database,Backend', readTime: '7' },
  { topic: 'cPanel hosting deployment guide for PHP and Node.js apps', category: 'DevOps', tags: 'cPanel,Hosting,PHP,Deployment', readTime: '7' },
  { topic: 'Bootstrap 5 component guide for rapid UI development', category: 'Frontend', tags: 'Bootstrap,CSS,HTML5,UI', readTime: '6' },
  { topic: 'Data visualization techniques with Python and Excel', category: 'Data Analysis', tags: 'Python,Excel,Visualization,DataAnalysis', readTime: '8' },
];

// === POST TYPE 2: TECH NEWS TOPICS ===
const NEWS_TOPICS = [
  'latest AI and machine learning breakthroughs',
  'new programming languages and framework releases',
  'cybersecurity threats and data breach news',
  'cloud computing updates from AWS, Azure, and Google Cloud',
  'open source project launches and major updates',
  'web development trends and new browser features',
  'mobile development news for iOS and Android',
  'big tech company announcements (Google, Meta, Microsoft, Apple)',
  'startup funding rounds and tech acquisitions',
  'developer tools and IDE updates',
  'blockchain and Web3 technology developments',
  'tech industry layoffs and hiring trends',
  'new API launches and developer platform updates',
  'Python ecosystem updates and new library releases',
  'JavaScript and Node.js ecosystem news',
];

// === POST TYPE 3: JOB LISTING SEARCH TERMS ===
const JOB_SEARCH_TERMS = [
  { search: 'remote Python developer jobs', focus: 'Python', tags: 'Python,Remote,Jobs,Developer' },
  { search: 'remote frontend developer React jobs', focus: 'Frontend/React', tags: 'React,Frontend,Remote,Jobs' },
  { search: 'remote backend developer Node.js NestJS jobs', focus: 'Backend/Node.js', tags: 'NodeJS,NestJS,Backend,Jobs' },
  { search: 'full-stack developer jobs Africa remote', focus: 'Full-Stack', tags: 'FullStack,Remote,Africa,Jobs' },
  { search: 'data analyst Python Excel jobs remote', focus: 'Data Analysis', tags: 'DataAnalysis,Python,Excel,Jobs' },
  { search: 'junior developer jobs remote 2025 2026', focus: 'Junior Roles', tags: 'Junior,Developer,Remote,Jobs' },
  { search: 'Django developer jobs remote hybrid onsite', focus: 'Django', tags: 'Django,Python,Backend,Jobs' },
  { search: 'PHP MySQL developer jobs', focus: 'PHP', tags: 'PHP,MySQL,WebDev,Jobs' },
  { search: 'TypeScript developer jobs remote', focus: 'TypeScript', tags: 'TypeScript,JavaScript,Remote,Jobs' },
  { search: 'tech instructor coding bootcamp teaching jobs', focus: 'Teaching/Training', tags: 'Teaching,TechInstructor,Education,Jobs' },
  { search: 'software engineer Nigeria Africa jobs', focus: 'Nigeria/Africa', tags: 'Nigeria,Africa,SoftwareEngineer,Jobs' },
  { search: 'DevOps cloud engineer jobs remote', focus: 'DevOps', tags: 'DevOps,Cloud,Remote,Jobs' },
];

type PostType = 'expertise' | 'news' | 'jobs';

@Injectable()
export class AiBlogService {
  private readonly logger = new Logger(AiBlogService.name);
  private genAI: GoogleGenerativeAI | null = null;
  private expertiseIndex = 0;
  private newsIndex = 0;
  private jobsIndex = 0;

  constructor(
    private configService: ConfigService,
    private blogService: BlogService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey && apiKey !== 'your_gemini_api_key_here') {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.logger.log('✅ AI Blog Service initialized with Gemini API');
    } else {
      this.logger.warn('⚠️  GEMINI_API_KEY not set. AI blog posting is disabled.');
    }
  }

  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim()
      .substring(0, 80) +
      '-' + Date.now().toString().slice(-6);
  }

  private getCoverImage(category: string): string {
    const coverImages: Record<string, string> = {
      Backend: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
      Frontend: 'https://images.unsplash.com/photo-1593720219276-0b1eacd0aef4?q=80&w=800&auto=format&fit=crop',
      Database: 'https://images.unsplash.com/photo-1544383835-bda2bc66a55d?q=80&w=800&auto=format&fit=crop',
      'Data Analysis': 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop',
      'Web Development': 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop',
      DevOps: 'https://images.unsplash.com/photo-1667372393119-3d4c48d07fc9?q=80&w=800&auto=format&fit=crop',
      Security: 'https://images.unsplash.com/photo-1563013544-824ae1b704d3?q=80&w=800&auto=format&fit=crop',
      Tools: 'https://images.unsplash.com/photo-1618401471353-b98afee0b2eb?q=80&w=800&auto=format&fit=crop',
      Education: 'https://images.unsplash.com/photo-1509062522246-3755977927d7?q=80&w=800&auto=format&fit=crop',
      FinTech: 'https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop',
      Career: 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?q=80&w=800&auto=format&fit=crop',
      'Tech News': 'https://images.unsplash.com/photo-1504711434969-e33886168d6c?q=80&w=800&auto=format&fit=crop',
      'Job Board': 'https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?q=80&w=800&auto=format&fit=crop',
    };
    return coverImages[category] || coverImages['Web Development'];
  }

  // ──────────────────────────────────────
  // POST TYPE 1: EXPERTISE ARTICLES
  // ──────────────────────────────────────
  private async generateExpertisePost(): Promise<{ success: boolean; title?: string; error?: string }> {
    const topicData = EXPERTISE_TOPICS[this.expertiseIndex % EXPERTISE_TOPICS.length];
    this.expertiseIndex++;

    this.logger.log(`🤖 [Expertise] Generating about: "${topicData.topic}"`);

    const prompt = `You are writing a professional technical blog post for a portfolio website belonging to Hezekiah Olawale Ojenike, a Full-Stack Developer, Python Engineer, Data Analyst, and Technical Instructor based in Nigeria with 3+ years of experience.

Write a detailed, engaging, and practical blog post about: "${topicData.topic}"

The blog post should:
- Sound like it was written by a senior Nigerian developer with real-world experience
- Include practical code examples where relevant (use <pre><code> tags)
- Use proper HTML formatting with <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <pre><code> tags
- Be between 600-900 words
- Have a compelling, specific title
- Feel personal and experienced, not AI-generated
- Include at least 2 real-world examples or analogies
- End with a clear takeaway or call to action

Return ONLY a valid JSON object (no markdown, no backticks):
{
  "title": "The exact blog post title",
  "excerpt": "A compelling 1-2 sentence summary (plain text, no HTML)",
  "content": "The full HTML blog post content"
}`;

    return this.callGeminiAndPublish(prompt, topicData.category, topicData.tags, topicData.readTime);
  }

  // ──────────────────────────────────────
  // POST TYPE 2: TECH NEWS ROUNDUP
  // ──────────────────────────────────────
  private async generateNewsPost(): Promise<{ success: boolean; title?: string; error?: string }> {
    const newsTopic = NEWS_TOPICS[this.newsIndex % NEWS_TOPICS.length];
    this.newsIndex++;

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    this.logger.log(`📰 [Tech News] Generating roundup about: "${newsTopic}"`);

    const prompt = `You are a tech news blogger writing for a developer portfolio blog owned by Hezekiah Olawale Ojenike, a Full-Stack Developer based in Nigeria.

Today's date is ${today}. Write a tech news roundup blog post focused on: "${newsTopic}"

IMPORTANT RULES:
- Research and include the LATEST real news, announcements, and developments in this area
- Include specific company names, product names, version numbers, and dates where possible
- Mention real URLs/websites where readers can learn more (use <a href="URL" target="_blank"> tags)
- Cover 4-6 distinct news items or developments
- Use proper HTML formatting: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <a>, <blockquote>
- Be between 500-800 words
- Write in an engaging, informative tone — like a senior developer summarizing the week's top stories
- End with a "Key Takeaways" section summarizing what developers should pay attention to

Return ONLY a valid JSON object (no markdown, no backticks):
{
  "title": "The exact blog post title — make it specific to today's news, include the month/year",
  "excerpt": "A compelling 1-2 sentence summary (plain text, no HTML)",
  "content": "The full HTML blog post content"
}`;

    return this.callGeminiAndPublish(prompt, 'Tech News', `TechNews,${newsTopic.split(' ').slice(0, 3).join(',')}`, '6');
  }

  // ──────────────────────────────────────
  // POST TYPE 3: JOB LISTINGS
  // ──────────────────────────────────────
  private async generateJobsPost(): Promise<{ success: boolean; title?: string; error?: string }> {
    const jobData = JOB_SEARCH_TERMS[this.jobsIndex % JOB_SEARCH_TERMS.length];
    this.jobsIndex++;

    const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
    this.logger.log(`💼 [Job Board] Generating job listings for: "${jobData.focus}"`);

    const prompt = `You are writing a developer job listings blog post for a portfolio blog owned by Hezekiah Olawale Ojenike, a Full-Stack Developer and Technical Instructor based in Nigeria.

Today's date is ${today}. Write a job listings roundup post focused on: "${jobData.search}"

CRITICAL REQUIREMENTS:
1. List 8-12 REAL, CURRENT developer job openings that match this search
2. For each job include: Job Title, Company Name, Location/Type (Remote/Hybrid/Onsite), Key Requirements, and an Application Link
3. Present the jobs in a CLEAN HTML TABLE with these columns:
   - Role / Title
   - Company
   - Type (Remote 🌍 / Hybrid 🏢 / Onsite 📍)
   - Key Requirements (2-3 bullet points)
   - Apply Link
4. Use real job board URLs from sites like:
   - LinkedIn Jobs (linkedin.com/jobs)
   - Indeed (indeed.com)
   - Wellfound/AngelList (wellfound.com)
   - Remote OK (remoteok.com)
   - We Work Remotely (weworkremotely.com)
   - Turing (turing.com)
   - Andela (andela.com)
   - Jobberman (jobberman.com) for Nigeria roles
5. Include a mix of Remote, Hybrid, and Onsite roles
6. Include salary ranges where possible
7. Add a brief intro paragraph and a tips section at the end with application advice

Use proper HTML formatting: <h2>, <h3>, <p>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <a href target="_blank">, <ul>, <li>, <strong>
Style the table with inline styles for readability: border-collapse, padding, alternating row colors.

The table HTML should use this structure:
<table style="width:100%; border-collapse:collapse; margin:20px 0;">
<thead><tr style="background:#1e293b; color:white;"><th style="padding:12px; text-align:left;">...</th></tr></thead>
<tbody><tr style="border-bottom:1px solid #e2e8f0; vertical-align:top;">...</tr></tbody>
</table>

Return ONLY a valid JSON object (no markdown, no backticks):
{
  "title": "The exact blog post title — include the focus area and month/year",
  "excerpt": "A compelling 1-2 sentence summary (plain text, no HTML)",
  "content": "The full HTML blog post content with the job table"
}`;

    return this.callGeminiAndPublish(prompt, 'Job Board', jobData.tags, '5');
  }

  // ──────────────────────────────────────
  // SHARED: Call Gemini API + Publish
  // ──────────────────────────────────────
  private async callGeminiAndPublish(
    prompt: string,
    category: string,
    tags: string,
    readTime: string,
  ): Promise<{ success: boolean; title?: string; error?: string }> {
    if (!this.genAI) {
      return { success: false, error: 'GEMINI_API_KEY not configured' };
    }

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();

      let parsed: { title: string; excerpt: string; content: string };
      try {
        const jsonStr = responseText
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/```\s*$/i, '')
          .trim();
        parsed = JSON.parse(jsonStr);
      } catch {
        this.logger.error('Failed to parse AI response as JSON');
        return { success: false, error: 'Failed to parse AI response' };
      }

      if (!parsed.title || !parsed.content || !parsed.excerpt) {
        return { success: false, error: 'AI response missing required fields' };
      }

      const slug = this.generateSlug(parsed.title);

      await this.blogService.create({
        title: parsed.title,
        slug,
        excerpt: parsed.excerpt,
        content: parsed.content,
        category,
        read_time: readTime,
        tags,
        published: true,
        cover_image: this.getCoverImage(category),
      });

      this.logger.log(`✅ Published [${category}]: "${parsed.title}"`);
      return { success: true, title: parsed.title };
    } catch (error: any) {
      this.logger.error(`❌ Failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // ──────────────────────────────────────
  // PUBLIC: Generate a specific type of post
  // ──────────────────────────────────────
  async generateAndPublishPost(type?: PostType): Promise<{ success: boolean; title?: string; error?: string }> {
    if (!this.genAI) {
      return { success: false, error: 'GEMINI_API_KEY not configured' };
    }

    // If no type specified, pick based on rotation
    if (!type) {
      const rotation: PostType[] = ['expertise', 'news', 'jobs'];
      const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
      );
      type = rotation[dayOfYear % rotation.length];
    }

    switch (type) {
      case 'expertise':
        return this.generateExpertisePost();
      case 'news':
        return this.generateNewsPost();
      case 'jobs':
        return this.generateJobsPost();
      default:
        return this.generateExpertisePost();
    }
  }

  // Morning post: rotates between expertise and news
  async generateMorningPost(): Promise<{ success: boolean; title?: string; error?: string }> {
    const dayOfYear = Math.floor(
      (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000,
    );
    // Alternate days: even = expertise, odd = news
    const type: PostType = dayOfYear % 2 === 0 ? 'expertise' : 'news';
    this.logger.log(`🌅 Morning Post: Generating "${type}" post...`);
    return this.generateAndPublishPost(type);
  }

  // Afternoon post: always job listings (most useful for readers)
  async generateAfternoonPost(): Promise<{ success: boolean; title?: string; error?: string }> {
    this.logger.log(`🌤️ Afternoon Post: Generating job listings...`);
    return this.generateAndPublishPost('jobs');
  }
}

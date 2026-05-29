import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BlogService } from '../blog/blog.service';

// === POST TYPE 1: EXPERTISE TOPICS ===
const EXPERTISE_TOPICS = [
  { topic: 'The evolution of Artificial Intelligence: Neural Networks explained', category: 'AI & ML', tags: 'AI,MachineLearning,NeuralNetworks,Tech', readTime: '9' },
  { topic: 'Hardware vs Software: The future of custom silicon chips in computing', category: 'Hardware', tags: 'Hardware,Computing,Silicon,Tech', readTime: '8' },
  { topic: 'Cybersecurity essentials for the modern digital age', category: 'Security', tags: 'Cybersecurity,Privacy,Security,Tech', readTime: '7' },
  { topic: 'How Cloud Computing is reshaping enterprise infrastructure', category: 'Cloud Computing', tags: 'Cloud,AWS,Azure,Infrastructure', readTime: '8' },
  { topic: 'The rise of edge computing and IoT devices', category: 'Hardware', tags: 'IoT,EdgeComputing,Hardware,Tech', readTime: '6' },
  { topic: 'Understanding Blockchain beyond cryptocurrencies', category: 'Web3', tags: 'Blockchain,Web3,Tech,Decentralization', readTime: '9' },
  { topic: 'The impact of 5G and 6G technologies on global connectivity', category: 'Networking', tags: '5G,Networking,Telecom,Tech', readTime: '7' },
  { topic: 'Building scalable APIs with modern backend architectures', category: 'Software Engineering', tags: 'API,Backend,Architecture,Tech', readTime: '10' },
  { topic: 'A deep dive into quantum computing capabilities', category: 'Future Tech', tags: 'QuantumComputing,Future,Tech,Science', readTime: '8' },
  { topic: 'The psychology of UI/UX design in modern applications', category: 'Design', tags: 'UI,UX,Design,Software', readTime: '6' },
  { topic: 'Demystifying DevOps and continuous integration pipelines', category: 'DevOps', tags: 'DevOps,CI/CD,Software,Automation', readTime: '7' },
  { topic: 'The future of augmented reality (AR) and virtual reality (VR) in tech', category: 'AR/VR', tags: 'AR,VR,Metaverse,Tech', readTime: '8' },
  { topic: 'Big Data: How companies process petabytes of information', category: 'Data Science', tags: 'BigData,DataScience,Analytics,Tech', readTime: '9' },
  { topic: 'Ethics in AI: Bias, transparency, and accountability', category: 'AI & ML', tags: 'AI,Ethics,MachineLearning,Tech', readTime: '7' },
  { topic: 'Sustainable tech: Green computing and reducing electronic waste', category: 'Hardware', tags: 'Sustainability,Hardware,GreenTech,Environment', readTime: '6' },
  { topic: 'The role of open-source software in driving tech innovation', category: 'Software Engineering', tags: 'OpenSource,Software,Innovation,Tech', readTime: '8' },
  { topic: 'Next-generation robotics and automation in manufacturing', category: 'Robotics', tags: 'Robotics,Automation,Hardware,Tech', readTime: '7' },
  { topic: 'The convergence of biotechnology and artificial intelligence', category: 'BioTech', tags: 'BioTech,AI,HealthTech,Science', readTime: '9' },
  { topic: 'Mobile development trends: Native vs Cross-platform frameworks', category: 'Software Engineering', tags: 'Mobile,AppDev,Software,Tech', readTime: '6' },
  { topic: 'How machine learning models are trained and optimized', category: 'AI & ML', tags: 'MachineLearning,AI,Data,Tech', readTime: '8' },
];

// === POST TYPE 2: TECH NEWS TOPICS ===
const NEWS_TOPICS = [
  'latest AI and neural network breakthroughs',
  'new hardware releases and custom silicon chip announcements',
  'cybersecurity threats and global data breach news',
  'cloud computing updates from AWS, Azure, and Google Cloud',
  'major robotics and automation developments',
  'AR/VR and spatial computing innovations',
  'mobile and consumer electronics hardware news',
  'big tech company announcements (Google, Meta, Microsoft, Apple, Nvidia)',
  'startup funding rounds and tech acquisitions globally',
  'advancements in quantum computing technology',
  'blockchain and decentralized technology developments',
  'tech industry layoffs, hiring trends, and market shifts',
  'new developments in green tech and sustainable computing',
  'open-source software milestones and updates',
  'innovations in space technology and satellite networking',
];

// === POST TYPE 3: JOB LISTING SEARCH TERMS ===
const JOB_SEARCH_TERMS = [
  { search: 'software engineer jobs remote', focus: 'Software Engineering', tags: 'Software,Engineering,Remote,Jobs' },
  { search: 'AI engineer machine learning jobs', focus: 'AI & Machine Learning', tags: 'AI,MachineLearning,Jobs,Tech' },
  { search: 'hardware engineer embedded systems jobs', focus: 'Hardware Engineering', tags: 'Hardware,Embedded,Engineering,Jobs' },
  { search: 'cloud architect DevOps jobs remote', focus: 'Cloud & DevOps', tags: 'Cloud,DevOps,Remote,Jobs' },
  { search: 'data scientist big data jobs', focus: 'Data Science', tags: 'DataScience,BigData,Analytics,Jobs' },
  { search: 'cybersecurity analyst security engineer jobs', focus: 'Cybersecurity', tags: 'Cybersecurity,Security,InfoSec,Jobs' },
  { search: 'product manager UI/UX design tech jobs', focus: 'Product & Design', tags: 'Product,UI,UX,Design,Jobs' },
  { search: 'tech jobs Africa remote hybrid', focus: 'Global Tech Roles', tags: 'Tech,Remote,Africa,Global,Jobs' },
  { search: 'IT support network engineer jobs', focus: 'IT & Networking', tags: 'IT,Networking,Support,Jobs' },
  { search: 'robotics automation engineer jobs', focus: 'Robotics', tags: 'Robotics,Automation,Engineering,Jobs' },
  { search: 'blockchain Web3 developer jobs remote', focus: 'Web3 & Blockchain', tags: 'Web3,Blockchain,Remote,Jobs' },
  { search: 'mobile app developer iOS Android jobs', focus: 'Mobile Development', tags: 'Mobile,iOS,Android,Jobs' },
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

    const prompt = `You are writing a professional technical blog post for a portfolio website belonging to Hezekiah Olawale Ojenike, a Technology Professional, Developer, and Tech Enthusiast based in Nigeria with years of experience across hardware, software, AI, and global tech trends.

Write a detailed, engaging, and practical blog post about: "${topicData.topic}"

The blog post should:
- Sound like it was written by an experienced tech professional with real-world insights
- Include practical examples, analogies, or code snippets where relevant (use <pre><code> tags if applicable)
- Use proper HTML formatting with <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em> tags
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

    const prompt = `You are a tech news blogger writing for a portfolio blog owned by Hezekiah Olawale Ojenike, a Technology Professional based in Nigeria.

Today's date is ${today}. Write a tech news roundup blog post focused on: "${newsTopic}"

IMPORTANT RULES:
- Research and include the LATEST real news, announcements, and developments in this area
- Include specific company names, product names, version numbers, and dates where possible
- Mention real URLs/websites where readers can learn more (use <a href="URL" target="_blank"> tags)
- Cover 4-6 distinct news items or developments
- Use proper HTML formatting: <h2>, <h3>, <p>, <ul>, <li>, <strong>, <a>, <blockquote>
- Be between 500-800 words
- Write in an engaging, informative tone — like a senior tech professional summarizing the week's top stories
- End with a "Key Takeaways" section summarizing what people should pay attention to

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

    const prompt = `You are writing a tech job listings blog post for a portfolio blog owned by Hezekiah Olawale Ojenike, a Technology Professional based in Nigeria.

Today's date is ${today}. Write a job listings roundup post focused on: "${jobData.search}"

CRITICAL REQUIREMENTS:
1. List 8-12 REAL, CURRENT job openings that match this search across the global tech industry
2. For each job include: Job Title, Company Name, Location/Type (Remote/Hybrid/Onsite), Key Requirements, and an Application Link
3. Present the jobs in a CLEAN HTML TABLE with these columns:
   - Role / Title
   - Company
   - Type (Remote 🌍 / Hybrid 🏢 / Onsite 📍)
   - Key Requirements (2-3 bullet points)
   - Apply Link
4. VERY IMPORTANT - PREVENT BROKEN LINKS: Because specific job posting URLs often expire quickly or result in 404 errors, do NOT guess or hallucinate direct job URLs (like indeed.com/viewjob?jk=123). Instead, the "Apply Link" MUST be a dynamic SEARCH URL for that specific role or company. 
   For example:
   - <a href="https://www.linkedin.com/jobs/search?keywords=Company+Name+Job+Title" target="_blank">View on LinkedIn</a>
   - <a href="https://indeed.com/jobs?q=Company+Name+Job+Title" target="_blank">View on Indeed</a>
   - <a href="https://remoteok.com/remote-software-engineer-jobs" target="_blank">View on RemoteOK</a>
   - <a href="https://wellfound.com/jobs" target="_blank">View on Wellfound</a>
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

    const configuredModel = this.configService.get<string>('GEMINI_MODEL') || 'gemini-3.5-flash';
    const modelsToTry = [
      configuredModel,
      'gemini-3.5-flash',
      'gemini-2.5-flash',
      'gemini-flash-latest',
      'gemini-2.0-flash-lite',
      'gemini-2.0-flash',
      'gemini-pro-latest',
    ];
    const uniqueModels = Array.from(new Set(modelsToTry));

    let result: any = null;
    let lastError: any = null;
    let usedModelName = '';

    for (const modelName of uniqueModels) {
      try {
        this.logger.log(`🤖 Attempting content generation with model: ${modelName}...`);
        const model = this.genAI.getGenerativeModel({ model: modelName });
        result = await model.generateContent(prompt);
        usedModelName = modelName;
        break; // Successfully generated content
      } catch (err: any) {
        lastError = err;
        this.logger.warn(`⚠️  Model ${modelName} failed: ${err.message || err}`);
      }
    }

    if (!result) {
      this.logger.error(`❌ All models failed. Last error: ${lastError?.message || lastError}`);
      return { success: false, error: `All models failed: ${lastError?.message || lastError}` };
    }

    try {
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

      this.logger.log(`✅ Published [${category}] using ${usedModelName}: "${parsed.title}"`);
      return { success: true, title: parsed.title };
    } catch (error: any) {
      this.logger.error(`❌ Publishing failed: ${error.message}`);
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

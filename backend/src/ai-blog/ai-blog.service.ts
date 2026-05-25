import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { BlogService } from '../blog/blog.service';

// Topics relevant to Hezekiah's skills and expertise from his CV
const BLOG_TOPICS = [
  { topic: 'Python Django REST Framework', category: 'Backend', tags: 'Python,Django,REST API,Backend', readTime: '8' },
  { topic: 'Building scalable APIs with NestJS and TypeScript', category: 'Backend', tags: 'NestJS,TypeScript,API,Backend', readTime: '10' },
  { topic: 'MySQL database design and optimization tips', category: 'Database', tags: 'MySQL,Database,SQL,Optimization', readTime: '7' },
  { topic: 'Python data analysis with Pandas and NumPy', category: 'Data Analysis', tags: 'Python,Pandas,NumPy,DataAnalysis', readTime: '9' },
  { topic: 'Full-stack web development with PHP and MySQL', category: 'Web Development', tags: 'PHP,MySQL,FullStack,WebDev', readTime: '8' },
  { topic: 'JavaScript ES6+ features every developer should know', category: 'Frontend', tags: 'JavaScript,ES6,Frontend,WebDev', readTime: '6' },
  { topic: 'Building community finance apps with Django ORM', category: 'Backend', tags: 'Django,Python,FinTech,ORM', readTime: '10' },
  { topic: 'Creating advanced Excel dashboards for business reporting', category: 'Data Analysis', tags: 'Excel,DataAnalysis,Dashboards,Business', readTime: '7' },
  { topic: 'Responsive web design best practices with CSS3', category: 'Frontend', tags: 'CSS3,HTML5,Responsive,WebDesign', readTime: '6' },
  { topic: 'How to design and build a travel booking system', category: 'Web Development', tags: 'PHP,MySQL,JavaScript,WebApp', readTime: '11' },
  { topic: 'Teaching programming effectively: lessons from 5 years of experience', category: 'Education', tags: 'Teaching,Programming,Education,Mentorship', readTime: '8' },
  { topic: 'SQLite vs MySQL: choosing the right database for your project', category: 'Database', tags: 'SQLite,MySQL,Database,Backend', readTime: '7' },
  { topic: 'Next.js for full-stack development: a practical guide', category: 'Frontend', tags: 'NextJS,React,FullStack,JavaScript', readTime: '9' },
  { topic: 'Git and GitHub workflow for solo developers and teams', category: 'Tools', tags: 'Git,GitHub,DevTools,Workflow', readTime: '6' },
  { topic: 'Building a multi-user blog CMS with PHP and MySQL', category: 'Web Development', tags: 'PHP,MySQL,CMS,WebApp', readTime: '10' },
  { topic: 'REST API design principles every backend developer must know', category: 'Backend', tags: 'REST,API,Backend,BestPractices', readTime: '8' },
  { topic: 'Python automation scripts for everyday developer tasks', category: 'Backend', tags: 'Python,Automation,Scripting,Tools', readTime: '7' },
  { topic: 'Understanding AggroMarket: an agricultural e-commerce platform case study', category: 'Web Development', tags: 'NestJS,TypeScript,Ecommerce,CaseStudy', readTime: '9' },
  { topic: 'Bootstrap 5 component guide for rapid UI development', category: 'Frontend', tags: 'Bootstrap,CSS,HTML5,UI', readTime: '6' },
  { topic: 'Data visualization techniques with Python and Excel', category: 'Data Analysis', tags: 'Python,Excel,Visualization,DataAnalysis', readTime: '8' },
  { topic: 'cPanel hosting deployment guide for PHP and Node.js apps', category: 'DevOps', tags: 'cPanel,Hosting,PHP,Deployment', readTime: '7' },
  { topic: 'Building secure authentication systems in web applications', category: 'Security', tags: 'Security,Authentication,JWT,WebDev', readTime: '9' },
  { topic: 'How Agile methodology helped me deliver better software projects', category: 'Career', tags: 'Agile,Productivity,SoftwareDev,Career', readTime: '6' },
  { topic: 'Community savings apps: building Nigeria\'s informal finance sector digital tools', category: 'FinTech', tags: 'FinTech,Django,Nigeria,Finance', readTime: '10' },
  { topic: 'TypeScript strict mode: why you should always enable it', category: 'Backend', tags: 'TypeScript,BestPractices,JavaScript,Backend', readTime: '7' },
];

@Injectable()
export class AiBlogService {
  private readonly logger = new Logger(AiBlogService.name);
  private genAI: GoogleGenerativeAI | null = null;
  private usedTopicIndices: Set<number> = new Set();

  constructor(
    private configService: ConfigService,
    private blogService: BlogService,
  ) {
    const apiKey = this.configService.get<string>('GEMINI_API_KEY');
    if (apiKey) {
      this.genAI = new GoogleGenerativeAI(apiKey);
      this.logger.log('✅ AI Blog Service initialized with Gemini API');
    } else {
      this.logger.warn('⚠️  GEMINI_API_KEY not set. AI blog posting is disabled.');
    }
  }

  private getNextTopic(): (typeof BLOG_TOPICS)[0] {
    // Cycle through all topics before repeating
    if (this.usedTopicIndices.size >= BLOG_TOPICS.length) {
      this.usedTopicIndices.clear();
    }
    let index: number;
    do {
      // Pick a somewhat random but non-repeated topic
      const dayOfYear = Math.floor(
        (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) /
          86400000,
      );
      index = (dayOfYear + this.usedTopicIndices.size) % BLOG_TOPICS.length;
    } while (this.usedTopicIndices.has(index));

    this.usedTopicIndices.add(index);
    return BLOG_TOPICS[index];
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

  async generateAndPublishPost(): Promise<{ success: boolean; title?: string; error?: string }> {
    if (!this.genAI) {
      return { success: false, error: 'GEMINI_API_KEY not configured' };
    }

    const topicData = this.getNextTopic();
    this.logger.log(`🤖 Generating blog post about: "${topicData.topic}"`);

    try {
      const model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

      const prompt = `You are writing a professional technical blog post for a portfolio website belonging to Hezekiah Olawale Ojenike, a Full-Stack Developer, Python Engineer, Data Analyst, and Technical Instructor based in Nigeria with 3+ years of experience.

Write a detailed, engaging, and practical blog post about: "${topicData.topic}"

The blog post should:
- Sound like it was written by a senior Nigerian developer with real-world experience
- Include practical code examples where relevant (use <pre><code> tags)
- Use proper HTML formatting with <h2>, <h3>, <p>, <ul>, <li>, <strong>, <em>, <pre><code> tags
- Be between 600-900 words of actual content
- Have a compelling, specific title (not generic)
- Feel personal and experienced, not AI-generated
- Include at least 2 real-world examples or analogies
- End with a clear takeaway or call to action

Return ONLY a valid JSON object with these exact fields (no markdown, no backticks, just raw JSON):
{
  "title": "The exact blog post title",
  "excerpt": "A compelling 1-2 sentence summary of the post (plain text, no HTML)",
  "content": "The full HTML blog post content"
}`;

      const result = await model.generateContent(prompt);
      const responseText = result.response.text().trim();

      // Parse the JSON response
      let parsed: { title: string; excerpt: string; content: string };
      try {
        // Strip markdown code fences if model adds them
        const jsonStr = responseText
          .replace(/^```json\s*/i, '')
          .replace(/^```\s*/i, '')
          .replace(/```\s*$/i, '')
          .trim();
        parsed = JSON.parse(jsonStr);
      } catch {
        this.logger.error('Failed to parse AI response as JSON', responseText.substring(0, 200));
        return { success: false, error: 'Failed to parse AI response' };
      }

      if (!parsed.title || !parsed.content || !parsed.excerpt) {
        return { success: false, error: 'AI response missing required fields' };
      }

      const slug = this.generateSlug(parsed.title);

      // Pick a relevant cover image based on category
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
      };

      await this.blogService.create({
        title: parsed.title,
        slug,
        excerpt: parsed.excerpt,
        content: parsed.content,
        category: topicData.category,
        read_time: topicData.readTime,
        tags: topicData.tags,
        published: true,
        cover_image: coverImages[topicData.category] || coverImages['Web Development'],
      });

      this.logger.log(`✅ Blog post published: "${parsed.title}"`);
      return { success: true, title: parsed.title };
    } catch (error: any) {
      this.logger.error(`❌ Failed to generate blog post: ${error.message}`);
      return { success: false, error: error.message };
    }
  }
}

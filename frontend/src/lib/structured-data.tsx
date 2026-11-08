/**
 * JSON-LD Structured Data Utilities
 * Schema.org markup for SEO and rich snippets
 */

import type { Metadata } from 'next';

// ══════════════════════════════════════════════════════════════
// BASE SCHEMAS
// ══════════════════════════════════════════════════════════════

export const siteUrl = 'https://hezekiah.dev';
export const authorName = 'Hezekiah Olawale Ojenike';
export const authorHandle = '@ProfHezzy';

export const personSchema = {
  '@context': 'https://schema.org',
  '@type': 'Person',
  name: authorName,
  url: siteUrl,
  image: `${siteUrl}/avatar.jpg`,
  sameAs: [
    'https://github.com/ProfHezzy',
    'https://linkedin.com/in/hezekiahojenike',
    'https://twitter.com/hezekiah_dev',
  ],
  jobTitle: 'Full-Stack Developer',
  worksFor: {
    '@type': 'Organization',
    name: 'Freelance / Contract',
  },
  knowsAbout: [
    'Full-Stack Development',
    'Python',
    'Django',
    'JavaScript',
    'TypeScript',
    'Next.js',
    'NestJS',
    'PostgreSQL',
    'MySQL',
    'Data Analysis',
    'Pandas',
    'NumPy',
    'Technical Instruction',
    'Mentoring',
  ],
  description: 'Full-Stack Developer and Technical Instructor based in Nigeria. Specializing in building scalable web applications, backend systems, and data-driven tools.',
  email: 'mailto:hezekiahonline94@gmail.com',
  address: {
    '@type': 'PostalAddress',
    addressLocality: 'Ibarapa North',
    addressRegion: 'Oyo State',
    addressCountry: 'NG',
  },
};

export const webSiteSchema = {
  '@context': 'https://schema.org',
  '@type': 'WebSite',
  name: 'HOO Portfolio',
  url: siteUrl,
  description: 'Portfolio of Hezekiah Olawale Ojenike — Full-Stack Developer & Technical Instructor',
  publisher: {
    '@type': 'Person',
    name: authorName,
  },
  potentialAction: {
    '@type': 'SearchAction',
    target: {
      '@type': 'EntryPoint',
      urlTemplate: `${siteUrl}/blog?q={search_term_string}`,
    },
    'query-input': 'required name=search_term_string',
  },
};

export const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'HOO Portfolio',
  url: siteUrl,
  logo: `${siteUrl}/logo.png`,
  sameAs: [
    'https://github.com/ProfHezzy',
    'https://linkedin.com/in/hezekiahojenike',
    'https://twitter.com/hezekiah_dev',
  ],
  founder: {
    '@type': 'Person',
    name: authorName,
  },
};

// ══════════════════════════════════════════════════════════════
// BLOG POST SCHEMA
// ══════════════════════════════════════════════════════════════

export interface BlogPostData {
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  category: string;
  tags?: string[];
  readTime: string;
  publishedAt: string;
  updatedAt?: string;
  author?: {
    name: string;
    url: string;
  };
}

export function generateBlogPostSchema(data: BlogPostData) {
  const url = `${siteUrl}/blog/${data.slug}`;
  const image = data.coverImage || `${siteUrl}/og-image.png`;

  return {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: data.title,
    description: data.excerpt,
    image: {
      '@type': 'ImageObject',
      url: image,
      width: 1200,
      height: 630,
    },
    url,
    datePublished: data.publishedAt,
    dateModified: data.updatedAt || data.publishedAt,
    author: {
      '@type': 'Person',
      name: data.author?.name || authorName,
      url: data.author?.url || siteUrl,
    },
    publisher: {
      '@type': 'Organization',
      name: 'HOO Portfolio',
      logo: {
        '@type': 'ImageObject',
        url: `${siteUrl}/logo.png`,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': url,
    },
    articleSection: data.category,
    keywords: data.tags?.join(', ') || '',
    timeRequired: `PT${data.readTime}M`,
    inLanguage: 'en-US',
    isAccessibleForFree: true,
  };
}

// ══════════════════════════════════════════════════════════════
// PROJECT SCHEMA
// ══════════════════════════════════════════════════════════════

export interface ProjectData {
  title: string;
  slug: string;
  description: string;
  image?: string;
  category: string;
  techStack: string[];
  githubUrl?: string;
  liveUrl?: string;
  featured: boolean;
}

export function generateProjectSchema(data: ProjectData) {
  const url = `${siteUrl}/projects/${data.slug}`;
  const image = data.image || `${siteUrl}/og-image.png`;

  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: data.title,
    description: data.description,
    image: {
      '@type': 'ImageObject',
      url: image,
      width: 800,
      height: 600,
    },
    url,
    creator: {
      '@type': 'Person',
      name: authorName,
      url: siteUrl,
    },
    genre: data.category,
    keywords: data.techStack.join(', '),
    license: 'https://creativecommons.org/licenses/by/4.0/',
    ...(data.githubUrl && {
      codeRepository: data.githubUrl,
    }),
    ...(data.liveUrl && {
      url: data.liveUrl,
    }),
  };
}

// ══════════════════════════════════════════════════════════════
// BREADCRUMB SCHEMA
// ══════════════════════════════════════════════════════════════

export interface BreadcrumbItem {
  name: string;
  url: string;
}

export function generateBreadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: items.map((item, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: item.name,
      item: item.url.startsWith('http') ? item.url : `${siteUrl}${item.url}`,
    })),
  };
}

// ══════════════════════════════════════════════════════════════
// FAQ SCHEMA
// ══════════════════════════════════════════════════════════════

export interface FAQItem {
  question: string;
  answer: string;
}

export function generateFAQSchema(items: FAQItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: items.map((item) => ({
      '@type': 'Question',
      name: item.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: item.answer,
      },
    })),
  };
}

// ══════════════════════════════════════════════════════════════
// HELPER: Combine multiple schemas
// ══════════════════════════════════════════════════════════════

export function combineSchemas(...schemas: object[]) {
  return {
    '@context': 'https://schema.org',
    '@graph': schemas,
  };
}

// ══════════════════════════════════════════════════════════════
// REACT COMPONENT FOR INLINE SCRIPTS
// ══════════════════════════════════════════════════════════════

export function StructuredData({ data }: { data: object | object[] }) {
  const schemas = Array.isArray(data) ? data : [data];

  return (
    <script
      type={"application/ld+json"}
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(combineSchemas(...schemas), null, 2),
      }}
    />
  );
}
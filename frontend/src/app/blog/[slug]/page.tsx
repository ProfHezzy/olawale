import { Metadata } from 'next';
import api from '@/lib/api';
import BlogClient from './BlogClient';
import { use } from 'react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await api.get(`/blog/${slug}`);
    const post = res.data;
    return {
      title: `${post.title} | Hezekiah Olawale Ojenike`,
      description: post.excerpt || post.description,
      openGraph: {
        title: post.title,
        description: post.excerpt || post.description,
        images: post.cover_image ? [{ url: post.cover_image }] : [],
        type: 'article',
      },
      twitter: {
        card: 'summary_large_image',
        title: post.title,
        description: post.excerpt || post.description,
        images: post.cover_image ? [post.cover_image] : [],
      }
    };
  } catch (e) {
    return { title: 'Blog Post' };
  }
}

export default function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <BlogClient slug={slug} />;
}

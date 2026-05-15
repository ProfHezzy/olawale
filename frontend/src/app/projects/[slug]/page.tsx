import { Metadata } from 'next';
import api from '@/lib/api';
import ProjectClient from './ProjectClient';
import { use } from 'react';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  try {
    const res = await api.get(`/projects/${slug}`);
    const project = res.data;
    return {
      title: `${project.title} | Projects | Hezekiah Olawale Ojenike`,
      description: project.description,
      openGraph: {
        title: project.title,
        description: project.description,
        images: project.image ? [{ url: project.image }] : [],
        type: 'website',
      },
      twitter: {
        card: 'summary_large_image',
        title: project.title,
        description: project.description,
        images: project.image ? [project.image] : [],
      }
    };
  } catch (e) {
    return { title: 'Project Details' };
  }
}

export default function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  return <ProjectClient slug={slug} />;
}

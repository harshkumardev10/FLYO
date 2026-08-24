import { Metadata } from 'next';
import { PORTFOLIO_DATA } from '@/lib/data/work';
import { WorkProject } from '@/lib/types/seo';
import WorkPageClient from './WorkPageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flyoo.vercel.app';
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'flyo-1863c';

interface WorkPageProps {
  params: { slug: string };
}

async function fetchProject(slug: string): Promise<WorkProject | null> {
  const staticProj = PORTFOLIO_DATA.find((p) => p.slug === slug);
  if (staticProj) return staticProj;

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/projects/${encodeURIComponent(slug)}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;

    const json = await res.json();
    if (!json.fields) return null;

    const f = json.fields;
    const get = (key: string) => f[key]?.stringValue ?? '';

    return {
      slug: get('slug') || slug,
      title: get('title'),
      clientName: get('clientName'),
      category: (get('category') as any) || 'Websites',
      service: get('service'),
      shortDescription: get('shortDescription'),
      challenge: get('challenge'),
      whatWeDid: f.whatWeDid?.arrayValue?.values?.map((v: any) => v.stringValue) || [],
      finalResult: get('finalResult'),
      heroImage: get('heroImage'),
      measurableResult: get('measurableResult') || undefined,
    };
  } catch {
    return null;
  }
}

export async function generateMetadata({ params }: WorkPageProps): Promise<Metadata> {
  const project = await fetchProject(params.slug);

  if (!project) {
    return {
      title: 'Project Not Found',
      description: 'The requested project could not be found.',
    };
  }

  const cleanTitle = `${project.title} Case Study`;
  let desc = `${project.shortDescription} Discover how flyoo businesses scaled ${project.title}.`;
  if (desc.length > 130) {
    desc = desc.slice(0, 127).trim() + '...';
  }

  const pageUrl = `${SITE_URL}/work/${project.slug}`;
  const ogImage = project.heroImage || `${SITE_URL}/kingfisher-logo.jpg`;

  return {
    title: cleanTitle,
    description: desc,
    openGraph: {
      type: 'article',
      url: pageUrl,
      title: cleanTitle,
      description: desc,
      siteName: 'flyoo businesses',
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: project.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: cleanTitle,
      description: desc,
      images: [ogImage],
      site: '@flyoobusinesses',
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function WorkDetailPage({ params }: WorkPageProps) {
  const initialProject = await fetchProject(params.slug);
  return <WorkPageClient slug={params.slug} initialProject={initialProject} />;
}

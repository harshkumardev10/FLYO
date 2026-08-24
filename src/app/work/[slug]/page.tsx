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
      title: 'Project Not Found | flyoo businesses',
      description: 'The requested project could not be found.',
    };
  }

  const pageUrl = `${SITE_URL}/work/${project.slug}`;
  const ogImage = project.heroImage || `${SITE_URL}/kingfisher-logo.jpg`;

  return {
    title: `${project.title} - Case Study | flyoo businesses`,
    description: `${project.shortDescription} Discover how flyoo businesses built and scaled ${project.title} with high-converting web design and business growth strategies.`,
    openGraph: {
      type: 'article',
      url: pageUrl,
      title: `${project.title} | flyoo businesses Client Case Study`,
      description: project.shortDescription,
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
      title: `${project.title} | flyoo businesses`,
      description: project.shortDescription,
      images: [ogImage],
      site: '@flyodigital',
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

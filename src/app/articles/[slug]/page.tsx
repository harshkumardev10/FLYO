// SERVER COMPONENT — no 'use client' here
// Generates Open Graph / Twitter Card meta tags so sharing the URL
// automatically shows the article image on WhatsApp, Telegram, Twitter, etc.

import { Metadata } from 'next';
import { ARTICLES_DATA } from '@/lib/data/articles';
import { ArticleItem } from '@/lib/types/seo';
import ArticlePageClient from './ArticlePageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flyodigital.com';
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'flyo-1863c';

interface ArticlePageProps {
  params: { slug: string };
}

/**
 * Fetch article: first check static data, then try Firestore REST API
 */
async function fetchArticle(slug: string): Promise<ArticleItem | null> {
  // 1. Check static bundle first (instant, no network)
  const staticArt = ARTICLES_DATA.find((a) => a.slug === slug);
  if (staticArt) return staticArt;

  // 2. Fallback: Firestore REST API (for dynamically-uploaded articles)
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/articles/${encodeURIComponent(slug)}`;
    const res = await fetch(url, { next: { revalidate: 60 } });
    if (!res.ok) return null;

    const json = await res.json();
    if (!json.fields) return null;

    // Map Firestore field format to ArticleItem
    const f = json.fields;
    const get = (key: string) => f[key]?.stringValue ?? f[key]?.integerValue ?? '';

    return {
      slug: get('slug') || slug,
      title: get('title'),
      summary: get('summary'),
      category: get('category') as ArticleItem['category'],
      publishedAt: get('publishedAt'),
      authorName: get('authorName'),
      authorRole: get('authorRole'),
      readingTimeMinutes: Number(f.readingTimeMinutes?.integerValue ?? 5),
      heroImage: get('heroImage'),
      contentHtml: get('contentHtml'),
      relatedServiceSlug: get('relatedServiceSlug') || undefined,
      status: (get('status') as ArticleItem['status']) || undefined,
      submittedBy: get('submittedBy') || undefined,
    };
  } catch {
    return null;
  }
}

/* ── Open Graph / Twitter Card metadata ─────────────────────────────── */
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await fetchArticle(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found | FLYO',
      description: 'This article could not be found.',
    };
  }

  const pageUrl = `${SITE_URL}/articles/${article.slug}`;
  const ogImage = article.heroImage || `${SITE_URL}/icon.png`;

  return {
    title: `${article.title} | FLYO`,
    description: article.summary,
    openGraph: {
      type: 'article',
      url: pageUrl,
      title: `${article.title} | FLYO`,
      description: article.summary,
      siteName: 'FLYO',
      publishedTime: article.publishedAt,
      authors: [article.authorName],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: article.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${article.title} | FLYO`,
      description: article.summary,
      images: [ogImage],
      site: '@flyodigital',
    },
    alternates: {
      canonical: pageUrl,
    },
  };
}

/* ── Page component (server) ─────────────────────────────────────────── */
export default async function ArticleDetailPage({ params }: ArticlePageProps) {
  // Pre-fetch article server-side so the client component has an initial value
  // (avoids flash of "not found" before Firestore sync)
  const initialArticle = await fetchArticle(params.slug);

  return <ArticlePageClient slug={params.slug} initialArticle={initialArticle} />;
}

// SERVER COMPONENT — no 'use client' here
// Generates Open Graph / Twitter Card meta tags and Schema.org JSON-LD (Article + FAQPage)

import { Metadata } from 'next';
import { ARTICLES_DATA } from '@/lib/data/articles';
import { ArticleItem } from '@/lib/types/seo';
import { generateArticleSchema, generateFAQSchema } from '@/lib/seo/schemas';
import { getOrGenerateArticleFaqs } from '@/lib/utils/faqGenerator';
import ArticlePageClient from './ArticlePageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flyodigital.com';
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'flyo-1863c';

interface ArticlePageProps {
  params: { slug: string };
}

/**
 * Fetch article: first check static bundle, then try Firestore REST API
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

    // Parse FAQs array from firestore REST format if present
    let parsedFaqs: Array<{ question: string; answer: string }> | undefined = undefined;
    if (f.faqs?.arrayValue?.values) {
      parsedFaqs = f.faqs.arrayValue.values
        .map((v: any) => {
          const q = v.mapValue?.fields?.question?.stringValue || '';
          const a = v.mapValue?.fields?.answer?.stringValue || '';
          return q && a ? { question: q, answer: a } : null;
        })
        .filter(Boolean);
    }

    return {
      slug: get('slug') || slug,
      title: get('title'),
      metaTitle: get('metaTitle') || undefined,
      metaDescription: get('metaDescription') || undefined,
      summary: get('summary'),
      category: get('category') as ArticleItem['category'],
      publishedAt: get('publishedAt'),
      authorName: get('authorName'),
      authorRole: get('authorRole'),
      readingTimeMinutes: Number(f.readingTimeMinutes?.integerValue ?? 5),
      heroImage: get('heroImage'),
      heroImageAlt: get('heroImageAlt') || undefined,
      contentHtml: get('contentHtml'),
      relatedServiceSlug: get('relatedServiceSlug') || undefined,
      status: (get('status') as ArticleItem['status']) || undefined,
      submittedBy: get('submittedBy') || undefined,
      faqs: parsedFaqs,
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
      title: 'Article Not Found | flyoo businesses',
      description: 'This article could not be found.',
    };
  }

  const pageTitle = article.metaTitle ? `${article.metaTitle} | flyoo businesses` : `${article.title} | flyoo businesses`;
  const pageDescription = article.metaDescription || article.summary;
  const pageUrl = `${SITE_URL}/articles/${article.slug}`;
  const ogImage = article.heroImage || `${SITE_URL}/icon.png`;
  const imageAlt = article.heroImageAlt || article.title;

  return {
    title: pageTitle,
    description: pageDescription,
    openGraph: {
      type: 'article',
      url: pageUrl,
      title: pageTitle,
      description: pageDescription,
      siteName: 'flyoo businesses',
      publishedTime: article.publishedAt,
      authors: [article.authorName],
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: imageAlt,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: pageTitle,
      description: pageDescription,
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
  // Pre-fetch article server-side
  const initialArticle = await fetchArticle(params.slug);

  const pageUrl = initialArticle ? `${SITE_URL}/articles/${initialArticle.slug}` : `${SITE_URL}/articles/${params.slug}`;
  const articleSchema = initialArticle ? generateArticleSchema(initialArticle, pageUrl) : null;
  const manualFaqs = initialArticle?.faqs && initialArticle.faqs.length > 0 ? initialArticle.faqs.filter((f) => f.question?.trim() && f.answer?.trim()) : [];
  const faqSchema = manualFaqs.length > 0 ? generateFAQSchema(manualFaqs) : null;

  return (
    <>
      {/* Schema.org Structured Data */}
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
        />
      )}
      <ArticlePageClient slug={params.slug} initialArticle={initialArticle} />
    </>
  );
}

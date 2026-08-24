// SERVER COMPONENT — no 'use client' here
// Generates Open Graph / Twitter Card meta tags and Schema.org JSON-LD (Article + FAQPage)

import { Metadata } from 'next';
import { ARTICLES_DATA } from '@/lib/data/articles';
import { ArticleItem } from '@/lib/types/seo';
import { generateArticleSchema, generateFAQSchema } from '@/lib/seo/schemas';
import { getOrGenerateArticleFaqs } from '@/lib/utils/faqGenerator';
import ArticlePageClient from './ArticlePageClient';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flyoo.vercel.app';
const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'flyo-1863c';

interface ArticlePageProps {
  params: { slug: string };
}

/**
 * Fetch article: checks live Firebase Firestore first for publisher updates,
 * then falls back to the static bundle if not found in Firestore.
 */
async function fetchArticle(slug: string): Promise<ArticleItem | null> {
  // 1. Check live Firebase Firestore REST API first (captures any publisher updates immediately)
  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/articles/${encodeURIComponent(slug)}`;
    const res = await fetch(url, {
      next: { revalidate: 0 }, // always fresh so SEO and content update instantly
    });

    if (res.ok) {
      const json = await res.json();
      if (json.fields) {
        const f = json.fields;
        const get = (key: string) => f[key]?.stringValue ?? f[key]?.integerValue ?? '';

        // Parse FAQs array from Firestore REST format if present
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

        // Parse keywords array if present
        let parsedKeywords: string[] | undefined = undefined;
        if (f.keywords?.arrayValue?.values) {
          parsedKeywords = f.keywords.arrayValue.values
            .map((v: any) => v.stringValue || '')
            .filter(Boolean);
        }

        const status = (get('status') as ArticleItem['status']) || 'approved';
        // Only return if not unapproved/rejected
        if (status === 'approved' || !get('status')) {
          return {
            slug: get('slug') || slug,
            title: get('title'),
            metaTitle: get('metaTitle') || undefined,
            metaDescription: get('metaDescription') || undefined,
            summary: get('summary'),
            category: (get('category') as ArticleItem['category']) || 'SEO',
            publishedAt: get('publishedAt') || new Date().toISOString().split('T')[0],
            updatedAt: get('updatedAt') || undefined,
            authorName: get('authorName') || 'flyoo businesses Team',
            authorRole: get('authorRole') || 'Digital Strategist',
            readingTimeMinutes: Number(f.readingTimeMinutes?.integerValue ?? 5),
            heroImage: get('heroImage'),
            heroImageAlt: get('heroImageAlt') || undefined,
            contentHtml: get('contentHtml'),
            relatedServiceSlug: get('relatedServiceSlug') || undefined,
            status,
            submittedBy: get('submittedBy') || undefined,
            keywords: parsedKeywords,
            faqs: parsedFaqs,
          };
        }
      }
    }
  } catch (e) {
    // network or parse error, proceed to fallback
  }

  // 2. Fallback: static bundle (instant, reliable fallback)
  const staticArt = ARTICLES_DATA.find((a) => a.slug === slug);
  if (staticArt) return staticArt;

  return null;
}


/* ── Open Graph / Twitter Card metadata ─────────────────────────────── */
export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await fetchArticle(params.slug);

  if (!article) {
    return {
      title: 'Article Not Found',
      description: 'This article could not be found.',
    };
  }

  // Clean title without repeating brand name (layout template will add | flyoo businesses)
  let cleanTitle = (article.metaTitle || article.title)
    .replace(/\s*\|\s*flyoo\s*businesses/gi, '')
    .replace(/\s*\|\s*flyoo/gi, '')
    .replace(/\s*\|\s*flyo/gi, '')
    .trim();

  // Strict clamp: max 36 chars so "<cleanTitle> | flyoo businesses" <= 55 chars
  if (cleanTitle.length > 36) {
    const cut = cleanTitle.substring(0, 36);
    const lastSpace = cut.lastIndexOf(' ');
    cleanTitle = (lastSpace > 20 ? cut.substring(0, lastSpace) : cut).trim();
  }

  // Concise description (110-130 chars)
  let pageDescription = article.metaDescription || article.summary;
  if (pageDescription.length > 130) {
    pageDescription = pageDescription.slice(0, 127).trim() + '...';
  }

  const pageUrl = `${SITE_URL}/articles/${article.slug}`;
  const ogImage = article.heroImage || `${SITE_URL}/icon.png`;
  const imageAlt = article.heroImageAlt || article.title;

  return {
    title: cleanTitle,
    description: pageDescription,
    openGraph: {
      type: 'article',
      url: pageUrl,
      title: cleanTitle,
      description: pageDescription,
      siteName: 'flyoo businesses',
      publishedTime: article.publishedAt,
      modifiedTime: article.updatedAt || article.publishedAt,
      tags: article.keywords || ['flyoo', 'flyoo businesses', 'business grow', 'local seo', article.category],
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
      title: cleanTitle,
      description: pageDescription,
      images: [ogImage],
      site: '@flyoobusinesses',
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

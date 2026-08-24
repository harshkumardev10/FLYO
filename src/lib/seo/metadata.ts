import { Metadata } from 'next';
import { COMPANY_INFO } from '@/lib/data/company';
import { SEOData } from '@/lib/types/seo';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || COMPANY_INFO.url;

export function generatePageMetadata(data: SEOData): Metadata {
  const canonical = data.canonicalUrl
    ? (data.canonicalUrl.startsWith('http') ? data.canonicalUrl : `${BASE_URL}${data.canonicalUrl}`)
    : BASE_URL;

  // Clean title to prevent duplicate "| flyoo businesses" suffixes and keep strictly under 55 chars
  let cleanTitle = data.title
    .replace(/\s*\|\s*flyoo\s*businesses/gi, '')
    .replace(/\s*\|\s*flyoo/gi, '')
    .replace(/\s*\|\s*flyo/gi, '')
    .trim();
  if (!cleanTitle) cleanTitle = 'Business Grow & Local SEO';

  return {
    title: cleanTitle,
    description: data.description,
    alternates: {
      canonical,
      languages: {
        'en-IN': canonical,
        'en': canonical,
        'x-default': canonical,
      },
    },
    robots: data.noindex
      ? {
          index: false,
          follow: false,
          nocache: true,
          googleBot: {
            index: false,
            follow: false,
          },
        }
      : {
          index: true,
          follow: true,
          googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
          },
        },
    openGraph: {
      title: data.openGraph?.title || cleanTitle,
      description: data.openGraph?.description || data.description,
      url: canonical,
      siteName: COMPANY_INFO.name,
      type: data.openGraph?.type || 'website',
      images: data.openGraph?.images || [
        {
          url: `${BASE_URL}/kingfisher-logo.jpg`,
          width: 1200,
          height: 630,
          alt: `${COMPANY_INFO.name} - Make Your Business Fly & Grow Online`,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: data.openGraph?.title || cleanTitle,
      description: data.openGraph?.description || data.description,
      site: '@flyoobusinesses',
      creator: '@flyoobusinesses',
      images: [data.openGraph?.images?.[0]?.url || `${BASE_URL}/kingfisher-logo.jpg`],
    },
  };
}

export function generateServiceMetadata(data: SEOData): Metadata {
  return generatePageMetadata(data);
}

export function generateArticleMetadata(data: SEOData): Metadata {
  return generatePageMetadata({
    ...data,
    openGraph: {
      ...data.openGraph,
      type: 'article',
    },
  });
}

export function generateIndustryMetadata(data: SEOData): Metadata {
  return generatePageMetadata(data);
}

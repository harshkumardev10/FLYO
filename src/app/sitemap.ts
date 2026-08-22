import { MetadataRoute } from 'next';
import { SERVICES_DATA } from '@/lib/data/services';
import { ARTICLES_DATA } from '@/lib/data/articles';

// IMPORTANT: This must match your Vercel deployment URL exactly.
// Also set NEXT_PUBLIC_SITE_URL in your Vercel project environment variables.
const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flyoo.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // ── 1. Core static pages ────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`,          changeFrequency: 'weekly'  as const, priority: 1.0 },
    { url: `${BASE_URL}/about`,    changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE_URL}/services`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${BASE_URL}/work`,     changeFrequency: 'monthly' as const, priority: 0.7 },
    { url: `${BASE_URL}/articles`, changeFrequency: 'weekly'  as const, priority: 0.8 },
    { url: `${BASE_URL}/contact`,  changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${BASE_URL}/privacy`,  changeFrequency: 'yearly'  as const, priority: 0.3 },
    { url: `${BASE_URL}/terms`,    changeFrequency: 'yearly'  as const, priority: 0.3 },
  ].map(page => ({ ...page, lastModified: now }));

  // ── 2. Service detail pages ─────────────────────────────────────────────
  const servicePages: MetadataRoute.Sitemap = SERVICES_DATA.map(service => ({
    url: `${BASE_URL}/services/${service.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.9,
  }));

  // ── 3. Core Knowledge Base guides ───────────────────────────────────────
  const articlePages: MetadataRoute.Sitemap = ARTICLES_DATA.map(art => ({
    url: `${BASE_URL}/articles/${art.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    ...staticPages,
    ...servicePages,
    ...articlePages,
  ];
}

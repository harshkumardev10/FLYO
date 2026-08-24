import { MetadataRoute } from 'next';
import { SERVICES_DATA } from '@/lib/data/services';
import { ARTICLES_DATA } from '@/lib/data/articles';
import { PORTFOLIO_DATA } from '@/lib/data/work';

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://flyoo.vercel.app';

const FIREBASE_PROJECT_ID = process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID || 'flyo-1863c';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date().toISOString();

  // ── 1. Core static pages ────────────────────────────────────────────────
  const staticPages: MetadataRoute.Sitemap = [
    { url: `${BASE_URL}`,          changeFrequency: 'weekly'  as const, priority: 1.0 },
    { url: `${BASE_URL}/about`,    changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE_URL}/services`, changeFrequency: 'monthly' as const, priority: 0.9 },
    { url: `${BASE_URL}/work`,     changeFrequency: 'monthly' as const, priority: 0.8 },
    { url: `${BASE_URL}/articles`, changeFrequency: 'weekly'  as const, priority: 0.9 },
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

  // ── 3. Knowledge Base guides (merged from Firestore live + static fallback)
  let allArticleSlugs: Array<{ slug: string; lastModified: string }> = ARTICLES_DATA.map(a => ({
    slug: a.slug,
    lastModified: now,
  }));

  try {
    const url = `https://firestore.googleapis.com/v1/projects/${FIREBASE_PROJECT_ID}/databases/(default)/documents/articles`;
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (res.ok) {
      const json = await res.json();
      if (json.documents && Array.isArray(json.documents)) {
        const firestoreArticles = json.documents.map((doc: any) => {
          const f = doc.fields || {};
          const slug = f.slug?.stringValue || doc.name.split('/').pop();
          const status = f.status?.stringValue || 'approved';
          const updatedAt = f.updatedAt?.stringValue || f.publishedAt?.stringValue || now;
          return { slug, status, lastModified: updatedAt };
        }).filter((a: any) => a.status === 'approved' && a.slug);

        // Merge: override static slugs with firestore slugs and add new ones
        const firestoreSlugMap = new Map(firestoreArticles.map((a: any) => [a.slug, a.lastModified]));
        const staticList = ARTICLES_DATA.map(a => ({
          slug: a.slug,
          lastModified: firestoreSlugMap.get(a.slug) || now,
        }));
        const newFirestoreList = firestoreArticles
          .filter((fa: any) => !ARTICLES_DATA.some(sa => sa.slug === fa.slug))
          .map((fa: any) => ({ slug: fa.slug, lastModified: fa.lastModified }));

        allArticleSlugs = [...staticList, ...newFirestoreList];
      }
    }
  } catch (e) {
    // network fallback: use static list
  }

  const articlePages: MetadataRoute.Sitemap = allArticleSlugs.map(art => ({
    url: `${BASE_URL}/articles/${art.slug}`,
    lastModified: art.lastModified,
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  // ── 4. Portfolio Case Studies ───────────────────────────────────────────
  const workPages: MetadataRoute.Sitemap = PORTFOLIO_DATA.map(proj => ({
    url: `${BASE_URL}/work/${proj.slug}`,
    lastModified: now,
    changeFrequency: 'monthly' as const,
    priority: 0.7,
  }));

  return [
    ...staticPages,
    ...servicePages,
    ...articlePages,
    ...workPages,
  ];
}


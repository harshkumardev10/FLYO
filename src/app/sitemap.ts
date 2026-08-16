import { MetadataRoute } from 'next';
import { COMPANY_INFO } from '@/lib/data/company';
import { SERVICES_DATA } from '@/lib/data/services';
import { PORTFOLIO_DATA } from '@/lib/data/work';
import { ARTICLES_DATA } from '@/lib/data/articles';

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || COMPANY_INFO.url;
  const currentDate = new Date().toISOString();

  // Core Static Routes
  const staticRoutes: MetadataRoute.Sitemap = [
    '',
    '/services',
    '/work',
    '/articles',
    '/about',
    '/contact',
    '/privacy',
    '/terms',
  ].map(route => ({
    url: `${baseUrl}${route}`,
    lastModified: currentDate,
    changeFrequency: route === '' ? 'weekly' : 'monthly',
    priority: route === '' ? 1.0 : 0.8,
  }));

  // Service Routes (7)
  const serviceRoutes: MetadataRoute.Sitemap = SERVICES_DATA.map(service => ({
    url: `${baseUrl}/services/${service.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.9,
  }));

  // Work Case Study Routes
  const workRoutes: MetadataRoute.Sitemap = PORTFOLIO_DATA.map(p => ({
    url: `${baseUrl}/work/${p.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Article Routes
  const articleRoutes: MetadataRoute.Sitemap = ARTICLES_DATA.map(a => ({
    url: `${baseUrl}/articles/${a.slug}`,
    lastModified: currentDate,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  return [
    ...staticRoutes,
    ...serviceRoutes,
    ...workRoutes,
    ...articleRoutes,
  ];
}

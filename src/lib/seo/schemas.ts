import { COMPANY_INFO } from '@/lib/data/company';
import { ServiceItem, ArticleItem, BreadcrumbItem, WorkProject } from '@/lib/types/seo';

/**
 * Generate Schema.org Organization & LocalBusiness JSON-LD
 */
export function generateOrganizationSchema() {
  return {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Organization',
        '@id': `${COMPANY_INFO.url}/#organization`,
        name: COMPANY_INFO.name,
        legalName: COMPANY_INFO.legalName,
        url: COMPANY_INFO.url,
        logo: COMPANY_INFO.logo,
        email: COMPANY_INFO.email,
        telephone: COMPANY_INFO.phone,
        sameAs: COMPANY_INFO.sameAs,
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${COMPANY_INFO.url}/#localbusiness`,
        name: COMPANY_INFO.name,
        description: COMPANY_INFO.description,
        url: COMPANY_INFO.url,
        telephone: COMPANY_INFO.phone,
        email: COMPANY_INFO.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: COMPANY_INFO.address.streetAddress,
          addressLocality: COMPANY_INFO.address.addressLocality,
          addressRegion: COMPANY_INFO.address.addressRegion,
          postalCode: COMPANY_INFO.address.postalCode,
          addressCountry: COMPANY_INFO.address.addressCountry,
        },
        areaServed: COMPANY_INFO.serviceArea.map(area => ({
          '@type': 'AdministrativeArea',
          name: area,
        })),
        parentOrganization: {
          '@id': `${COMPANY_INFO.url}/#organization`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${COMPANY_INFO.url}/#website`,
        url: COMPANY_INFO.url,
        name: COMPANY_INFO.name,
        description: COMPANY_INFO.description,
        publisher: {
          '@id': `${COMPANY_INFO.url}/#organization`,
        },
        inLanguage: 'en-US',
      },
    ],
  };
}

/**
 * Generate Schema.org BreadcrumbList JSON-LD
 */
export function generateBreadcrumbSchema(breadcrumbs: BreadcrumbItem[]) {
  return {
    '@context': 'https://schema.org',
    '@type': 'BreadcrumbList',
    itemListElement: breadcrumbs.map((crumb, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      name: crumb.name,
      item: crumb.item.startsWith('http') ? crumb.item : `${COMPANY_INFO.url}${crumb.item}`,
    })),
  };
}

/**
 * Generate Schema.org Service JSON-LD
 */
export function generateServiceSchema(service: ServiceItem, pageUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Service',
    '@id': `${pageUrl}/#service`,
    name: service.title,
    description: service.shortDescription,
    provider: {
      '@type': 'LocalBusiness',
      '@id': `${COMPANY_INFO.url}/#localbusiness`,
      name: COMPANY_INFO.name,
    },
  };
}

/**
 * Generate Schema.org FAQPage JSON-LD
 */
export function generateFAQSchema(faqs?: Array<{ question: string; answer: string }>) {
  if (!faqs || faqs.length === 0) return null;
  return {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((faq) => ({
      '@type': 'Question',
      name: faq.question,
      acceptedAnswer: {
        '@type': 'Answer',
        text: faq.answer,
      },
    })),
  };
}

/**
 * Generate Schema.org Article JSON-LD
 */
export function generateArticleSchema(article: ArticleItem, articleUrl: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${articleUrl}/#article`,
    headline: article.title,
    description: article.summary,
    image: article.heroImage,
    datePublished: article.publishedAt,
    author: {
      '@type': 'Person',
      name: article.authorName,
      jobTitle: article.authorRole,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${COMPANY_INFO.url}/#organization`,
      name: COMPANY_INFO.name,
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };
}

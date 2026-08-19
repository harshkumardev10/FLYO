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
        alternateName: COMPANY_INFO.alternateName,
        url: COMPANY_INFO.url,
        logo: {
          '@type': 'ImageObject',
          url: COMPANY_INFO.logo,
          width: 512,
          height: 512,
        },
        email: COMPANY_INFO.email,
        telephone: COMPANY_INFO.phone,
        foundingDate: COMPANY_INFO.foundingYear,
        sameAs: COMPANY_INFO.sameAs,
        founder: {
          '@type': 'Person',
          name: COMPANY_INFO.founder.name,
          jobTitle: COMPANY_INFO.founder.jobTitle,
          alumniOf: {
            '@type': 'CollegeOrUniversity',
            name: COMPANY_INFO.founder.university,
            url: COMPANY_INFO.founder.universityUrl,
          },
          sameAs: COMPANY_INFO.founder.sameAs,
          worksFor: {
            '@id': `${COMPANY_INFO.url}/#organization`,
          },
        },
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${COMPANY_INFO.url}/articles?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
        knowsAbout: [
          'Web Development',
          'Local SEO',
          'Social Media Marketing',
          'Digital Marketing',
          'Business Growth',
          'Content Creation',
          'Promotional Videos',
        ],
      },
      {
        '@type': 'LocalBusiness',
        '@id': `${COMPANY_INFO.url}/#localbusiness`,
        name: COMPANY_INFO.name,
        alternateName: COMPANY_INFO.alternateName,
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
        alternateName: COMPANY_INFO.alternateName,
        description: COMPANY_INFO.description,
        publisher: {
          '@id': `${COMPANY_INFO.url}/#organization`,
        },
        inLanguage: 'en-US',
        potentialAction: {
          '@type': 'SearchAction',
          target: {
            '@type': 'EntryPoint',
            urlTemplate: `${COMPANY_INFO.url}/articles?q={search_term_string}`,
          },
          'query-input': 'required name=search_term_string',
        },
      },
      {
        '@type': 'Person',
        '@id': `${COMPANY_INFO.url}/#founder`,
        name: COMPANY_INFO.founder.name,
        jobTitle: COMPANY_INFO.founder.jobTitle,
        description: `${COMPANY_INFO.founder.name} is the Founder & CEO of Flyo (also known as flyoo), a digital studio started at GLA University in Mathura, India. Flyo helps local businesses grow online with web development, SEO, and social media marketing.`,
        alumniOf: {
          '@type': 'CollegeOrUniversity',
          name: COMPANY_INFO.founder.university,
          url: COMPANY_INFO.founder.universityUrl,
        },
        affiliation: {
          '@id': `${COMPANY_INFO.url}/#organization`,
        },
        sameAs: COMPANY_INFO.founder.sameAs,
        worksFor: {
          '@id': `${COMPANY_INFO.url}/#organization`,
        },
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

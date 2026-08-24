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
        disambiguatingDescription:
          'Official web development and local SEO digital growth studio flyoo businesses (also known as flyoo, flyo, flyyo, fly business) founded by Harsh Kumar at GLA University in Mathura, India.',
        url: COMPANY_INFO.url,
        logo: {
          '@type': 'ImageObject',
          url: COMPANY_INFO.logo,
          width: 512,
          height: 512,
        },
        slogan: COMPANY_INFO.tagline,
        image: COMPANY_INFO.logo,
        email: COMPANY_INFO.email,
        telephone: COMPANY_INFO.phone,
        foundingDate: COMPANY_INFO.foundingYear,
        sameAs: COMPANY_INFO.sameAs,
        contactPoint: [
          {
            '@type': 'ContactPoint',
            telephone: COMPANY_INFO.phone,
            contactType: 'customer service',
            email: COMPANY_INFO.email,
            areaServed: 'IN',
            availableLanguage: ['English', 'Hindi'],
          },
        ],
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
          'flyoo',
          'flyoo businesses',
          'flyo',
          'flyyo',
          'fly business',
          'business grow',
          'grow business',
          'how grow business',
          'how to grow business online',
          'how to increase sales and customers',
          'how to get more customers',
          'flyo businesses',
          'flyoo digital',
          'Local Business Growth Strategy',
          'Web Development India',
          'Local SEO Ranking',
          'Social Media Marketing',
          'Digital Marketing',
          'Content Creation',
          'Promotional Videos',
          'Google Maps Optimization',
        ],
      },
      {
        '@type': 'ProfessionalService',
        '@id': `${COMPANY_INFO.url}/#localbusiness`,
        name: COMPANY_INFO.name,
        alternateName: COMPANY_INFO.alternateName,
        description: COMPANY_INFO.description,
        url: COMPANY_INFO.url,
        telephone: COMPANY_INFO.phone,
        email: COMPANY_INFO.email,
        image: COMPANY_INFO.logo,
        priceRange: '₹₹',
        address: {
          '@type': 'PostalAddress',
          streetAddress: COMPANY_INFO.address.streetAddress,
          addressLocality: COMPANY_INFO.address.addressLocality,
          addressRegion: COMPANY_INFO.address.addressRegion,
          postalCode: COMPANY_INFO.address.postalCode,
          addressCountry: COMPANY_INFO.address.addressCountry,
        },
        geo: {
          '@type': 'GeoCoordinates',
          latitude: '27.6057',
          longitude: '77.5933',
        },
        openingHoursSpecification: [
          {
            '@type': 'OpeningHoursSpecification',
            dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
            opens: '09:00',
            closes: '20:00',
          },
        ],
        areaServed: COMPANY_INFO.serviceArea.map((area) => ({
          '@type': 'AdministrativeArea',
          name: area,
        })),
        sameAs: COMPANY_INFO.sameAs,
        parentOrganization: {
          '@id': `${COMPANY_INFO.url}/#organization`,
        },
      },
      {
        '@type': 'WebSite',
        '@id': `${COMPANY_INFO.url}/#website`,
        url: `${COMPANY_INFO.url}/`,
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
        '@type': 'ItemList',
        '@id': `${COMPANY_INFO.url}/#sitelinks`,
        name: 'Site Navigation Sitelinks',
        itemListElement: [
          {
            '@type': 'ListItem',
            position: 1,
            name: 'Services',
            url: `${COMPANY_INFO.url}/services`,
          },
          {
            '@type': 'ListItem',
            position: 2,
            name: 'Our Work',
            url: `${COMPANY_INFO.url}/work`,
          },
          {
            '@type': 'ListItem',
            position: 3,
            name: 'Articles',
            url: `${COMPANY_INFO.url}/articles`,
          },
          {
            '@type': 'ListItem',
            position: 4,
            name: 'About Us',
            url: `${COMPANY_INFO.url}/about`,
          },
          {
            '@type': 'ListItem',
            position: 5,
            name: 'Contact',
            url: `${COMPANY_INFO.url}/contact`,
          },
        ],
      },
      {
        '@type': 'Person',
        '@id': `${COMPANY_INFO.url}/#founder`,
        name: COMPANY_INFO.founder.name,
        jobTitle: COMPANY_INFO.founder.jobTitle,
        description: `${COMPANY_INFO.founder.name} is the Founder & CEO of flyoo businesses (also known as flyoo, flyo, flyyo), a digital studio started at GLA University in Mathura, India. flyoo helps businesses grow online with web development, SEO, and social media marketing.`,
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
  // Approximate word count from content
  const textContent = (article.contentHtml || '').replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
  const wordCount = textContent ? textContent.split(' ').length : undefined;

  const defaultKeywords = [
    'flyoo',
    'flyoo businesses',
    'business grow',
    'grow business',
    'how grow business',
    'how to increase sales and customers',
    'local business seo',
    article.category,
  ];

  return {
    '@context': 'https://schema.org',
    '@type': 'Article',
    '@id': `${articleUrl}/#article`,
    headline: article.title,
    description: article.metaDescription || article.summary,
    image: article.heroImage || `${COMPANY_INFO.url}/kingfisher-logo.jpg`,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt || article.publishedAt || new Date().toISOString().split('T')[0],
    inLanguage: 'en-IN',
    articleSection: article.category,
    keywords: Array.from(new Set([...(article.keywords || []), ...defaultKeywords])).join(', '),
    ...(wordCount ? { wordCount } : {}),
    author: {
      '@type': 'Person',
      name: article.authorName || COMPANY_INFO.founder.name,
      jobTitle: article.authorRole || 'Digital Strategist',
      url: `${COMPANY_INFO.url}/about`,
    },
    publisher: {
      '@type': 'Organization',
      '@id': `${COMPANY_INFO.url}/#organization`,
      name: COMPANY_INFO.name,
      url: COMPANY_INFO.url,
      logo: {
        '@type': 'ImageObject',
        url: COMPANY_INFO.logo,
      },
    },
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': articleUrl,
    },
  };
}


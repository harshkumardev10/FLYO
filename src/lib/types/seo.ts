export interface SEOData {
  title: string;
  description: string;
  canonicalUrl?: string;
  noindex?: boolean;
  openGraph?: {
    title?: string;
    description?: string;
    url?: string;
    type?: 'website' | 'article';
    images?: Array<{
      url: string;
      width?: number;
      height?: number;
      alt?: string;
    }>;
  };
  structuredData?: Record<string, any> | Array<Record<string, any>>;
}

export interface BreadcrumbItem {
  name: string;
  item: string;
}

export interface ServiceItem {
  slug: string;
  title: string;
  shortTitle?: string;
  shortDescription: string;
  detailedDescription?: string;
  iconName: string;
  whatWeProvide: string[];
  keyBenefits?: Array<{ title: string; description: string }>;
  processSteps?: Array<{ step: string; title: string; description: string }>;
  whoItIsFor: string[];
  exampleDeliverables: string[];
  ourApproach: string;
  faqs: Array<{ question: string; answer: string }>;
}

export interface WorkProject {
  slug: string;
  title: string;
  clientName: string;
  category: 'Websites' | 'Social Media' | 'Posters' | 'Thumbnails' | 'Branding' | 'Marketing';
  service: string;
  shortDescription: string;
  detailedChallenge?: string;
  detailedSolution?: string;
  challenge: string;
  whatWeDid: string[];
  finalResult: string;
  heroImage: string;
  galleryImages?: string[];
  measurableResult?: string;
  keyTakeaways?: string[];
}

export interface ArticleItem {
  slug: string;
  title: string;
  metaTitle?: string;
  metaDescription?: string;
  summary: string;
  category: 'SEO' | 'Social Media' | 'Websites' | 'Marketing' | 'Local Business' | 'Design';
  publishedAt: string;
  updatedAt?: string;
  authorName: string;
  authorRole: string;
  readingTimeMinutes: number;
  heroImage: string;
  heroImageAlt?: string;
  contentHtml: string;
  relatedServiceSlug?: string;
  status?: 'pending' | 'approved';
  submittedBy?: string;
  keywords?: string[];
  faqs?: Array<{ question: string; answer: string }>;
}

export interface TeamMember {
  id: string;           // unique identifier (slug-style)
  name: string;
  role: string;
  bio: string;
  college: string;
  avatar: string;
  linkedin?: string;
  twitter?: string;
  customLinkName?: string;
  customLinkUrl?: string;
  visible: boolean;     // controls whether displayed on site
  order: number;        // display order
}

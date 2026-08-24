import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Business Growth Knowledge Base & Local SEO Guides | flyoo businesses',
  description: 'Practical, jargon-free digital guides on how to grow your business online, rank higher on Google Search & Maps, and scale local business revenue by flyoo businesses.',
  canonicalUrl: '/articles',
});

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

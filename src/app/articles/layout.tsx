import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Business Growth Knowledge Base & Local SEO Guides | FLYO',
  description: 'Practical, jargon-free digital guides on how to grow your business online, rank higher on Google Search & Maps, and scale local business revenue by FLYO.',
  canonicalUrl: '/articles',
});

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

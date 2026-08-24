import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Growth Guides & SEO Articles',
  description: 'Practical digital guides on how to grow your business online, rank on Google, and scale sales by flyoo businesses.',
  canonicalUrl: '/articles',
});

export default function ArticlesLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

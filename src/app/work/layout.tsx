import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Our Work & Portfolio',
  description: 'Explore live client websites, high-converting designs, and business growth case studies built by flyoo businesses.',
  canonicalUrl: '/work',
});

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

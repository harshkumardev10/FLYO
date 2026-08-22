import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Our Work & Portfolio | Real Business Growth Results by FLYO',
  description: 'Explore live client websites, high-converting designs, and business growth case studies built by FLYO (flyo / flyoo). See how we help local businesses grow revenue and rank #1 online.',
  canonicalUrl: '/work',
});

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

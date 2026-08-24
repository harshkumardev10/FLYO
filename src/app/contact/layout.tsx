import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact & Consultations',
  description: 'Get in touch with flyoo businesses (flyoo / flyo) for custom web design, local SEO, and digital business growth.',
  canonicalUrl: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

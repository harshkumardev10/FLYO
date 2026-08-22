import { Metadata } from 'next';
import { generatePageMetadata } from '@/lib/seo/metadata';

export const metadata: Metadata = generatePageMetadata({
  title: 'Contact FLYO | Start Growing Your Business Today',
  description: 'Get in touch with FLYO (flyo / flyoo) to grow your business online. Speak directly with founder Harsh Kumar (GLA University) for custom website development, local SEO, and business growth strategy.',
  canonicalUrl: '/contact',
});

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}

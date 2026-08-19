import type { Metadata } from 'next';
import './globals.css';


import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateOrganizationSchema } from '@/lib/seo/schemas';
import { COMPANY_INFO } from '@/lib/data/company';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || COMPANY_INFO.url),
  title: {
    default: 'Flyoo | Make Your Business Fly - Web Design & Local SEO India',
    template: '%s | Flyoo',
  },
  description: 'Flyoo (also known as Flyo) is a student-led digital studio founded by Harsh Kumar at GLA University. We build stunning websites, run local SEO, and manage social media to help Indian businesses grow online.',
  keywords: [
    // Brand / Search query variants
    'flyoo', 'flyoo digital', 'flyo', 'flyo digital', 'FLYO', 'flyoo website', 'flyoo businesses',
    // Founder & University
    'Harsh Kumar', 'Harsh Kumar GLA University', 'GLA University startup', 'GLA University digital studio',
    // Services
    'web development India', 'local SEO India', 'social media management', 'digital marketing startup',
    'website design for small business', 'affordable web design India', 'promotional video',
    // Local
    'Mathura digital agency', 'UP digital marketing', 'student startup India',
    'Make Your Business Fly',
  ],
  icons: {
    icon: '/kingfisher-logo.jpg',
    apple: '/kingfisher-logo.jpg',
    shortcut: '/kingfisher-logo.jpg',
  },
  authors: [
    { name: COMPANY_INFO.founder.name },
    { name: COMPANY_INFO.name, url: COMPANY_INFO.url },
  ],
  creator: COMPANY_INFO.founder.name,
  publisher: COMPANY_INFO.name,
  category: 'Digital Marketing, Web Development',
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: '6GbxokTcffQ1pNCIp4YUn143TZA9c7D4YZJ3NDhOcOQ',
  },
  openGraph: {
    title: 'Flyoo | Make Your Business Fly',
    description: 'Flyoo — a student-led digital studio by Harsh Kumar (GLA University). Web development, local SEO & social media marketing for Indian businesses.',
    url: COMPANY_INFO.url,
    siteName: 'Flyoo',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: `${COMPANY_INFO.url}/kingfisher-logo.jpg`,
        width: 1200,
        height: 630,
        alt: 'Flyoo - Make Your Business Fly',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Flyoo | Make Your Business Fly',
    description: 'Student-led digital studio by Harsh Kumar (GLA University). Web dev, SEO & social media for Indian businesses.',
    images: [`${COMPANY_INFO.url}/kingfisher-logo.jpg`],
  },
  alternates: {
    canonical: COMPANY_INFO.url,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const orgSchema = generateOrganizationSchema();

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <meta name="google-site-verification" content="6GbxokTcffQ1pNCIp4YUn143TZA9c7D4YZJ3NDhOcOQ" />
        <JsonLd data={orgSchema} />
      </head>
      <body className="min-h-screen flex flex-col bg-slate-50 text-slate-900 font-sans antialiased">
        <Header />
        <main className="flex-1">{children}</main>
        <Footer />
      </body>
    </html>
  );
}

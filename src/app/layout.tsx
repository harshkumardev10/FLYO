import type { Metadata, Viewport } from 'next';
import './globals.css';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateOrganizationSchema } from '@/lib/seo/schemas';
import { COMPANY_INFO } from '@/lib/data/company';

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 5,
  themeColor: '#4f46e5',
};

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || COMPANY_INFO.url),
  applicationName: 'flyoo businesses',
  appleWebApp: {
    title: 'flyoo businesses',
    statusBarStyle: 'default',
    capable: true,
  },
  // Optimal title: 51 characters (Target: 50-60 chars)
  title: {
    default: 'flyoo businesses | Business Grow, Web Design & SEO',
    template: '%s | flyoo businesses',
  },
  // Optimal description: 116 characters (Target: 100-130 chars)
  description: 'flyoo businesses (flyoo / flyo) helps local businesses grow online with high-converting web design and local SEO.',
  keywords: [
    // Primary User Target Core Queries
    'flyoo', 'flyoo businesses', 'flyo', 'flyyo', 'Flyyo', 'fly business', 'Fly Business',
    'business grow', 'how grow business', 'how to grow business', 'how to grow business online',
    'how to increase sales and customers', 'increase sales and customers', 'how to get more customers',
    'grow business', 'growing business', 'grow sales online', 'how to increase sales',
    'make your business fly', 'flyoo official website',
    // Brand & Query Variants
    'Flyoo', 'Flyo', 'FLYO',
    'flyo businesses', 'Flyo Businesses', 'flyoo digital', 'flyo digital',
    'flyoo website', 'flyo website', 'flyoo.vercel.app', 'flyoo businesses India',
    // Founder & University Credentials
    'Harsh Kumar', 'Harsh Kumar GLA University', 'GLA University startup', 'GLA University digital studio',
    'Harsh Kumar Mathura',
    // Services & Solutions
    'web development India', 'local SEO India', 'social media management', 'digital marketing startup',
    'website design for small business', 'affordable web design India', 'promotional video',
    'Google Maps ranking India', 'high converting website design',
    // Local / Regional Growth
    'local business growth strategy', 'Mathura digital agency', 'UP digital marketing', 'student startup India',
  ],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon-48x48.png', type: 'image/png', sizes: '48x48' },
      { url: '/favicon-96x96.png', type: 'image/png', sizes: '96x96' },
      { url: '/favicon-144x144.png', type: 'image/png', sizes: '144x144' },
      { url: '/favicon-192x192.png', type: 'image/png', sizes: '192x192' },
      { url: '/favicon-32x32.png', type: 'image/png', sizes: '32x32' },
      { url: '/favicon-16x16.png', type: 'image/png', sizes: '16x16' },
      { url: '/favicon.png', type: 'image/png', sizes: '512x512' },
      { url: '/icon.svg', type: 'image/svg+xml' },
    ],
    shortcut: '/favicon.ico',
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
  authors: [
    { name: COMPANY_INFO.founder.name },
    { name: COMPANY_INFO.name, url: COMPANY_INFO.url },
  ],
  creator: COMPANY_INFO.founder.name,
  publisher: COMPANY_INFO.name,
  category: 'Business Growth, Digital Marketing, Web Development',
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
    title: 'flyoo businesses | Business Grow, Web Design & SEO',
    description: 'flyoo businesses (flyoo / flyo) helps local businesses grow online with high-converting web design and local SEO.',
    url: COMPANY_INFO.url,
    siteName: 'flyoo businesses',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: `${COMPANY_INFO.url}/kingfisher-logo.jpg`,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'flyoo businesses - Make Your Business Fly & Grow Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'flyoo businesses | Business Grow, Web Design & SEO',
    description: 'flyoo businesses (flyoo / flyo) helps local businesses grow online with high-converting web design and local SEO.',
    site: '@flyoobusinesses',
    creator: '@flyoobusinesses',
    images: [`${COMPANY_INFO.url}/kingfisher-logo.jpg`],
  },
  alternates: {
    canonical: COMPANY_INFO.url,
    languages: {
      'en-IN': `${COMPANY_INFO.url}`,
      'en': `${COMPANY_INFO.url}`,
      'x-default': `${COMPANY_INFO.url}`,
    },
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
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <meta name="google-site-verification" content="6GbxokTcffQ1pNCIp4YUn143TZA9c7D4YZJ3NDhOcOQ" />
        <meta property="og:site_name" content="flyoo businesses" />
        <meta name="application-name" content="flyoo businesses" />
        <meta name="apple-mobile-web-app-title" content="flyoo businesses" />

        {/* Canonical & Hreflang Tags */}
        <link rel="canonical" href={COMPANY_INFO.url} />
        <link rel="alternate" hrefLang="en-IN" href={COMPANY_INFO.url} />
        <link rel="alternate" hrefLang="en" href={COMPANY_INFO.url} />
        <link rel="alternate" hrefLang="x-default" href={COMPANY_INFO.url} />

        {/* Explicit Google Search Favicon Link Tags */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon.png" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />

        {/* Social Profile Verification & Identity Linking (All 5 Networks) */}
        <link rel="me" href={COMPANY_INFO.social.instagram} />
        <link rel="me" href={COMPANY_INFO.social.facebook} />
        <link rel="me" href={COMPANY_INFO.social.youtube} />
        <link rel="me" href={COMPANY_INFO.social.twitter} />
        <link rel="me" href={COMPANY_INFO.social.linkedin} />
        <meta property="og:see_also" content={COMPANY_INFO.social.instagram} />
        <meta property="og:see_also" content={COMPANY_INFO.social.facebook} />
        <meta property="og:see_also" content={COMPANY_INFO.social.youtube} />
        <meta property="og:see_also" content={COMPANY_INFO.social.twitter} />
        <meta property="og:see_also" content={COMPANY_INFO.social.linkedin} />

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

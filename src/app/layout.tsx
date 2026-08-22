import type { Metadata } from 'next';
import './globals.css';

import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { JsonLd } from '@/components/seo/JsonLd';
import { generateOrganizationSchema } from '@/lib/seo/schemas';
import { COMPANY_INFO } from '@/lib/data/company';

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || COMPANY_INFO.url),
  applicationName: 'FLYO',
  appleWebApp: {
    title: 'FLYO',
    statusBarStyle: 'default',
    capable: true,
  },
  title: {
    default: 'FLYO | Grow Your Business Online - Web Design & Local SEO Studio',
    template: '%s | FLYO',
  },
  description: 'FLYO (also known as flyoo / flyo) is India\'s top student-led digital growth studio founded by Harsh Kumar (GLA University). We build lightning-fast websites, dominate local SEO, and grow your business online.',
  keywords: [
    // Growth & Business Intent Core Queries
    'grow business', 'growing business', 'grow your business online', 'how to grow business',
    'grow local business', 'business growth digital studio', 'grow sales online', 'make your business fly',
    'scale business online', 'how to grow small business', 'local business growth strategy',
    // Brand & Query Variants
    'FLYO', 'flyo', 'flyoo', 'flyoo digital', 'flyo digital', 'flyoo website', 'flyo businesses',
    'flyoo.vercel.app', 'flyo website', 'FLYO India',
    // Founder & University Credentials
    'Harsh Kumar', 'Harsh Kumar GLA University', 'GLA University startup', 'GLA University digital studio',
    'Harsh Kumar Mathura',
    // Services & Solutions
    'web development India', 'local SEO India', 'social media management', 'digital marketing startup',
    'website design for small business', 'affordable web design India', 'promotional video',
    'Google Maps ranking India', 'high converting website design',
    // Local / Regional
    'Mathura digital agency', 'UP digital marketing', 'student startup India',
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
    title: 'FLYO | Grow Your Business Online - Make Your Business Fly',
    description: 'FLYO (flyo / flyoo) — Student-led digital studio by Harsh Kumar (GLA University). Fast web development, local SEO ranking & business growth solutions.',
    url: COMPANY_INFO.url,
    siteName: 'FLYO',
    locale: 'en_IN',
    type: 'website',
    images: [
      {
        url: `${COMPANY_INFO.url}/kingfisher-logo.jpg`,
        width: 1200,
        height: 630,
        type: 'image/jpeg',
        alt: 'FLYO - Make Your Business Fly & Grow Online',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'FLYO | Grow Your Business Online',
    description: 'Student-led digital studio by Harsh Kumar (GLA University). Web dev, SEO & growth solutions for Indian businesses.',
    site: '@flyodigital',
    creator: '@flyodigital',
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
        <meta property="og:site_name" content="FLYO" />
        <meta name="application-name" content="FLYO" />
        <meta name="apple-mobile-web-app-title" content="FLYO" />

        {/* Explicit Google Search Favicon Link Tags (48x48 is Google's mandatory size requirement) */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" type="image/png" sizes="48x48" href="/favicon-48x48.png" />
        <link rel="icon" type="image/png" sizes="96x96" href="/favicon-96x96.png" />
        <link rel="icon" type="image/png" sizes="192x192" href="/favicon-192x192.png" />
        <link rel="icon" type="image/png" sizes="512x512" href="/favicon.png" />
        <link rel="icon" type="image/svg+xml" href="/icon.svg" />
        <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
        <link rel="shortcut icon" href="/favicon.ico" />

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


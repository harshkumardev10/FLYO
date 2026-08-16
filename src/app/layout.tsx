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
    default: 'FLYO | Make Your Business Fly - Local SEO & Web Development',
    template: '%s | FLYO',
  },
  description: 'FLYO helps local businesses fly in the digital world with fast websites, local SEO strategies, and social marketing content.',
  keywords: ['FLYO', 'Flyo Digital', 'Make Your Business Fly', 'Local SEO', 'Web Development', 'Local Business Growth', 'Social Media Handling'],
  icons: {
    icon: '/kingfisher-logo.jpg',
    apple: '/kingfisher-logo.jpg',
    shortcut: '/kingfisher-logo.jpg',
  },
  authors: [{ name: COMPANY_INFO.name, url: COMPANY_INFO.url }],
  creator: COMPANY_INFO.name,
  publisher: COMPANY_INFO.name,
  robots: {
    index: true,
    follow: true,
  },
  openGraph: {
    title: 'FLYO | Make Your Business Fly',
    description: COMPANY_INFO.description,
    url: COMPANY_INFO.url,
    siteName: 'FLYO',
    locale: 'en_US',
    type: 'website',
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

import React from 'react';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { COMPANY_INFO } from '@/lib/data/company';

export const metadata = generatePageMetadata({
  title: 'Terms of Service',
  description: 'Terms of service for Pulse Digital Studio.',
  canonicalUrl: '/terms',
});

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      <Breadcrumbs items={[{ name: 'Terms of Service', item: '/terms' }]} />

      <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-4">
        <p className="text-slate-500 font-medium">Last updated: February 2026</p>
        <p>
          Welcome to {COMPANY_INFO.name}. By accessing or using our website and services, you agree to comply with and be bound by the following terms and conditions.
        </p>
        <h2 className="text-lg font-bold text-slate-900 pt-4">1. Ethical Service & Local Growth Policy</h2>
        <p>We perform web development, local SEO, design, and social media services strictly within search engine and platform guidelines. We focus on practical, long-term business growth.</p>
        <h2 className="text-lg font-bold text-slate-900 pt-4">2. Intellectual Property & Deliverables</h2>
        <p>All custom website code, design assets, and promotional graphics created for clients become the property of the client upon project completion and full payment.</p>
      </div>
    </div>
  );
}

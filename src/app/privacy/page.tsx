import React from 'react';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { COMPANY_INFO } from '@/lib/data/company';

export const metadata = generatePageMetadata({
  title: 'Privacy Policy',
  description: 'Privacy policy for Pulse Digital Studio.',
  canonicalUrl: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      <Breadcrumbs items={[{ name: 'Privacy Policy', item: '/privacy' }]} />

      <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
      
      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-4">
        <p className="text-slate-500 font-medium">Last updated: February 2026</p>
        <p>
          At {COMPANY_INFO.name}, we respect your privacy and are committed to protecting your personal information. This Privacy Policy outlines how we collect, use, and safeguard data submitted through our website.
        </p>
        <h2 className="text-lg font-bold text-slate-900 pt-4">1. Information Collection</h2>
        <p>We collect information voluntarily submitted through our contact forms, audit inquiry forms, and phone consultations, including name, business name, email address, phone number, and website URL.</p>
        <h2 className="text-lg font-bold text-slate-900 pt-4">2. Use of Information</h2>
        <p>Information is used solely to respond to business inquiries, perform technical website audits, and deliver requested digital services. We do not sell or rent personal information to third parties.</p>
        <h2 className="text-lg font-bold text-slate-900 pt-4">3. Data Security</h2>
        <p>We implement industry-standard administrative, physical, and technical safeguards to protect your data against unauthorized access or disclosure.</p>
      </div>
    </div>
  );
}

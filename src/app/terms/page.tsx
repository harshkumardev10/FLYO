import React from 'react';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { COMPANY_INFO } from '@/lib/data/company';

export const metadata = generatePageMetadata({
  title: 'Terms of Service',
  description: 'Terms of service, project delivery standards, and client agreements for flyoo businesses digital studio.',
  canonicalUrl: '/terms',
});

export default function TermsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      <Breadcrumbs items={[{ name: 'Terms of Service', item: '/terms' }]} />

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Terms of Service</h1>
        <p className="text-slate-500 text-xs">Last updated: February 2026 · Effective Date: January 1, 2026</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-5 leading-relaxed">
        <p>
          Welcome to <strong>{COMPANY_INFO.name}</strong> (also known as <em>flyoo</em>, <em>flyo</em>, or <em>fly business</em>). By accessing our website ({COMPANY_INFO.url}), requesting project consultations, or engaging our digital services, you agree to comply with and be bound by the following Terms of Service. Please review these terms carefully before starting a project.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-3">1. Scope of Digital Services</h2>
        <p>
          {COMPANY_INFO.name} provides specialized digital solutions tailored for local businesses, stores, and emerging startups across India. Our core offerings include:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li><strong>Custom Web Development:</strong> Design, frontend and backend development, mobile optimization, speed optimization, and deployment of responsive modern websites.</li>
          <li><strong>Local SEO &amp; Maps Optimization:</strong> Google Business Profile setup, local keyword research, on-page schema integration, local citation building, and Google Maps ranking strategies.</li>
          <li><strong>Social Media &amp; Graphic Design:</strong> Creation of promotional flyers, posters, menu designs, YouTube thumbnails, and social media content management for platforms including Instagram and Facebook.</li>
          <li><strong>Digital Growth Strategy:</strong> Conversion rate optimization, WhatsApp direct inquiry funnel setup, and marketing consultation.</li>
        </ul>

        <h2 className="text-lg font-bold text-slate-900 pt-3">2. Transparent Pricing &amp; Milestone Payments</h2>
        <p>
          We operate on transparent, straightforward pricing without hidden agency retainer fees. Prior to project kickoff, clients receive a clear project scope outlining deliverables, timelines, and payment milestones. Standard development projects require an initial deposit with the remaining balance due upon milestone completion, client review, and final production launch.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-3">3. 100% Client Ownership &amp; Intellectual Property</h2>
        <p>
          We believe in full ownership for business owners. Upon full settlement of project invoices:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li>You retain 100% full ownership of all custom website source code, visual design assets, branding graphics, and promotional files created specifically for your project.</li>
          <li>You retain full administrative control over all hosting environments, registered domains, Google accounts, and social media platforms.</li>
          <li>{COMPANY_INFO.name} retains the right to showcase non-confidential project visuals in our portfolio and case studies as examples of our work.</li>
        </ul>

        <h2 className="text-lg font-bold text-slate-900 pt-3">4. Client Cooperation &amp; Material Submission</h2>
        <p>
          Timely project delivery depends upon active collaboration. Clients agree to provide required text content, official logos, product/service photos, and feedback in a reasonable timeframe to adhere to agreed launch milestones.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-3">5. SEO &amp; Search Engine Guidelines</h2>
        <p>
          All search engine optimization work performed by {COMPANY_INFO.name} strictly adheres to white-hat industry standards and Google Search Essentials. While we implement proven best practices that maximize local search visibility, traffic, and conversions, third-party search engine algorithm updates and organic competition are dynamic factors outside the absolute control of any agency or studio.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-3">6. Limitation of Liability</h2>
        <p>
          To the maximum extent permitted by applicable law, {COMPANY_INFO.name} shall not be liable for any indirect, incidental, or consequential damages resulting from third-party hosting outages, domain registrar downtime, or external platform policy changes. Our total liability for any claim arising from a project is strictly limited to the amount paid for the specific service rendered.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-3">7. Inquiries &amp; Legal Support</h2>
        <p>
          For any questions regarding these terms, project agreements, or support inquiries, please contact our founder and management lead directly:
        </p>
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs space-y-1 font-mono text-slate-800">
          <p><strong>{COMPANY_INFO.name} ({COMPANY_INFO.legalName})</strong></p>
          <p>Location: {COMPANY_INFO.address.streetAddress}, {COMPANY_INFO.address.addressLocality}, {COMPANY_INFO.address.addressRegion} - {COMPANY_INFO.address.postalCode}, India</p>
          <p>Direct Support Email: {COMPANY_INFO.email} · Phone/WhatsApp: {COMPANY_INFO.phoneDisplay}</p>
        </div>
      </div>
    </div>
  );
}

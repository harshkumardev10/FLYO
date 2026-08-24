import React from 'react';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { COMPANY_INFO } from '@/lib/data/company';

export const metadata = generatePageMetadata({
  title: 'Privacy Policy',
  description: 'Official privacy policy and data governance practices of flyoo businesses digital growth studio.',
  canonicalUrl: '/privacy',
});

export default function PrivacyPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 pb-20">
      <Breadcrumbs items={[{ name: 'Privacy Policy', item: '/privacy' }]} />

      <div className="space-y-2">
        <h1 className="text-3xl font-extrabold text-slate-900">Privacy Policy</h1>
        <p className="text-slate-500 text-xs">Last updated: February 2026 · Effective Date: January 1, 2026</p>
      </div>
      
      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-5 leading-relaxed">
        <p>
          Welcome to <strong>{COMPANY_INFO.name}</strong> (also known as <em>flyoo</em>, <em>flyo</em>, or <em>fly business</em>). We respect your privacy and are committed to protecting any personal and business information you share with us. This Privacy Policy governs our data collection, processing, and protection practices across our website ({COMPANY_INFO.url}) and all associated communication channels.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-3">1. Information We Collect</h2>
        <p>
          We collect personal and commercial information that you voluntarily provide when you submit contact forms, request free website audits, schedule consultations, or communicate with our student-led team via WhatsApp, phone, or email. This information may include:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li><strong>Contact Details:</strong> Your full name, business name, official email address, phone / WhatsApp number, and physical city or address.</li>
          <li><strong>Project Specifications:</strong> Current website URLs, project requirements, service preferences (e.g., Web Development, Local SEO, Graphic Design, Social Media), and budget ranges.</li>
          <li><strong>Technical Metadata:</strong> Anonymized device information, browser type, operating system, IP address, and referral URLs collected automatically via standard server access logs for performance monitoring and security analytics.</li>
        </ul>

        <h2 className="text-lg font-bold text-slate-900 pt-3">2. How We Use Your Information</h2>
        <p>
          The information collected by {COMPANY_INFO.name} is utilized strictly for legitimate business and client service purposes, including:
        </p>
        <ul className="list-disc pl-5 space-y-1 text-slate-600">
          <li>Responding promptly to your project inquiries, quotes, and service consultation requests.</li>
          <li>Performing comprehensive technical website audits, Local SEO performance reviews, and competitor analysis reports.</li>
          <li>Delivering, maintaining, and enhancing our web development, search engine ranking, and graphic design solutions.</li>
          <li>Sending essential project milestones, invoicing notifications, and customer support communications.</li>
          <li>Complying with applicable legal, financial, and regulatory obligations.</li>
        </ul>

        <h2 className="text-lg font-bold text-slate-900 pt-3">3. Data Sharing &amp; Third-Party Protection</h2>
        <p>
          We do <strong>not</strong> sell, trade, rent, or monetize your personal or business data to third parties. We may disclose necessary information only to trusted technical infrastructure providers (such as hosting servers, database providers, and transactional communication webhooks) that adhere to strict data security standards and confidentiality agreements.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-3">4. Cookies &amp; Tracking Technologies</h2>
        <p>
          Our website utilizes minimal, essential session cookies and performance analytics to ensure lightning-fast page loading speeds, seamless navigation, and security. You have the right to configure your web browser settings to refuse cookies or alert you when cookies are being sent, though certain interactive features may function with diminished efficiency.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-3">5. Data Security &amp; Retention</h2>
        <p>
          {COMPANY_INFO.name} implements industry-standard administrative, technical, and physical safeguards designed to prevent unauthorized access, alteration, disclosure, or destruction of your personal data. We retain client consultation data only for as long as necessary to fulfill project services and maintain regulatory records.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-3">6. Your Data Rights</h2>
        <p>
          You have the right to request access to the personal data we hold about you, request corrections to inaccurate records, or request the deletion of your consultation history at any time. To exercise any of these rights, please contact our data controller directly at <a href={`mailto:${COMPANY_INFO.email}`} className="text-indigo-600 font-semibold underline">{COMPANY_INFO.email}</a>.
        </p>

        <h2 className="text-lg font-bold text-slate-900 pt-3">7. Contact Information</h2>
        <p>
          If you have questions or concerns regarding this Privacy Policy or our data protection measures, please reach out to us at:
        </p>
        <div className="p-4 rounded-xl bg-slate-100 border border-slate-200 text-xs space-y-1 font-mono text-slate-800">
          <p><strong>{COMPANY_INFO.legalName}</strong></p>
          <p>Campus: {COMPANY_INFO.address.streetAddress}, {COMPANY_INFO.address.addressLocality}, {COMPANY_INFO.address.addressRegion} - {COMPANY_INFO.address.postalCode}, India</p>
          <p>Email: {COMPANY_INFO.email} · Phone: {COMPANY_INFO.phoneDisplay}</p>
        </div>
      </div>
    </div>
  );
}

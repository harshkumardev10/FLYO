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

      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Privacy Policy</h1>
        <p className="text-slate-500 text-xs">Last updated: February 2026 · Effective Date: January 1, 2026</p>
      </div>
      
      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-6 leading-relaxed">
        <p>
          Welcome to <strong>{COMPANY_INFO.name}</strong> (also operating under the brand names <em>flyoo</em>, <em>flyo</em>, and <em>fly business</em>). We respect your privacy and are committed to protecting any personal, commercial, and technical information you share with our studio. This comprehensive Privacy Policy governs the data collection, processing, storage, and security practices across our official website ({COMPANY_INFO.url}) and all associated communication channels including WhatsApp, email, and phone consultations.
        </p>

        <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">1. Information We Collect</h2>
        <p>
          We collect personal and commercial data that you voluntarily provide when you submit project inquiries, request free website audits, schedule strategy consultations, or communicate with our student-led engineering team. The categories of data we process include:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li><strong>Contact &amp; Identity Information:</strong> Your full name, official business or brand name, email address, telephone/WhatsApp contact number, and physical city or address.</li>
          <li><strong>Project Specifications &amp; Assets:</strong> Current website URLs, service preferences (e.g., Web Development, Local SEO, Social Media, Graphic Design), branding materials (logos, color palettes, photography), and project requirements.</li>
          <li><strong>Billing &amp; Transaction Details:</strong> Invoicing records, transaction timestamps, and payment confirmation receipts. Note that credit card and UPI transaction processing is handled via secure, PCI-DSS compliant third-party payment gateways; we never store raw banking credentials.</li>
          <li><strong>Technical Metadata &amp; Server Logs:</strong> Anonymized device telemetry, browser type, operating system, IP address, referring URLs, and page navigation patterns collected via standard server access logs for performance monitoring and security analytics.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">2. Legal Grounds &amp; Purposes of Processing</h2>
        <p>
          {COMPANY_INFO.name} processes your data under legitimate business interests, contractual necessity, and explicit client consent in accordance with applicable Indian Digital Personal Data Protection (DPDP) standards. We use this data to:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li>Respond promptly to project consultation requests, custom quote requests, and technical inquiries.</li>
          <li>Perform comprehensive technical website audits, Local SEO competitor assessments, and Google Maps visibility reports.</li>
          <li>Design, develop, test, deploy, and maintain custom web applications, graphic creatives, and search engine optimization campaigns.</li>
          <li>Send essential project milestones, deployment updates, invoicing notices, and ongoing client support communications.</li>
          <li>Safeguard our website infrastructure against automated spam, DDoS attempts, and unauthorized system access.</li>
          <li>Comply with applicable legal, accounting, and regulatory tax obligations.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">3. Data Sharing &amp; Third-Party Protection</h2>
        <p>
          We maintain a strict policy regarding client confidentiality: <strong>we do not sell, rent, monetize, or trade your personal or business data to any third-party advertisers or data brokers.</strong> We disclose necessary data only to trusted technical infrastructure providers that adhere to industry-standard data security and confidentiality agreements:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li><strong>Cloud Hosting &amp; CDN Providers:</strong> High-performance server infrastructure (such as Vercel and Firebase Cloud) used to securely host and deliver web applications.</li>
          <li><strong>Transactional Communication Webhooks:</strong> Encrypted communication endpoints used exclusively to route contact form submissions to our team.</li>
          <li><strong>Legal Authorities:</strong> Only when strictly required by enforceable court orders, subpoenas, or applicable statutory laws.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">4. Cookies &amp; Tracking Technologies</h2>
        <p>
          Our website utilizes minimal, strictly essential cookies and performance analytics to ensure instantaneous page loading speeds, seamless navigation, and security. We do not deploy intrusive third-party cross-site advertising trackers. You can configure your browser settings to reject cookies or alert you when cookies are being transmitted; however, some interactive features may experience reduced performance.
        </p>

        <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">5. Data Security &amp; Retention Policies</h2>
        <p>
          {COMPANY_INFO.name} enforces robust technical, organizational, and physical safeguards designed to prevent unauthorized access, alteration, disclosure, or destruction of personal data. All data transmissions across our website are encrypted using 256-bit Transport Layer Security (TLS/SSL). We retain consultation and project records only for as long as necessary to provide ongoing client support and fulfill accounting requirements.
        </p>

        <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">6. Your Data Rights &amp; Choices</h2>
        <p>
          Under applicable data protection frameworks, you maintain complete authority over your personal information. You have the right to:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li>Request a copy of the personal information we hold regarding your business.</li>
          <li>Request corrections or updates to any inaccurate or incomplete records.</li>
          <li>Request the complete deletion of your consultation history and contact records from our active systems.</li>
          <li>Withdraw your consent for marketing communications at any time.</li>
        </ul>
        <p>
          To exercise any of these rights, please contact our data controller directly at <a href={`mailto:${COMPANY_INFO.email}`} className="text-indigo-600 font-semibold underline">{COMPANY_INFO.email}</a>.
        </p>

        <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">7. Contact Information &amp; Data Controller</h2>
        <p>
          If you have questions, feedback, or concerns regarding this Privacy Policy or our security practices, please reach out to our management team directly:
        </p>
        <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-xs space-y-1 font-mono text-slate-800">
          <p className="font-bold text-slate-900">{COMPANY_INFO.legalName} ({COMPANY_INFO.name})</p>
          <p>Campus: {COMPANY_INFO.address.streetAddress}, {COMPANY_INFO.address.addressLocality}, {COMPANY_INFO.address.addressRegion} - {COMPANY_INFO.address.postalCode}, India</p>
          <p>Official Email: {COMPANY_INFO.email} · Phone/WhatsApp: {COMPANY_INFO.phoneDisplay}</p>
        </div>
      </div>
    </div>
  );
}

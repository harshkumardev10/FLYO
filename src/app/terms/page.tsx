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

      <div className="space-y-2 border-b border-slate-200 pb-6">
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight">Terms of Service</h1>
        <p className="text-slate-500 text-xs">Last updated: February 2026 · Effective Date: January 1, 2026</p>
      </div>

      <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 space-y-6 leading-relaxed">
        <p>
          Welcome to <strong>{COMPANY_INFO.name}</strong> (also operating under the names <em>flyoo</em>, <em>flyo</em>, and <em>fly business</em>). By accessing our official website ({COMPANY_INFO.url}), requesting project estimates, engaging our engineering team, or utilizing our digital services, you agree to be bound by the following Terms of Service. Please review these terms carefully prior to initiating a project with us.
        </p>

        <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">1. Scope of Digital Services</h2>
        <p>
          {COMPANY_INFO.name} provides specialized digital solutions engineered for local retail stores, service contractors, clinics, restaurants, and emerging startups across India. Our core service capabilities include:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li><strong>Custom Web Development:</strong> UI/UX design, frontend and backend development using Next.js, mobile optimization, speed tuning, Core Web Vitals optimization, and cloud CDN deployment.</li>
          <li><strong>Local SEO &amp; Google Maps Optimization:</strong> Google Business Profile verification, keyword research, on-page JSON-LD Schema markup, local directory citation building, and Google Maps 3-Pack ranking strategy.</li>
          <li><strong>Promotional Creatives &amp; Graphic Design:</strong> Creation of high-contrast print-ready posters (A3/A4), event flyers, YouTube thumbnail designs, menu layouts, and social media feed assets for Instagram and Facebook.</li>
          <li><strong>Digital Growth Consulting:</strong> WhatsApp direct inquiry automation, lead ingestion funnels, and marketing consultation.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">2. Transparent Pricing &amp; Milestone Payments</h2>
        <p>
          We believe in complete financial transparency with zero hidden agency retainer fees. Prior to commencing work on any project, clients receive a formal project proposal detailing exact deliverables, agreed milestones, and flat-rate pricing:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li>Standard development projects require an initial deposit upon contract execution, with the remaining balance payable upon milestone completion, client review, and production launch.</li>
          <li>Invoices are payable via bank transfer (NEFT/IMPS/RTGS), UPI, or authorized online payment gateways.</li>
          <li>Any requested out-of-scope features or major post-approval architectural revisions will be quoted transparently prior to implementation.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">3. 100% Client Ownership &amp; Intellectual Property</h2>
        <p>
          Our studio operates on the fundamental principle of complete client ownership. Upon full settlement of all outstanding project invoices:
        </p>
        <ul className="list-disc pl-5 space-y-2 text-slate-600">
          <li>You retain 100% full intellectual property ownership of all custom website source code, visual design graphics, logo marks, and promotional assets created specifically for your business.</li>
          <li>You retain complete administrative control over all hosting environments, registered domains, DNS routing, and connected social media profiles.</li>
          <li>{COMPANY_INFO.name} retains the right to display non-confidential visual previews and case study summaries of the completed work in our online portfolio.</li>
        </ul>

        <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">4. Client Responsibilities &amp; Content Submission</h2>
        <p>
          Timely project execution requires close collaboration. Clients agree to provide required text content, branding assets, store photographs, and timely feedback during review cycles. Delays in providing necessary materials may adjust agreed delivery dates accordingly.
        </p>

        <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">5. SEO &amp; Search Engine Guidelines</h2>
        <p>
          All search engine optimization services provided by {COMPANY_INFO.name} strictly adhere to Google Search Essentials and white-hat industry methodologies. While our techniques are engineered to maximize organic search visibility, traffic, and Google Maps rankings, third-party search engine algorithms and organic local competition are dynamic variables outside the direct control of any agency or studio. We do not make misleading claims of overnight or guaranteed #1 rankings without sustained organic effort.
        </p>

        <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">6. Limitation of Liability &amp; Warranties</h2>
        <p>
          To the maximum extent permitted under applicable law, {COMPANY_INFO.name} shall not be liable for any indirect, incidental, or consequential damages arising from third-party hosting outages, domain registrar downtime, or external social media platform policy changes. Our maximum aggregate liability for any claim arising from a project agreement shall not exceed the total fees actually paid for the specific service rendered.
        </p>

        <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">7. Governing Law &amp; Dispute Resolution</h2>
        <p>
          These Terms of Service are governed by and construed in accordance with the laws of India. Any disputes arising under or in connection with these terms shall be subject to the exclusive jurisdiction of the competent courts in Mathura, Uttar Pradesh, India.
        </p>

        <h2 className="text-xl font-bold text-slate-900 pt-4 border-t border-slate-100">8. Contact Information &amp; Legal Inquiries</h2>
        <p>
          If you have any questions regarding these Terms of Service or project agreements, please contact our management team directly:
        </p>
        <div className="p-5 rounded-2xl bg-slate-100 border border-slate-200 text-xs space-y-1 font-mono text-slate-800">
          <p className="font-bold text-slate-900">{COMPANY_INFO.name} ({COMPANY_INFO.legalName})</p>
          <p>Campus: {COMPANY_INFO.address.streetAddress}, {COMPANY_INFO.address.addressLocality}, {COMPANY_INFO.address.addressRegion} - {COMPANY_INFO.address.postalCode}, India</p>
          <p>Direct Support Email: {COMPANY_INFO.email} · Phone/WhatsApp: {COMPANY_INFO.phoneDisplay}</p>
        </div>
      </div>
    </div>
  );
}

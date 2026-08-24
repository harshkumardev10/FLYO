import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, HelpCircle, Shield, Zap, Sparkles } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { SERVICES_DATA } from '@/lib/data/services';

export const metadata = generatePageMetadata({
  title: 'Our Digital Services',
  description: 'Explore practical digital services to grow your business online: Web Development, Local SEO, Social Media, and Promotions.',
  canonicalUrl: '/services',
});

const SERVICES_FAQS = [
  {
    question: 'How do I know which service my local business needs first?',
    answer: 'If you do not have an indexable website or your current site is slow on mobile, custom Web Development is the crucial first foundation. If you already have a fast website but lack phone inquiries, Local SEO and Google Maps optimization will bring ready-to-buy customers to your doorstep.',
  },
  {
    question: 'Can you combine multiple services into a single discounted package?',
    answer: 'Yes! Our most popular offering is the Local Business Growth Strategy, which combines custom Next.js web development, Google Business Profile ranking, promotional banners, and WhatsApp direct inquiry funnels into a cohesive package.',
  },
  {
    question: 'What is your typical project delivery turnaround time?',
    answer: 'Promotional posters and YouTube thumbnails are delivered in 24 to 48 hours. Comprehensive web development and Local SEO implementations typically launch in 1 to 2 weeks.',
  },
  {
    question: 'Do you charge ongoing monthly retainer fees?',
    answer: 'No. We operate with transparent flat-rate milestone pricing. You own 100% of your source code and digital assets with zero locked-in contracts.',
  },
];

export default function ServicesIndexPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-20">
      <Breadcrumbs items={[{ name: 'Services', item: '/services' }]} />

      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Tailored Digital Solutions
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Practical digital services engineered for real business revenue.
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          We don&apos;t sell bloated agency retainers or confusing corporate buzzwords. We build high-performance websites, dominate Google Maps search rankings, and design high-impact promotional graphics that help local businesses attract paying customers.
        </p>
      </div>

      {/* Core Principles */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Zap className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Sub-Second Speed</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Built using modern Next.js tech stack for instantaneous mobile loading and pristine Core Web Vitals performance.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Shield className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">100% Client Ownership</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            You retain complete administrative control of all source code, domain name, hosting, and graphic assets.
          </p>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
          <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
            <Sparkles className="w-5 h-5" />
          </div>
          <h3 className="font-bold text-base text-slate-900">Direct Founder Access</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Work directly with our founding student developers with transparent communication and rapid turnaround times.
          </p>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Our Offerings
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Explore All Digital Services
          </h2>
        </div>

        {SERVICES_DATA.map((service) => (
          <div
            key={service.slug}
            className="p-8 rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all flex flex-col lg:flex-row items-start justify-between gap-8"
          >
            <div className="space-y-4 max-w-3xl">
              <div>
                <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider block">
                  Service #{SERVICES_DATA.indexOf(service) + 1}
                </span>
                <h3 className="text-2xl font-extrabold text-slate-900 mt-1">
                  <Link href={`/services/${service.slug}`} className="hover:text-indigo-600 transition-colors">
                    {service.title}
                  </Link>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed">
                  {service.shortDescription}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider block">
                  Core Inclusions &amp; Deliverables:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {service.whatWeProvide.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 w-full lg:w-auto flex flex-col sm:flex-row lg:flex-col gap-3">
              <Link
                href={`/services/${service.slug}`}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>View Full Service Details</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
              <Link
                href="/contact"
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-bold text-xs transition-colors flex items-center justify-center"
              >
                <span>Request Custom Quote</span>
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Services FAQ Section */}
      <section className="space-y-6 pt-4 border-t border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Got Questions?</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Service Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {SERVICES_FAQS.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-900">{faq.question}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Custom Requirement Banner */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white text-center space-y-4 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Need a custom package for your business?</h2>
        <p className="text-xs sm:text-sm text-slate-300 max-w-xl mx-auto leading-relaxed">
          We can combine web development, Google ranking, poster design, and WhatsApp funnels into a custom growth package tailored to your exact budget.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors shadow-sm"
        >
          <span>Discuss Custom Package</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

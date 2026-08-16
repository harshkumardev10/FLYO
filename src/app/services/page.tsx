import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { SERVICES_DATA } from '@/lib/data/services';

export const metadata = generatePageMetadata({
  title: 'Our Digital Services | Pulse Studio',
  description: 'Explore practical digital services for local businesses: Web Development, Promotions, SEO, Social Media Handling, Poster Design, Thumbnail Design, and Local Business Growth Strategy.',
  canonicalUrl: '/services',
});

export default function ServicesIndexPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-20">
      <Breadcrumbs items={[{ name: 'Services', item: '/services' }]} />

      <div className="max-w-2xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Our Services
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Practical digital services for local business needs.
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          We don't sell bloated agency retainers. We provide essential digital tools and services that help local businesses build credibility, reach local customers, and grow.
        </p>
      </div>

      <div className="space-y-6">
        {SERVICES_DATA.map((service) => (
          <div
            key={service.slug}
            className="p-8 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-card-hover transition-all flex flex-col md:flex-row items-start justify-between gap-6"
          >
            <div className="space-y-4 max-w-2xl">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  <Link href={`/services/${service.slug}`} className="hover:text-indigo-600 transition-colors">
                    {service.title}
                  </Link>
                </h2>
                <p className="text-xs sm:text-sm text-slate-600 mt-1 leading-relaxed">
                  {service.shortDescription}
                </p>
              </div>

              <div className="space-y-2 pt-2">
                <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                  What We Provide:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-600">
                  {service.whatWeProvide.slice(0, 4).map((item, idx) => (
                    <div key={idx} className="flex items-start gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-indigo-600 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="shrink-0 pt-4 md:pt-0 w-full md:w-auto">
              <Link
                href={`/services/${service.slug}`}
                className="w-full md:w-auto px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Learn More</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>

      {/* Custom Requirement Banner */}
      <div className="p-8 rounded-2xl bg-indigo-50 border border-indigo-100 text-center space-y-3">
        <h2 className="text-xl font-bold text-slate-900">Need something custom for your business?</h2>
        <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed">
          We can combine web development, design, and social media support into a custom package tailored to your budget.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs transition-colors shadow-sm"
        >
          <span>Discuss Custom Package</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

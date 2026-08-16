import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, HelpCircle, Sparkles } from 'lucide-react';
import { SERVICES_DATA } from '@/lib/data/services';
import { generateServiceMetadata } from '@/lib/seo/metadata';
import { generateServiceSchema, generateFAQSchema } from '@/lib/seo/schemas';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';

interface ServicePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return SERVICES_DATA.map((service) => ({
    slug: service.slug,
  }));
}

export async function generateMetadata({ params }: ServicePageProps) {
  const service = SERVICES_DATA.find((s) => s.slug === params.slug);
  if (!service) return {};

  return generateServiceMetadata({
    title: `${service.title} Services | Pulse Studio`,
    description: service.shortDescription,
    canonicalUrl: `/services/${service.slug}`,
  });
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = SERVICES_DATA.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const serviceUrl = `https://www.pulsedigitalstudio.com/services/${service.slug}`;
  const serviceSchema = generateServiceSchema(service, serviceUrl);
  const faqSchema = generateFAQSchema(service.faqs);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-20">
      <JsonLd data={serviceSchema} />
      {faqSchema && <JsonLd data={faqSchema} />}

      <Breadcrumbs
        items={[
          { name: 'Services', item: '/services' },
          { name: service.title, item: `/services/${service.slug}` },
        ]}
      />

      {/* Hero Section */}
      <div className="space-y-4 border-b border-slate-200 pb-8">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Service Overview
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          {service.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
          {service.shortDescription}
        </p>
        <div className="pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <span>Let's Work Together</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

      {/* What We Provide */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          What We Provide
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {service.whatWeProvide.map((item, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm font-medium text-slate-700">{item}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Who It Is For & Example Deliverables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Who It's For</h2>
          <ul className="space-y-2 text-xs text-slate-600">
            {service.whoItIsFor.map((target, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-1.5 shrink-0" />
                <span>{target}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
          <h2 className="text-lg font-bold text-slate-900">Example Deliverables</h2>
          <ul className="space-y-2 text-xs text-slate-600">
            {service.exampleDeliverables.map((del, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span>{del}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Our Approach */}
      <section className="p-6 sm:p-8 rounded-2xl bg-slate-900 text-white space-y-3">
        <h2 className="text-lg font-bold text-white">Our Approach</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {service.ourApproach}
        </p>
      </section>

      {/* FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="space-y-4">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {service.faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-1.5">
                <h3 className="text-sm font-bold text-slate-900">{faq.question}</h3>
                <p className="text-xs text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="p-8 rounded-2xl bg-indigo-600 text-white text-center space-y-4 shadow-sm">
        <h2 className="text-2xl font-extrabold">Ready to start your {service.title} project?</h2>
        <p className="text-xs text-indigo-100 max-w-md mx-auto leading-relaxed">
          Tell us about your business. We'll provide a clear, fair proposal tailored to your needs.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-white text-indigo-700 font-bold text-xs hover:bg-indigo-50 transition-colors"
        >
          <span>Let's Talk About Your Business</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

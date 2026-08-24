import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, HelpCircle, Sparkles, Zap, ShieldCheck } from 'lucide-react';
import { SERVICES_DATA } from '@/lib/data/services';
import { generateServiceMetadata } from '@/lib/seo/metadata';
import { generateServiceSchema, generateFAQSchema } from '@/lib/seo/schemas';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { JsonLd } from '@/components/seo/JsonLd';
import { COMPANY_INFO } from '@/lib/data/company';

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

  const cleanTitle = `${service.shortTitle || service.title} Services`;
  let desc = `${service.shortDescription} Grow your local business with ${service.title.toLowerCase()} from flyoo businesses.`;
  if (desc.length > 130) {
    desc = desc.slice(0, 127).trim() + '...';
  }

  return generateServiceMetadata({
    title: cleanTitle,
    description: desc,
    canonicalUrl: `/services/${service.slug}`,
  });
}

export default function ServiceDetailPage({ params }: ServicePageProps) {
  const service = SERVICES_DATA.find((s) => s.slug === params.slug);
  if (!service) notFound();

  const serviceUrl = `${COMPANY_INFO.url}/services/${service.slug}`;
  const serviceSchema = generateServiceSchema(service, serviceUrl);
  const faqSchema = generateFAQSchema(service.faqs);

  const paragraphs = (service.detailedDescription || service.shortDescription).split('\n\n');

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
          Professional Digital Service
        </span>
        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          {service.title}
        </h1>
        <p className="text-base sm:text-lg text-slate-600 max-w-3xl leading-relaxed">
          {service.shortDescription}
        </p>
        <div className="pt-2 flex flex-wrap items-center gap-4">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs shadow-sm transition-all"
          >
            <span>Get a Free Quote &amp; Consultation</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="https://wa.me/918273946584"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 px-5 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-semibold text-xs transition-colors"
          >
            <span>Chat on WhatsApp</span>
          </a>
        </div>
      </div>

      {/* In-Depth Overview */}
      <section className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Why It Matters for Your Business</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Transforming Local Searchers into Paying Clients
        </h2>
        <div className="space-y-4 text-sm sm:text-base text-slate-700 leading-relaxed">
          {paragraphs.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>
      </section>

      {/* Key Benefits Grid */}
      {service.keyBenefits && service.keyBenefits.length > 0 && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold text-slate-900">
            Key Commercial Benefits
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {service.keyBenefits.map((b, idx) => (
              <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2 hover:border-indigo-300 transition-colors">
                <div className="w-8 h-8 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold text-xs">
                  0{idx + 1}
                </div>
                <h3 className="font-bold text-base text-slate-900">{b.title}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{b.description}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* What We Provide */}
      <section className="space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
          Everything Included in {service.title}
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

      {/* 4-Stage Process Steps */}
      {service.processSteps && service.processSteps.length > 0 && (
        <section className="space-y-6">
          <div className="space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
              Execution Methodology
            </span>
            <h2 className="text-2xl font-bold text-slate-900">
              Our 4-Stage Delivery Process
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {service.processSteps.map((s, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2 flex flex-col justify-between">
                <div>
                  <span className="font-mono text-xs font-bold text-indigo-600 px-2 py-0.5 rounded-md bg-indigo-50 border border-indigo-100 inline-block">
                    Stage {s.step}
                  </span>
                  <h3 className="font-bold text-sm text-slate-900 pt-2">{s.title}</h3>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">{s.description}</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Who It Is For & Example Deliverables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Ideal For These Businesses</h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
            {service.whoItIsFor.map((target, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <span className="w-1.5 h-1.5 rounded-full bg-indigo-600 mt-2 shrink-0" />
                <span className="leading-relaxed">{target}</span>
              </li>
            ))}
          </ul>
        </div>

        <div className="p-6 sm:p-8 rounded-2xl bg-white border border-slate-200 space-y-4">
          <h2 className="text-lg sm:text-xl font-bold text-slate-900">Tangible Project Deliverables</h2>
          <ul className="space-y-2.5 text-xs sm:text-sm text-slate-600">
            {service.exampleDeliverables.map((del, idx) => (
              <li key={idx} className="flex items-start gap-2.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{del}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Our Approach */}
      <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-4">
        <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
          <ShieldCheck className="w-4 h-4" />
          <span>Our Operating Philosophy</span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">Direct, Transparent &amp; Results-Driven</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {service.ourApproach}
        </p>
      </section>

      {/* FAQs */}
      {service.faqs && service.faqs.length > 0 && (
        <section className="space-y-4 pt-4 border-t border-slate-200">
          <div className="flex items-center gap-2">
            <HelpCircle className="w-5 h-5 text-indigo-600" />
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {service.faqs.map((faq, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-slate-200 space-y-2">
                <h3 className="text-sm sm:text-base font-bold text-slate-900">{faq.question}</h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <div className="p-8 sm:p-10 rounded-3xl bg-indigo-600 text-white text-center space-y-4 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Ready to launch your {service.title} project?</h2>
        <p className="text-xs sm:text-sm text-indigo-100 max-w-lg mx-auto leading-relaxed">
          Contact our student-led team for a free 15-minute consultation and custom project estimate.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <Link
            href="/contact"
            className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-xl bg-white text-indigo-700 font-bold text-xs hover:bg-indigo-50 transition-colors shadow-sm"
          >
            <span>Let&apos;s Talk About Your Project</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="tel:+918273946584"
            className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-xl bg-indigo-700/80 hover:bg-indigo-800 text-white font-bold text-xs transition-colors border border-indigo-400/40"
          >
            <span>Call +91 82739 46584</span>
          </a>
        </div>
      </div>
    </div>
  );
}

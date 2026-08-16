import React from 'react';
import { notFound } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Layers } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/lib/data/work';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';

interface WorkPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return PORTFOLIO_DATA.map((p) => ({
    slug: p.slug,
  }));
}

export async function generateMetadata({ params }: WorkPageProps) {
  const project = PORTFOLIO_DATA.find((p) => p.slug === params.slug);
  if (!project) return {};

  return generatePageMetadata({
    title: `${project.title} | Case Study`,
    description: project.shortDescription,
    canonicalUrl: `/work/${project.slug}`,
  });
}

export default function WorkDetailPage({ params }: WorkPageProps) {
  const project = PORTFOLIO_DATA.find((p) => p.slug === params.slug);
  if (!project) notFound();

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-20">
      <Breadcrumbs
        items={[
          { name: 'Our Work', item: '/work' },
          { name: project.title, item: `/work/${project.slug}` },
        ]}
      />

      {/* Header */}
      <div className="space-y-4 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
          <span className="px-2 py-0.5 rounded bg-indigo-50 text-indigo-700">{project.category}</span>
          <span>•</span>
          <span className="text-slate-500">{project.service}</span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          {project.title}
        </h1>

        <p className="text-base sm:text-lg text-slate-600 leading-relaxed">
          {project.shortDescription}
        </p>
      </div>

      {/* Challenge */}
      <section className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
        <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          The Challenge
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {project.challenge}
        </p>
      </section>

      {/* What We Did */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900">
          What We Did
        </h2>
        <div className="space-y-2">
          {project.whatWeDid.map((step, idx) => (
            <div key={idx} className="p-4 rounded-xl bg-white border border-slate-200 flex items-start gap-3">
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              <span className="text-xs sm:text-sm text-slate-700">{step}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Final Result */}
      <section className="p-6 rounded-2xl bg-slate-900 text-white space-y-3">
        <h2 className="text-lg font-bold text-white">Final Result</h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {project.finalResult}
        </p>
        {project.measurableResult && (
          <div className="pt-2 text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4" />
            <span>Measured Outcome: {project.measurableResult}</span>
          </div>
        )}
      </section>

      {/* CTA */}
      <div className="p-8 rounded-2xl bg-indigo-600 text-white text-center space-y-4 shadow-sm">
        <h2 className="text-2xl font-extrabold">Want similar results for your local business?</h2>
        <p className="text-xs text-indigo-100 max-w-md mx-auto leading-relaxed">
          Let's discuss your business goals and build a clear, effective digital solution.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-white text-indigo-700 font-bold text-xs hover:bg-indigo-50 transition-colors"
        >
          <span>Discuss Your Project</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

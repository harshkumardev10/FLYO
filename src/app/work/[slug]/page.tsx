'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Layers, ArrowLeft } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/lib/data/work';
import { getAllProjects, syncProjectsFromFirestore } from '@/lib/data/workStore';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { WorkProject } from '@/lib/types/seo';

interface WorkPageProps {
  params: {
    slug: string;
  };
}

export default function WorkDetailPage({ params }: WorkPageProps) {
  const [project, setProject] = useState<WorkProject | null>(() => {
    return PORTFOLIO_DATA.find((p) => p.slug === params.slug) || null;
  });

  useEffect(() => {
    const load = () => {
      const all = getAllProjects();
      const found = all.find((p) => p.slug === params.slug);
      if (found) setProject(found);
    };
    load();
    syncProjectsFromFirestore().then(load);
  }, [params.slug]);

  if (!project) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Project Not Found</h1>
        <p className="text-xs text-slate-600">The requested portfolio project could not be located.</p>
        <Link href="/work" className="inline-block px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl">
          Back to Portfolio
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-20">
      <Breadcrumbs
        items={[
          { name: 'Our Work', item: '/work' },
          { name: project.title, item: `/work/${project.slug}` },
        ]}
      />

      {/* Hero Image */}
      {project.heroImage && (
        <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden -mt-2 mb-2 bg-slate-900 border border-slate-200">
          <img
            src={project.heroImage}
            alt={project.title}
            className="w-full h-full object-cover"
            onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
          />
        </div>
      )}

      {/* Header */}
      <div className="space-y-4 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-2 text-xs font-bold text-indigo-600">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700">{project.category}</span>
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
      {project.challenge && (
        <section className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-500">
            The Challenge
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {project.challenge}
          </p>
        </section>
      )}

      {/* What We Did */}
      {project.whatWeDid && project.whatWeDid.length > 0 && (
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
      )}

      {/* Final Result */}
      {project.finalResult && (
        <section className="p-6 rounded-2xl bg-slate-900 text-white space-y-3">
          <h2 className="text-lg font-bold text-white">Final Result & Impact</h2>
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
      )}

      {/* CTA */}
      <div className="p-8 rounded-3xl bg-indigo-600 text-white text-center space-y-4 shadow-sm">
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

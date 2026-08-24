'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { CheckCircle2, ArrowRight, Sparkles, TrendingUp, ShieldCheck } from 'lucide-react';
import { PORTFOLIO_DATA } from '@/lib/data/work';
import { getAllProjects, syncProjectsFromFirestore } from '@/lib/data/workStore';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { WorkProject } from '@/lib/types/seo';

interface WorkPageClientProps {
  slug: string;
  initialProject: WorkProject | null;
}

export default function WorkPageClient({ slug, initialProject }: WorkPageClientProps) {
  const [project, setProject] = useState<WorkProject | null>(initialProject);

  useEffect(() => {
    const load = () => {
      const all = getAllProjects();
      const found = all.find((p) => p.slug === slug);
      if (found) setProject(found);
    };
    load();
    syncProjectsFromFirestore().then(load);
  }, [slug]);

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

        {project.measurableResult && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold">
            <TrendingUp className="w-4 h-4 text-emerald-600" />
            <span>{project.measurableResult}</span>
          </div>
        )}
      </div>

      {/* Challenge Section */}
      <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          The Business Challenge
        </span>
        <h2 className="text-xl font-bold text-slate-900">
          Obstacles &amp; Bottlenecks Faced by {project.clientName}
        </h2>
        <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
          {project.detailedChallenge || project.challenge}
        </p>
      </section>

      {/* Solution Walkthrough */}
      {project.detailedSolution && (
        <section className="p-6 sm:p-8 rounded-3xl bg-white border border-slate-200 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Our Strategic Solution
          </span>
          <h2 className="text-xl font-bold text-slate-900">
            How flyoo Delivered Practical Results
          </h2>
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed">
            {project.detailedSolution}
          </p>
        </section>
      )}

      {/* What We Did */}
      {project.whatWeDid && project.whatWeDid.length > 0 && (
        <section className="space-y-4">
          <h2 className="text-xl sm:text-2xl font-bold text-slate-900">
            Project Scope &amp; Executed Milestones
          </h2>
          <div className="space-y-2.5">
            {project.whatWeDid.map((step, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-slate-200 flex items-start gap-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs sm:text-sm text-slate-700 leading-relaxed">{step}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Final Result */}
      {project.finalResult && (
        <section className="p-6 sm:p-8 rounded-3xl bg-slate-900 text-white space-y-3">
          <div className="flex items-center gap-2 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles className="w-4 h-4" />
            <span>Commercial Outcome</span>
          </div>
          <h2 className="text-xl font-bold text-white">Final Result &amp; Impact</h2>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
            {project.finalResult}
          </p>
        </section>
      )}

      {/* Key Takeaways */}
      {project.keyTakeaways && project.keyTakeaways.length > 0 && (
        <section className="p-6 sm:p-8 rounded-3xl bg-indigo-50 border border-indigo-100 space-y-3">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Key Strategic Takeaways
          </span>
          <ul className="space-y-2 text-xs sm:text-sm text-slate-700">
            {project.keyTakeaways.map((takeaway, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-indigo-600 shrink-0 mt-0.5" />
                <span className="leading-relaxed">{takeaway}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* CTA */}
      <div className="p-8 sm:p-10 rounded-3xl bg-indigo-600 text-white text-center space-y-4 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Want similar results for your business?</h2>
        <p className="text-xs sm:text-sm text-indigo-100 max-w-md mx-auto leading-relaxed">
          Let&apos;s discuss your business goals and build a clear, effective digital solution.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 px-6 py-3.5 rounded-xl bg-white text-indigo-700 font-bold text-xs hover:bg-indigo-50 transition-colors shadow-sm"
        >
          <span>Discuss Your Project</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

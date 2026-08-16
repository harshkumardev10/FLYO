import React from 'react';
import Link from 'next/link';
import { ArrowRight, Layers } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { PORTFOLIO_DATA } from '@/lib/data/work';

export const metadata = generatePageMetadata({
  title: 'Our Work | Portfolio',
  description: 'Explore real project examples by Pulse Studio for local businesses across web development, social media, posters, thumbnails, and branding.',
  canonicalUrl: '/work',
});

export default function WorkIndexPage() {
  const categories = ['All', 'Websites', 'Social Media', 'Posters', 'Thumbnails', 'Branding', 'Marketing'];

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-20">
      <Breadcrumbs items={[{ name: 'Our Work', item: '/work' }]} />

      <div className="max-w-2xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Our Portfolio
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Practical work for real small businesses.
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          We focus on practical execution. Below are sample projects illustrating our work across websites, graphics, posters, and local promotions.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 text-xs">
        {categories.map((cat, idx) => (
          <span
            key={cat}
            className={`px-3.5 py-1.5 rounded-lg border font-medium cursor-pointer transition-colors ${
              idx === 0
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
            }`}
          >
            {cat}
          </span>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {PORTFOLIO_DATA.map((project) => (
          <div
            key={project.slug}
            className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-card-hover transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="flex items-center justify-between text-[11px] font-semibold text-slate-500">
                <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {project.category}
                </span>
                <span>{project.service}</span>
              </div>

              <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                <Link href={`/work/${project.slug}`}>{project.title}</Link>
              </h2>

              <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                {project.shortDescription}
              </p>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6">
              <Link
                href={`/work/${project.slug}`}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group-hover:translate-x-1 transition-all"
              >
                <span>Read Project Story</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

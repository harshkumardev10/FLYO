'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Layers, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { PORTFOLIO_DATA } from '@/lib/data/work';
import { getAllProjects, syncProjectsFromFirestore } from '@/lib/data/workStore';
import { WorkProject } from '@/lib/types/seo';

export default function WorkIndexPage() {
  const [projects, setProjects] = useState<WorkProject[]>(PORTFOLIO_DATA);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setProjects(getAllProjects());
    syncProjectsFromFirestore().then(() => {
      setProjects(getAllProjects());
    });
  }, []);

  const categories = ['All', 'Websites', 'Social Media', 'Posters', 'Thumbnails', 'Branding', 'Marketing'];

  const filteredProjects = activeCategory === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase() === activeCategory.toLowerCase());

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
          We focus on practical execution. Below are real projects illustrating our work across websites, graphics, posters, and local promotions.
        </p>
      </div>

      {/* Category Pills */}
      <div className="flex flex-wrap gap-2 text-xs">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-3.5 py-1.5 rounded-lg border font-medium transition-colors ${
              activeCategory === cat
                ? 'bg-slate-900 text-white border-slate-900'
                : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProjects.map((project) => (
          <div
            key={project.slug}
            className="rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all overflow-hidden flex flex-col justify-between group"
          >
            <div>
              {/* Project Image Header */}
              <div className="relative w-full h-48 bg-slate-900 overflow-hidden flex items-center justify-center">
                {project.heroImage ? (
                  <img
                    src={project.heroImage}
                    alt={project.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent pointer-events-none" />
                <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full bg-white/90 backdrop-blur-md text-slate-800 text-[11px] font-bold shadow-sm">
                  {project.category}
                </span>
              </div>

              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                  <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-700">{project.service}</span>
                  {project.clientName && <span>{project.clientName}</span>}
                </div>

                <h2 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors">
                  <Link href={`/work/${project.slug}`}>{project.title}</Link>
                </h2>

                <p className="text-xs text-slate-600 leading-relaxed line-clamp-3">
                  {project.shortDescription}
                </p>
              </div>
            </div>

            <div className="p-6 pt-0 border-t border-slate-100 mt-4">
              <Link
                href={`/work/${project.slug}`}
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group-hover:translate-x-1 transition-all"
              >
                <span>Read Project Case Study</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

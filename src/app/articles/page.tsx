'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, BookOpen, Clock, User, Sparkles } from 'lucide-react';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { ARTICLES_DATA } from '@/lib/data/articles';
import { getAllArticles, syncFromFirestore } from '@/lib/data/articlesStore';
import { ArticleItem } from '@/lib/types/seo';

export default function ArticlesIndexPage() {
  const [articles, setArticles] = useState<ArticleItem[]>(ARTICLES_DATA);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    setArticles(getAllArticles());
    syncFromFirestore().then(() => {
      setArticles(getAllArticles());
    });
  }, []);

  const categories = ['All', 'SEO', 'Social Media', 'Websites', 'Marketing', 'Local Business', 'Design'];

  const filteredArticles = activeCategory === 'All'
    ? articles
    : articles.filter(a => a.category.toLowerCase() === activeCategory.toLowerCase());

  const featuredArticle = filteredArticles[0] || articles[0];
  const otherArticles = filteredArticles.slice(1);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12 pb-20">
      <Breadcrumbs items={[{ name: 'Articles', item: '/articles' }]} />

      <div className="max-w-2xl space-y-3">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Knowledge Base
        </span>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Practical digital guides for local business owners.
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          No jargon or bloated buzzwords. Written naturally to help you understand how digital tools can practically benefit your business.
        </p>
      </div>

      {/* Featured Article Card */}
      {featuredArticle && (
        <Link href={`/articles/${featuredArticle.slug}`} className="block group">
          <div className="rounded-3xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-xl transition-all overflow-hidden">
            {/* Hero Image */}
            {featuredArticle.heroImage && (
              <div className="relative w-full h-56 sm:h-72 overflow-hidden">
                <Image
                  src={featuredArticle.heroImage}
                  alt={featuredArticle.title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 768px) 100vw, 800px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                <span className="absolute bottom-4 left-4 px-2.5 py-1 rounded bg-blue-600 text-white text-xs font-bold uppercase tracking-wider">
                  Featured · {featuredArticle.category}
                </span>
              </div>
            )}
            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                <span>{featuredArticle.readingTimeMinutes} min read</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-blue-700 transition-colors">
                {featuredArticle.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {featuredArticle.summary}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <span>By {featuredArticle.authorName}</span>
                <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-all">
                  Read Featured Guide
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}

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

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherArticles.map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`} className="block group">
            <article className="rounded-2xl bg-white border border-slate-200 hover:border-blue-300 hover:shadow-lg transition-all flex flex-col overflow-hidden h-full">
              {/* Article Image */}
              {article.heroImage && (
                <div className="relative w-full h-44 overflow-hidden flex-shrink-0">
                  <Image
                    src={article.heroImage}
                    alt={article.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                    sizes="(max-width: 768px) 100vw, 400px"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
                </div>
              )}
              <div className="p-5 flex flex-col flex-1 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="uppercase tracking-wider font-bold text-blue-600">{article.category}</span>
                  <span>{article.readingTimeMinutes} min read</span>
                </div>
                <h2 className="text-base font-bold text-slate-900 group-hover:text-blue-700 transition-colors leading-snug">
                  {article.title}
                </h2>
                <p className="text-xs text-slate-600 line-clamp-2 flex-1">
                  {article.summary}
                </p>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{article.authorName}</span>
                  <span className="font-bold text-blue-600 flex items-center gap-1 group-hover:translate-x-1 transition-all">
                    Read
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}

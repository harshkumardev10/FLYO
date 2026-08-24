'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, BookOpen, Clock, User, Sparkles, HelpCircle, CheckCircle2, Search, Zap } from 'lucide-react';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { ARTICLES_DATA } from '@/lib/data/articles';
import { getAllArticles, syncFromFirestore } from '@/lib/data/articlesStore';
import { ArticleItem } from '@/lib/types/seo';

const BLOG_FAQS = [
  {
    question: 'Are these digital guides tailored specifically for local businesses?',
    answer: 'Yes! Every article in our knowledge base is specifically crafted for local retail stores, service contractors, restaurants, clinics, and emerging local startups looking for actionable steps without corporate marketing jargon.',
  },
  {
    question: 'How often are new growth guides published?',
    answer: 'We publish weekly in-depth tutorials and case study analyses covering Local SEO updates, web conversion best practices, and direct social marketing tactics.',
  },
  {
    question: 'Can I request a guide on a specific topic for my business?',
    answer: 'Absolutely! Send us a message via our Contact page or WhatsApp with the specific challenges you are facing, and our team will prepare a practical guide.',
  },
];

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-20">
      <Breadcrumbs items={[{ name: 'Articles', item: '/articles' }]} />

      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Knowledge Base &amp; Growth Hub
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Practical digital guides for local business owners.
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          No jargon or bloated agency buzzwords. Written naturally by student developers and strategists to help you understand how digital tools, Google Maps ranking, and high-speed web design practically increase your revenue and customer count.
        </p>
      </div>

      {/* Featured Article Card */}
      {featuredArticle && (
        <Link href={`/articles/${featuredArticle.slug}`} className="block group">
          <div className="rounded-3xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl transition-all overflow-hidden">
            {/* Hero Image */}
            <div className="relative w-full h-56 sm:h-72 overflow-hidden bg-slate-900 flex items-center justify-center">
              {featuredArticle.heroImage ? (
                <img
                  src={featuredArticle.heroImage}
                  alt={featuredArticle.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              ) : null}
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-slate-950/20 to-transparent pointer-events-none" />
              <span className="absolute bottom-4 left-4 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold uppercase tracking-wider shadow-sm">
                Featured · {featuredArticle.category}
              </span>
            </div>

            <div className="p-6 sm:p-8 space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-500 font-semibold">
                <span>{featuredArticle.readingTimeMinutes} min read</span>
                <span>•</span>
                <span>{featuredArticle.publishedAt}</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors">
                {featuredArticle.title}
              </h2>
              <p className="text-sm text-slate-600 leading-relaxed">
                {featuredArticle.summary}
              </p>
              <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
                <span>By {featuredArticle.authorName} ({featuredArticle.authorRole})</span>
                <span className="font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-all">
                  Read Featured Guide
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </div>
        </Link>
      )}

      {/* Core Growth Pillars Guide */}
      <section className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white space-y-6">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            Digital Growth Fundamentals
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            The 3 Non-Negotiable Pillars of Online Success
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            Every article and tutorial in our library revolves around mastering these three high-impact areas for local commerce:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold">
              <Search className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-white">1. Local Search Intent</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Capturing buyers right when they search for nearby services on Google Maps and Local 3-Pack results.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-white">2. High-Speed Conversion</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Delivering sub-second loading websites equipped with instant WhatsApp and one-tap phone inquiry buttons.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <div className="w-8 h-8 rounded-lg bg-indigo-600/30 text-indigo-400 flex items-center justify-center font-bold">
              <Sparkles className="w-4 h-4" />
            </div>
            <h3 className="font-bold text-base text-white">3. Authentic Trust</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Building unstoppable social proof through authentic customer reviews and engaging visual storytelling.
            </p>
          </div>
        </div>
      </section>

      {/* Category Filter Pills */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold text-slate-900">Explore Articles by Category</h2>
          <span className="text-xs text-slate-500">{filteredArticles.length} guides available</span>
        </div>

        <div className="flex flex-wrap gap-2 text-xs">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-4 py-2 rounded-xl border font-bold transition-colors ${
                activeCategory === cat
                  ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm'
                  : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Article Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {otherArticles.map((article) => (
          <Link key={article.slug} href={`/articles/${article.slug}`} className="block group">
            <article className="rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-lg transition-all flex flex-col overflow-hidden h-full">
              {/* Article Image */}
              <div className="relative w-full h-44 bg-slate-900 overflow-hidden flex-shrink-0">
                {article.heroImage ? (
                  <img
                    src={article.heroImage}
                    alt={article.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    onError={(e) => {
                      (e.target as HTMLImageElement).style.display = 'none';
                    }}
                  />
                ) : null}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/40 to-transparent pointer-events-none" />
              </div>

              <div className="p-5 flex flex-col flex-1 space-y-3">
                <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                  <span className="uppercase tracking-wider font-bold text-indigo-600">{article.category}</span>
                  <span>{article.readingTimeMinutes} min read</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                  {article.title}
                </h3>
                <p className="text-xs text-slate-600 line-clamp-2 flex-1">
                  {article.summary}
                </p>
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                  <span>{article.authorName}</span>
                  <span className="font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-all">
                    Read Guide
                    <ArrowRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </div>
            </article>
          </Link>
        ))}
      </div>

      {/* Blog FAQs */}
      <section className="space-y-6 pt-4 border-t border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Knowledge Base FAQs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {BLOG_FAQS.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-900">{faq.question}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Box */}
      <div className="p-8 sm:p-10 rounded-3xl bg-indigo-600 text-white text-center space-y-4 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Need help implementing these strategies?</h2>
        <p className="text-xs sm:text-sm text-indigo-100 max-w-lg mx-auto leading-relaxed">
          Book a free 15-minute consultation with our student developers to audit your website and Local SEO strategy.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-xs transition-colors shadow-sm"
        >
          <span>Get Free Consultation</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

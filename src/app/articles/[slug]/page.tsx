'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Calendar, Clock, User, ArrowRight, BookOpen } from 'lucide-react';
import { ARTICLES_DATA } from '@/lib/data/articles';
import { getAllArticles, syncFromFirestore } from '@/lib/data/articlesStore';
import { SERVICES_DATA } from '@/lib/data/services';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { ArticleItem } from '@/lib/types/seo';

interface ArticlePageProps {
  params: {
    slug: string;
  };
}

export default function ArticleDetailPage({ params }: ArticlePageProps) {
  const [article, setArticle] = useState<ArticleItem | null>(() => {
    return ARTICLES_DATA.find((a) => a.slug === params.slug) || null;
  });

  useEffect(() => {
    const load = () => {
      const all = getAllArticles();
      const found = all.find((a) => a.slug === params.slug);
      if (found) setArticle(found);
    };
    load();
    syncFromFirestore().then(load);
  }, [params.slug]);

  if (!article) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center space-y-4">
        <h1 className="text-2xl font-bold text-slate-900">Article Not Found</h1>
        <p className="text-xs text-slate-600">The requested article could not be located.</p>
        <Link href="/articles" className="inline-block px-4 py-2 bg-indigo-600 text-white font-bold text-xs rounded-xl">
          Back to Articles
        </Link>
      </div>
    );
  }

  const relatedService = article.relatedServiceSlug
    ? SERVICES_DATA.find((s) => s.slug === article.relatedServiceSlug)
    : null;

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      <Breadcrumbs
        items={[
          { name: 'Articles', item: '/articles' },
          { name: article.title, item: `/articles/${article.slug}` },
        ]}
      />

      {/* Hero Image */}
      {article.heroImage && (
        <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-2xl overflow-hidden -mt-2 mb-2">
          <Image
            src={article.heroImage}
            alt={article.title}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 900px"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
        </div>
      )}

      {/* Header */}
      <div className="space-y-4 border-b border-slate-200 pb-8">
        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
          <span className="px-2.5 py-1 rounded bg-blue-50 text-blue-700 font-bold uppercase tracking-wider">
            {article.category}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5 text-slate-400" /> {article.publishedAt}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-slate-400" /> {article.readingTimeMinutes} min read
          </span>
        </div>

        <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          {article.title}
        </h1>

        <div className="flex items-center gap-3 pt-2 text-xs text-slate-600">
          <User className="w-4 h-4 text-blue-600" />
          <span>Written by <strong>{article.authorName}</strong> ({article.authorRole})</span>
        </div>
      </div>

      {/* Article Content */}
      <div
        className="prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-h2:text-xl prose-h2:mt-8 prose-h2:mb-3 prose-p:text-slate-700 prose-p:leading-relaxed prose-p:text-sm prose-li:text-sm prose-li:text-slate-700"
        dangerouslySetInnerHTML={{ __html: article.contentHtml }}
      />

      {/* Related Service Link */}
      {relatedService && (
        <div className="p-6 rounded-2xl bg-indigo-50 border border-indigo-100 space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Need Help Implementing This?
          </span>
          <h2 className="text-lg font-bold text-slate-900">{relatedService.title}</h2>
          <p className="text-xs text-slate-600 leading-relaxed">
            {relatedService.shortDescription}
          </p>
          <Link
            href={`/services/${relatedService.slug}`}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-indigo-600 hover:underline pt-1"
          >
            <span>Learn about our {relatedService.title} service</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* CTA */}
      <div className="p-8 rounded-2xl bg-slate-900 text-white text-center space-y-4">
        <h2 className="text-xl sm:text-2xl font-bold">Have questions about your local business online?</h2>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          We're happy to discuss your digital presence and point you in the right direction.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-1.5 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
        >
          <span>Let's Talk About Your Business</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </article>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Calendar, Clock, User, ArrowRight, HelpCircle, ChevronDown, Sparkles } from 'lucide-react';
import { getAllArticles, syncFromFirestore } from '@/lib/data/articlesStore';
import { SERVICES_DATA } from '@/lib/data/services';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { ArticleItem } from '@/lib/types/seo';
import { formatContentWithHyperlinks } from '@/lib/utils/formatContent';
import { getOrGenerateArticleFaqs, FAQItem } from '@/lib/utils/faqGenerator';
import ShareArticle from '@/components/ui/ShareArticle';

interface ArticlePageClientProps {
  slug: string;
  initialArticle: ArticleItem | null;
}

export default function ArticlePageClient({ slug, initialArticle }: ArticlePageClientProps) {
  const [article, setArticle] = useState<ArticleItem | null>(initialArticle);
  const [imgError, setImgError] = useState(false);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0); // First open by default

  useEffect(() => {
    const load = () => {
      const all = getAllArticles();
      const found = all.find((a) => a.slug === slug);
      if (found) setArticle(found);
    };
    load();
    syncFromFirestore().then(load);
  }, [slug]);

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

  const formattedHtml = formatContentWithHyperlinks(article.contentHtml);
  const articleFaqs = article.faqs && article.faqs.length > 0 ? article.faqs.filter((f) => f.question?.trim() && f.answer?.trim()) : [];

  return (
    <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10 pb-20">
      <Breadcrumbs
        items={[
          { name: 'Articles', item: '/articles' },
          { name: article.title, item: `/articles/${article.slug}` },
        ]}
      />

      {/* Hero Image with Alt Text & Format */}
      {article.heroImage && !imgError ? (
        <div className="relative w-full h-64 sm:h-80 md:h-96 rounded-3xl overflow-hidden -mt-2 mb-2 bg-slate-100 border border-slate-200 shadow-sm">
          <img
            src={article.heroImage}
            alt={article.heroImageAlt || article.title}
            onError={() => setImgError(true)}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />
        </div>
      ) : (
        <div className="relative w-full h-48 sm:h-64 rounded-3xl overflow-hidden -mt-2 mb-2 bg-gradient-to-r from-indigo-900 via-slate-900 to-violet-900 p-8 flex items-end">
          <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-white text-xs font-bold uppercase tracking-wider border border-white/30">
            {article.category}
          </span>
        </div>
      )}

      {/* Header */}
      <div className="space-y-4 border-b border-slate-200 pb-8">
        <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 font-medium">
          <span className="px-2.5 py-1 rounded-lg bg-indigo-50 text-indigo-700 font-bold uppercase tracking-wider border border-indigo-100">
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

        {/* Author + Share row */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
          <div className="flex items-center gap-3 text-xs text-slate-600">
            <User className="w-4 h-4 text-indigo-600" />
            <span>Written by <strong>{article.authorName}</strong> ({article.authorRole})</span>
          </div>
          <ShareArticle
            title={article.title}
            summary={article.summary}
            slug={article.slug}
            heroImage={article.heroImage}
          />
        </div>
      </div>

      {/* Article Content */}
      <div
        className="article-content-body prose prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:tracking-tight prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-3 prose-p:text-slate-700 prose-p:leading-[1.8] sm:prose-p:leading-[1.85] prose-p:text-base sm:prose-p:text-lg prose-p:mb-6 prose-strong:font-bold prose-strong:text-slate-900 prose-em:italic prose-em:text-slate-800 prose-a:text-blue-600 prose-a:underline prose-a:font-semibold prose-a:decoration-blue-500/80 prose-a:underline-offset-2 hover:prose-a:text-blue-800 transition-colors font-normal"
        dangerouslySetInnerHTML={{ __html: formattedHtml }}
      />

      {/* ── FREQUENTLY ASKED QUESTIONS (FAQ) SECTION ── */}
      {articleFaqs && articleFaqs.length > 0 && (
        <section aria-labelledby="article-faq-heading" className="pt-8 border-t border-slate-200 space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="space-y-1">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
                <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
                <span>Frequently Asked Questions</span>
              </div>
              <h2 id="article-faq-heading" className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Got Questions? Here Are The Answers
              </h2>
            </div>
            <span className="text-xs text-slate-500">
              {articleFaqs.length} {articleFaqs.length === 1 ? 'question' : 'questions'} answered
            </span>
          </div>

          {/* Accordion List */}
          <div className="space-y-3">
            {articleFaqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className={`rounded-2xl border transition-all overflow-hidden ${
                    isOpen
                      ? 'bg-white border-indigo-300 shadow-md ring-1 ring-indigo-200/60'
                      : 'bg-slate-50/70 border-slate-200/90 hover:bg-white hover:border-slate-300'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full px-5 py-4 text-left flex items-center justify-between gap-4 transition-colors"
                    aria-expanded={isOpen}
                  >
                    <div className="flex items-center gap-3">
                      <span
                        className={`w-7 h-7 rounded-xl flex items-center justify-center text-xs font-bold font-mono shrink-0 transition-colors ${
                          isOpen
                            ? 'bg-indigo-600 text-white'
                            : 'bg-white text-slate-600 border border-slate-200 shadow-xs'
                        }`}
                      >
                        Q{index + 1}
                      </span>
                      <span className="text-sm sm:text-base font-bold text-slate-900 leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 transition-transform duration-200 ${
                        isOpen
                          ? 'rotate-180 bg-indigo-50 text-indigo-700'
                          : 'bg-slate-100 text-slate-400'
                      }`}
                    >
                      <ChevronDown className="w-4 h-4" />
                    </div>
                  </button>

                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-slate-600 text-sm sm:text-[15px] leading-relaxed border-t border-indigo-100/60 animate-in fade-in duration-150">
                      <p className="pl-10 text-slate-700 font-normal">
                        {faq.answer}
                      </p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* Related Service */}
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

      {/* Share nudge */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-5 rounded-2xl bg-indigo-50 border border-indigo-100">
        <div>
          <p className="font-bold text-slate-900 text-sm">Found this helpful? Share it!</p>
          <p className="text-xs text-slate-500 mt-0.5">Help others discover this guide.</p>
        </div>
        <ShareArticle
          title={article.title}
          summary={article.summary}
          slug={article.slug}
          heroImage={article.heroImage}
        />
      </div>

      {/* CTA */}
      <div className="p-8 rounded-3xl bg-slate-900 text-white text-center space-y-4 shadow-sm">
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

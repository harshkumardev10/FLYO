'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Layers, Sparkles, CheckCircle2, HelpCircle, TrendingUp, Users, Award, Zap } from 'lucide-react';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { PORTFOLIO_DATA } from '@/lib/data/work';
import { getAllProjects, syncProjectsFromFirestore } from '@/lib/data/workStore';
import { WorkProject } from '@/lib/types/seo';

const WORK_FAQS = [
  {
    question: 'What types of projects does flyoo businesses take on?',
    answer: 'We specialize in real, practical work for local businesses: custom Next.js websites, SEO and Google Maps optimization, social media content calendars, promotional poster design, YouTube thumbnail creation, and full local business growth strategy packages. Every project is executed with a focus on measurable outcomes.',
  },
  {
    question: 'How long does a typical web development project take?',
    answer: 'A standard local business website with digital menu, WhatsApp integration, and Google Maps embed typically goes live within 5 to 10 business days. More complex projects with custom features or e-commerce integrations may take 2 to 3 weeks. Promotional poster and graphic design projects are often delivered within 24 to 48 hours.',
  },
  {
    question: 'Do I own the website and all design assets after the project is complete?',
    answer: 'Absolutely. Upon final payment, you receive 100% full ownership of your source code, all design files (Figma, Adobe, etc.), your domain name, and your hosting environment. We never hold client assets hostage or charge hidden monthly lock-in fees.',
  },
  {
    question: 'Can you work with businesses outside Mathura, Uttar Pradesh?',
    answer: 'Yes. While our roots are in Mathura, we work with local stores, restaurants, service providers, and startups across all of India. All consultations are conducted via WhatsApp video calls or Google Meet, enabling fast, seamless project coordination without requiring in-person meetings.',
  },
  {
    question: 'How do you measure the success of your projects?',
    answer: 'We define measurable milestones at the project outset: page load speed benchmarks, Google Maps ranking improvements, WhatsApp inquiry volumes, and CTR on social media graphics. Every case study in our portfolio includes real, documented results so you can evaluate outcomes before signing on.',
  },
];



export default function WorkIndexPage() {
  const SERVICES_HIGHLIGHTS = [
    {
      icon: <Layers className="w-5 h-5 text-indigo-600" />,
      title: 'Web Development',
      description: 'Next.js websites built for speed, mobile conversions, and local SEO dominance.',
    },
    {
      icon: <TrendingUp className="w-5 h-5 text-indigo-600" />,
      title: 'Local SEO & Google Maps',
      description: 'Rank in the Google Maps 3-Pack and attract high-intent local customers.',
    },
    {
      icon: <Users className="w-5 h-5 text-indigo-600" />,
      title: 'Social Media Handling',
      description: 'Consistent brand storytelling and community engagement across Instagram and Facebook.',
    },
    {
      icon: <Award className="w-5 h-5 text-indigo-600" />,
      title: 'Design & Promotions',
      description: 'Print-ready posters, YouTube thumbnails, and campaign creatives with fast turnaround.',
    },
  ];
  const [projects, setProjects] = useState<WorkProject[]>(PORTFOLIO_DATA);
  const [activeCategory, setActiveCategory] = useState('All');
  const [openFaq, setOpenFaq] = useState<number | null>(null);

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
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-20">
      <Breadcrumbs items={[{ name: 'Our Work', item: '/work' }]} />

      {/* Hero Header */}
      <div className="max-w-3xl space-y-5">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Real Portfolio. Real Results.
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Practical digital work for real local businesses.
        </h1>
        <div className="space-y-4 text-slate-600 text-sm sm:text-base leading-relaxed">
          <p>
            At <strong>flyoo businesses</strong>, every project we take on is designed with one objective in mind: delivering measurable business results for local stores, restaurants, service providers, and growing startups. We don&apos;t build websites for the sake of good-looking screenshots—we build high-converting digital engines that bring paying customers through your door.
          </p>
          <p>
            Our portfolio spans custom <strong>Next.js web development</strong>, <strong>local SEO and Google Maps optimization</strong>, <strong>social media content management</strong>, high-impact <strong>promotional poster design</strong>, and full <strong>local business growth strategy</strong> packages. Each case study below documents the real challenge the client faced, what our student team executed, and the documented outcome.
          </p>
          <p>
            Whether you are a restaurant owner looking to replace a slow PDF menu with an interactive digital site, a gym looking to fill memberships through a seasonal promotion campaign, or a coffee roaster wanting a more active social presence—our portfolio gives you a transparent, honest look at how we work and what we deliver.
          </p>
        </div>
      </div>

      {/* Service Highlights */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {SERVICES_HIGHLIGHTS.map((s) => (
          <div key={s.title} className="rounded-xl border border-slate-200 bg-white p-5 space-y-3 hover:border-indigo-200 hover:shadow-md transition-all">
            <div className="w-9 h-9 rounded-lg bg-indigo-50 flex items-center justify-center">
              {s.icon}
            </div>
            <h3 className="text-sm font-bold text-slate-900">{s.title}</h3>
            <p className="text-xs text-slate-600 leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>

      {/* Category Pills */}
      <div className="space-y-4">
        <h2 className="text-lg font-bold text-slate-900">Browse by Category</h2>
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

                {project.measurableResult && (
                  <div className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full w-fit">
                    <Zap className="w-3 h-3" />
                    <span>{project.measurableResult}</span>
                  </div>
                )}
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

      {/* Why Our Work Matters */}
      <div className="rounded-2xl bg-gradient-to-br from-indigo-50 to-slate-50 border border-indigo-100 p-8 space-y-6">
        <div className="max-w-2xl space-y-3">
          <h2 className="text-2xl font-extrabold text-slate-900">Why every project in our portfolio is documentation, not decoration.</h2>
          <p className="text-slate-600 text-sm leading-relaxed">
            Most agencies share glossy portfolio screenshots without any context. Our case studies document the real business problem, the specific decisions we made, and the measurable outcome. We believe a portfolio should help you predict your own results, not just admire ours.
          </p>
        </div>
        <ul className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
          {[
            'Real client names and transparent project scope',
            "Documented challenges before flyoo's involvement",
            'Step-by-step breakdown of what we built or designed',
            'Measurable results: load speeds, rankings, inquiry rates',
            'Key takeaways you can apply to your own business',
            'Direct WhatsApp link to discuss a similar project',
          ].map((point) => (
            <li key={point} className="flex items-start gap-2 text-slate-700">
              <CheckCircle2 className="w-4 h-4 text-indigo-500 mt-0.5 shrink-0" />
              <span className="text-xs leading-relaxed">{point}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* FAQ Section */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <HelpCircle className="w-5 h-5 text-indigo-500" />
          <h2 className="text-xl font-extrabold text-slate-900">Frequently Asked Questions About Our Work</h2>
        </div>
        <div className="space-y-3">
          {WORK_FAQS.map((faq, i) => (
            <div key={i} className="rounded-xl border border-slate-200 bg-white overflow-hidden">
              <button
                onClick={() => setOpenFaq(openFaq === i ? null : i)}
                className="w-full flex items-center justify-between p-5 text-left hover:bg-slate-50 transition-colors"
                aria-expanded={openFaq === i}
              >
                <span className="text-sm font-semibold text-slate-900">{faq.question}</span>
                <Sparkles className={`w-4 h-4 text-indigo-400 shrink-0 transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
              </button>
              {openFaq === i && (
                <div className="px-5 pb-5 text-sm text-slate-600 leading-relaxed border-t border-slate-100 pt-4">
                  {faq.answer}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* CTA Section */}
      <div className="rounded-2xl bg-slate-900 text-white p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <div className="space-y-2">
          <h2 className="text-xl font-extrabold">Ready to start your own success story?</h2>
          <p className="text-slate-400 text-sm leading-relaxed">
            Tell us about your business challenge and we&apos;ll outline exactly how we&apos;d approach your project.
          </p>
        </div>
        <Link
          href="/contact"
          className="shrink-0 inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold px-6 py-3 rounded-xl transition-colors"
        >
          <span>Get a Free Consultation</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

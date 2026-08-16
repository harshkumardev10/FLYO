import React from 'react';
import Link from 'next/link';
import { 
  ArrowRight, 
  CheckCircle2, 
  Sparkles, 
  Layout, 
  Megaphone, 
  Search, 
  Share2, 
  Image as ImageIcon, 
  TrendingUp, 
  Users, 
  Zap,
  Star,
  Award,
  Clock,
  Phone,
  MessageSquare
} from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { GSAPWrapper } from '@/components/ui/GSAPWrapper';
import { SERVICES_DATA } from '@/lib/data/services';
import { PORTFOLIO_DATA } from '@/lib/data/work';
import { ARTICLES_DATA } from '@/lib/data/articles';
import { COMPANY_INFO } from '@/lib/data/company';

export const metadata = generatePageMetadata({
  title: 'FLYO | Make Your Business Fly - Local SEO & Web Development India',
  description: 'FLYO helps local businesses fly in the digital world. We build stunning websites, run local SEO, create promotional content, and manage social media — all by a passionate student-led team.',
  canonicalUrl: '/',
});

export default function HomePage() {
  const iconMap: Record<string, React.ReactNode> = {
    Layout: <Layout className="w-6 h-6 text-indigo-600" />,
    Megaphone: <Megaphone className="w-6 h-6 text-indigo-600" />,
    Search: <Search className="w-6 h-6 text-indigo-600" />,
    Share2: <Share2 className="w-6 h-6 text-indigo-600" />,
    Image: <ImageIcon className="w-6 h-6 text-indigo-600" />,
    Sparkles: <Sparkles className="w-6 h-6 text-indigo-600" />,
    TrendingUp: <TrendingUp className="w-6 h-6 text-indigo-600" />,
  };

  const processSteps = [
    {
      step: '01',
      icon: '🔍',
      title: 'Understand',
      desc: 'We learn your business, local audience, and growth goals in depth.',
    },
    {
      step: '02',
      icon: '📋',
      title: 'Plan',
      desc: 'We map the right digital opportunities that fit your practical needs.',
    },
    {
      step: '03',
      icon: '⚡',
      title: 'Create',
      desc: 'We design and build digital solutions with care and precision.',
    },
    {
      step: '04',
      icon: '📈',
      title: 'Improve',
      desc: 'We track performance and iterate so your business keeps flying.',
    },
  ];

  const stats = [
    { label: 'Businesses Helped', value: '30+', icon: <Users className="w-5 h-5" /> },
    { label: 'Projects Delivered', value: '50+', icon: <Award className="w-5 h-5" /> },
    { label: 'Avg. Response Time', value: '2 hrs', icon: <Clock className="w-5 h-5" /> },
    { label: 'Client Satisfaction', value: '4.9★', icon: <Star className="w-5 h-5" /> },
  ];

  const differentiators = [
    { icon: '🎯', title: 'Built for Local Businesses', desc: 'We understand the unique challenges of small local businesses and craft solutions around your real goals.' },
    { icon: '💰', title: 'Honest & Fair Pricing', desc: 'No bloated packages. You only pay for what actually benefits your business — nothing more.' },
    { icon: '⚡', title: 'Fast Turnaround', desc: 'Quick delivery without compromising quality. Your time matters as much as ours.' },
    { icon: '🤝', title: 'Long-term Partnership', desc: 'We don\'t just build and disappear. We stay involved to help your business grow continuously.' },
  ];

  return (
    <div className="overflow-hidden">
      
      {/* ═══════════════════════════════════════════
          HERO SECTION - Dark, Bold, Animated
      ═══════════════════════════════════════════ */}
      <section className="relative min-h-screen flex items-center justify-center bg-slate-950 overflow-hidden">
        
        {/* Background: Full bleed Unsplash growth image */}
        <div className="absolute inset-0">
          <img
            src="https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?q=80&w=2070&auto=format&fit=crop"
            alt="Business growth digital strategy"
            className="w-full h-full object-cover opacity-20"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-slate-950/90 via-slate-950/80 to-slate-950" />
        </div>

        {/* Animated grid overlay */}
        <div className="absolute inset-0 hero-grid opacity-40" />

        {/* Glowing orbs */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl animate-float" />
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl animate-float delay-300" />

        {/* Hero Content */}
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-32 text-center space-y-10">
          
          {/* Pill Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold tracking-wider uppercase backdrop-blur-sm animate-fade-in">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Student-Led Digital Studio · India</span>
          </div>

          {/* Main Headline */}
          <div className="space-y-4 animate-fade-in-up delay-100">
            <h1 className="text-5xl sm:text-7xl font-extrabold text-white tracking-tight leading-[1.08]">
              Make Your Business{' '}
              <span className="relative inline-block">
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-violet-400 to-cyan-400 animate-gradient">
                  Fly
                </span>
                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 8" fill="none">
                  <path d="M0 4 Q100 0 200 4" stroke="url(#underlineGrad)" strokeWidth="2" strokeLinecap="round"/>
                  <defs>
                    <linearGradient id="underlineGrad" x1="0" y1="0" x2="200" y2="0">
                      <stop stopColor="#818cf8" />
                      <stop offset="1" stopColor="#22d3ee" />
                    </linearGradient>
                  </defs>
                </svg>
              </span>
            </h1>
            <p className="text-lg sm:text-xl text-slate-300 max-w-2xl mx-auto leading-relaxed font-normal">
              We build websites, run local SEO, create promotional content, and manage social media — helping local businesses grow with smart, practical digital solutions.
            </p>
          </div>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 animate-fade-in-up delay-200">
            <Link
              href="/contact"
              id="hero-cta-primary"
              className="group w-full sm:w-auto px-8 py-4 rounded-2xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm transition-all shadow-lg shadow-indigo-600/30 hover:shadow-indigo-500/40 hover:scale-105 active:scale-95 flex items-center justify-center gap-2"
            >
              <span>Start Growing Today</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/services"
              id="hero-cta-secondary"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white/5 hover:bg-white/10 border border-white/20 hover:border-white/30 text-white font-bold text-sm transition-all backdrop-blur-sm flex items-center justify-center gap-2"
            >
              Explore Services
            </Link>
          </div>

          {/* Social Proof strip */}
          <div className="pt-6 animate-fade-in-up delay-300">
            <div className="inline-flex flex-wrap items-center justify-center gap-6 px-8 py-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
              <div className="flex items-center gap-2 text-slate-300 text-xs font-medium">
                <div className="flex -space-x-2">
                  {['🧑', '👩', '👨', '🧑'].map((emoji, i) => (
                    <div key={i} className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-xs border-2 border-slate-950">
                      {emoji}
                    </div>
                  ))}
                </div>
                <span><strong className="text-white">30+</strong> businesses trust FLYO</span>
              </div>
              <div className="h-5 w-px bg-white/10" />
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span><strong className="text-white">4.9/5</strong> rating</span>
              </div>
              <div className="h-5 w-px bg-white/10" />
              <div className="flex items-center gap-1.5 text-xs font-medium text-slate-300">
                <Zap className="w-3.5 h-3.5 text-emerald-400" />
                <span>2hr average response</span>
              </div>
            </div>
          </div>

          {/* WhatsApp Quick CTA */}
          <div className="animate-fade-in-up delay-400">
            <a
              href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=Hi FLYO! I want to grow my business digitally.`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-emerald-400 transition-colors group"
            >
              <div className="w-6 h-6 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center group-hover:bg-emerald-500/30 transition-colors">
                <MessageSquare className="w-3 h-3 text-emerald-400" />
              </div>
              <span>Or chat on WhatsApp: {COMPANY_INFO.phoneDisplay}</span>
            </a>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-slate-500 text-xs animate-bounce">
          <span>Scroll</span>
          <div className="w-0.5 h-8 bg-gradient-to-b from-slate-500 to-transparent rounded-full" />
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          STATS BAR
      ═══════════════════════════════════════════ */}
      <section className="bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, i) => (
              <div key={i} className="text-center space-y-1">
                <div className="flex items-center justify-center gap-1.5 text-indigo-600 mb-2">
                  {stat.icon}
                </div>
                <div className="text-3xl font-extrabold text-slate-900">{stat.value}</div>
                <div className="text-xs font-medium text-slate-500">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SERVICES SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              What We Do
            </span>
            <h2 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
              Services built for{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">
                real results
              </span>
            </h2>
            <p className="text-slate-600 text-base leading-relaxed">
              We focus on practical digital tools that deliver value to local businesses — no fluff, no upsells.
            </p>
          </div>

          <GSAPWrapper animation="staggerChildren" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {SERVICES_DATA.map((service, idx) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                className="group p-7 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-indigo-50 to-violet-50 border border-indigo-100 flex items-center justify-center group-hover:from-indigo-100 group-hover:to-violet-100 transition-all">
                    {iconMap[service.iconName] || <Layout className="w-6 h-6 text-indigo-600" />}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900 group-hover:text-indigo-600 transition-colors mb-2">
                      {service.title}
                    </h3>
                    <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">
                      {service.shortDescription}
                    </p>
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-slate-100 flex items-center justify-between">
                  <span className="text-xs font-bold text-indigo-600 group-hover:text-indigo-700 flex items-center gap-1">
                    <span>Learn More</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </span>
                  <span className="px-2.5 py-1 rounded-full bg-slate-100 text-slate-500 text-[10px] font-bold uppercase tracking-wider">
                    Service
                  </span>
                </div>
              </Link>
            ))}
          </GSAPWrapper>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          WHY FLYO - DIFFERENTIATORS SECTION
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            
            {/* Left: Text */}
            <div className="space-y-8">
              <div className="space-y-4">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-700 text-xs font-bold uppercase tracking-wider">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  Why FLYO
                </span>
                <h2 className="text-4xl font-extrabold text-slate-900 leading-tight">
                  "We don't believe every business needs the same digital solution."
                </h2>
                <p className="text-slate-600 text-base leading-relaxed">
                  Too many agencies push massive monthly packages. At FLYO, we evaluate what actually matters for your business and recommend only what makes practical sense to help you grow.
                </p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {differentiators.map((item, i) => (
                  <div key={i} className="p-5 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/50 transition-all space-y-2">
                    <span className="text-2xl">{item.icon}</span>
                    <h3 className="text-sm font-bold text-slate-900">{item.title}</h3>
                    <p className="text-xs text-slate-600 leading-relaxed">{item.desc}</p>
                  </div>
                ))}
              </div>

              <Link
                href="/about"
                className="inline-flex items-center gap-2 text-sm font-bold text-indigo-600 hover:text-indigo-700 group"
              >
                <span>Read Our Startup Story</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            {/* Right: Visual card stack */}
            <div className="relative h-96 lg:h-[480px]">
              {/* Background card */}
              <div className="absolute top-8 right-0 left-8 h-full rounded-3xl bg-gradient-to-br from-indigo-600 to-violet-700 opacity-20 rotate-3" />
              {/* Middle card */}
              <div className="absolute top-4 right-4 left-4 h-full rounded-3xl bg-gradient-to-br from-slate-800 to-slate-900 opacity-40 rotate-1" />
              {/* Front card */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-slate-900 to-slate-800 overflow-hidden">
                <img
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=800&auto=format&fit=crop"
                  alt="Digital business growth analytics"
                  className="w-full h-full object-cover opacity-30"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-slate-900/50 to-transparent" />
                {/* Stats overlay */}
                <div className="absolute bottom-0 left-0 right-0 p-6 space-y-3">
                  <div className="flex items-end justify-between text-white">
                    <div>
                      <p className="text-xs text-slate-400 font-medium">Businesses Flying</p>
                      <p className="text-3xl font-extrabold">30+</p>
                    </div>
                    <TrendingUp className="w-8 h-8 text-emerald-400" />
                  </div>
                  <div className="h-2 bg-slate-700 rounded-full overflow-hidden">
                    <div className="h-full w-4/5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full" />
                  </div>
                  <p className="text-xs text-emerald-400 font-semibold">↑ Growing every month</p>
                </div>
                {/* Floating badge */}
                <div className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-indigo-600/90 text-white text-xs font-bold backdrop-blur-sm">
                  🚀 Student-Led
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          SELECTED WORK
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Selected Work</span>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Real projects. Real impact.
              </h2>
            </div>
            <Link href="/work" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group shrink-0">
              <span>View All Work</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {PORTFOLIO_DATA.slice(0, 3).map((project, idx) => (
              <Link
                key={project.slug}
                href={`/work/${project.slug}`}
                className="group rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 overflow-hidden flex flex-col"
              >
                {/* Project visual header */}
                <div className="h-36 bg-gradient-to-br from-indigo-50 via-violet-50 to-slate-100 relative overflow-hidden flex items-center justify-center">
                  <div className="absolute inset-0 opacity-30">
                    <div className="absolute top-3 left-3 w-8 h-8 rounded-full bg-indigo-400/40" />
                    <div className="absolute top-8 right-8 w-12 h-12 rounded-full bg-violet-400/30" />
                    <div className="absolute bottom-3 left-1/3 w-6 h-6 rounded-full bg-cyan-400/40" />
                  </div>
                  <div className="relative text-center">
                    <span className="px-3 py-1 rounded-full bg-white/80 text-indigo-700 text-xs font-bold border border-indigo-200">
                      {project.category}
                    </span>
                  </div>
                </div>

                <div className="p-6 flex flex-col flex-1 space-y-3">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-slate-400">
                    <span className="px-2 py-0.5 rounded bg-slate-100 text-slate-600">{project.service}</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {project.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-2 flex-1">
                    {project.shortDescription}
                  </p>
                  <div className="pt-3 border-t border-slate-100 text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                    <span>View Case Study</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          HOW WE WORK - PROCESS STEPS
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-white border-y border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold uppercase tracking-wider">
              Our Process
            </span>
            <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
              Simple 4-step approach
            </h2>
            <p className="text-slate-600 text-base">
              Transparent, structured, and collaborative — every step of the way.
            </p>
          </div>

          <GSAPWrapper animation="staggerChildren" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {processSteps.map((s, i) => (
              <div key={s.step} className="relative p-7 rounded-2xl bg-slate-50 border border-slate-200 hover:border-indigo-200 hover:bg-indigo-50/30 transition-all space-y-4 group">
                {/* Step connector line */}
                {i < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-3 w-6 border-t-2 border-dashed border-slate-300 z-10" />
                )}
                <div className="flex items-center justify-between">
                  <span className="text-3xl font-black text-indigo-600/20 group-hover:text-indigo-600/40 transition-colors">{s.step}</span>
                  <span className="text-2xl">{s.icon}</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-900">{s.title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed mt-1.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </GSAPWrapper>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          ARTICLES PREVIEW
      ═══════════════════════════════════════════ */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4">
            <div className="space-y-2">
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">Articles & Guides</span>
              <h2 className="text-4xl font-extrabold text-slate-900 tracking-tight">
                Practical insights for local owners
              </h2>
            </div>
            <Link href="/articles" className="text-sm font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 group shrink-0">
              <span>Read All Articles</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {ARTICLES_DATA.slice(0, 3).map((article) => (
              <Link
                key={article.slug}
                href={`/articles/${article.slug}`}
                className="group p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-300 hover:shadow-xl hover:shadow-indigo-500/5 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-[11px] text-slate-400 font-medium">
                    <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 font-bold uppercase tracking-wider">{article.category}</span>
                    <span>{article.readingTimeMinutes} min read</span>
                  </div>
                  <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors leading-snug">
                    {article.title}
                  </h3>
                  <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                    {article.summary}
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 mt-4 text-xs font-bold text-indigo-600 flex items-center gap-1 group-hover:translate-x-1 transition-transform">
                  <span>Read Article</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════════════════════════════════
          CTA BANNER
      ═══════════════════════════════════════════ */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-6xl mx-auto">
          <div className="relative p-12 sm:p-16 rounded-3xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-900 overflow-hidden text-center space-y-6">
            {/* Glowing orbs */}
            <div className="absolute top-0 left-1/4 w-64 h-64 rounded-full bg-indigo-600/20 blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 right-1/4 w-64 h-64 rounded-full bg-violet-600/20 blur-3xl pointer-events-none" />
            
            {/* Grid */}
            <div className="absolute inset-0 hero-grid opacity-20" />
            
            <div className="relative space-y-6">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white text-xs font-bold">
                🚀 Ready to launch?
              </div>
              <h2 className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                Ready to make your business fly?
              </h2>
              <p className="text-slate-300 text-base max-w-xl mx-auto leading-relaxed">
                Tell us what you're working on. We'll figure out the right digital approach together — no pushy sales, no BS.
              </p>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link
                  href="/contact"
                  className="group px-8 py-4 rounded-2xl bg-white text-indigo-700 font-bold text-sm hover:bg-indigo-50 transition-colors shadow-lg flex items-center gap-2"
                >
                  <span>Let's Talk — It's Free</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
                <a
                  href={`https://wa.me/${COMPANY_INFO.whatsapp}?text=Hi FLYO! I want to grow my business.`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-6 py-4 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 font-bold text-sm hover:bg-emerald-500/30 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  <span>WhatsApp Us</span>
                </a>
              </div>
              <p className="text-xs text-slate-500">
                📞 {COMPANY_INFO.phoneDisplay} · ✉️ {COMPANY_INFO.email}
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}

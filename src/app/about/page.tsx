'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, X, ExternalLink, GraduationCap, UserCheck, Zap, Shield, Sparkles, HelpCircle, CheckCircle2 } from 'lucide-react';
import FlyoLoader from '@/components/ui/FlyoLoader';
import { COMPANY_INFO } from '@/lib/data/company';
import { getVisibleTeamMembers, syncTeamFromFirestore } from '@/lib/data/teamStore';
import { TeamMember } from '@/lib/types/seo';

function TeamAvatarImage({ avatar, name, isModal = false }: { avatar?: string; name: string; isModal?: boolean }) {
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    setHasError(false);
  }, [avatar]);

  const initials = name ? name.split(' ').map((n) => n[0]).join('') : '';

  if (avatar && !hasError) {
    return (
      <img
        src={avatar}
        alt={name}
        className={isModal ? "w-full h-full object-cover" : "w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"}
        onError={() => setHasError(true)}
      />
    );
  }

  return (
    <span className={isModal ? "text-indigo-700 font-extrabold text-2xl" : "text-indigo-700 font-extrabold text-lg"}>
      {initials}
    </span>
  );
}

const ABOUT_FAQS = [
  {
    question: 'Who founded flyoo businesses?',
    answer: 'flyoo businesses was founded by Harsh Kumar alongside passionate tech and design students at GLA University in Mathura, India. We are a student-led digital studio on a mission to bring enterprise-grade web and SEO solutions to local businesses at transparent, accessible rates.',
  },
  {
    question: 'Why choose a student-led studio over a traditional marketing agency?',
    answer: 'Traditional agencies frequently outsource to multiple middlemen, use bloated WordPress themes, and charge heavy recurring retainers with little accountability. As a student-led team, we build with cutting-edge technologies like Next.js, communicate directly with business owners, and deliver projects in days rather than months.',
  },
  {
    question: 'Do you work with businesses outside Mathura and Uttar Pradesh?',
    answer: 'Yes! While our physical roots are in Mathura, we partner with local stores, restaurants, service contractors, and emerging startups across all of India through frictionless WhatsApp and video consultations.',
  },
  {
    question: 'What is your guarantee on project ownership?',
    answer: 'You own 100% of your source code, domain name, hosting environment, and visual assets upon final project delivery. We never hold client assets hostage or charge hidden lock-in fees.',
  },
];

export default function AboutPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Instantly load visible members from store cache
    setMembers(getVisibleTeamMembers());
    setLoading(false);

    // 2. Fetch live data from Firebase Cloud and update view
    syncTeamFromFirestore().then(() => {
      setMembers(getVisibleTeamMembers());
    });
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-20">

      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Small Team · High Velocity · Direct Results
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Founded &amp; operated by energetic college students who care about real results.
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          {COMPANY_INFO.name} (also known as <em>flyoo</em>, <em>flyo</em>, or <em>fly business</em>) was founded by Harsh Kumar at GLA University in Mathura. We started our studio after witnessing local store owners and contractors pay exorbitant sums for bloated, slow websites that failed to generate real customer calls.
        </p>
      </div>

      {/* Origin Story Section */}
      <section className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 space-y-6">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Our Origin &amp; Mission</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Cutting Through Corporate Agency Bloat
        </h2>
        <div className="space-y-4 text-xs sm:text-sm text-slate-700 leading-relaxed">
          <p>
            Local businesses are the beating heart of our economy—from the neighborhood bakery and hardware contractor to fitness gyms and independent clinics. Yet when these businesses try to establish an online presence, they are too often met with confusing corporate jargon, multi-month delays, and inflated retainers from legacy agencies.
          </p>
          <p>
            At {COMPANY_INFO.name}, we reimagined how digital services should work for local business owners. By utilizing modern web frameworks like Next.js and Tailwind CSS, we eliminate bloated code and heavy plugins, delivering sub-second load times and flawless mobile experiences. We pair this with white-hat Local SEO that puts your business at the very top of Google Maps search results.
          </p>
          <p>
            Our mission is simple: to make your business fly in the digital landscape by giving you enterprise-grade digital infrastructure, transparent flat-rate pricing, and 100% full ownership of your digital assets.
          </p>
        </div>
      </section>

      {/* Core Principles */}
      <section className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Our DNA
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            The Principles That Drive Our Work
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Sub-Second Speed</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We never use heavy WordPress templates. We hand-code high-performance web applications that load in under 1 second on mobile.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">100% Client Ownership</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              You own all source code, domains, hosting accounts, and graphic files. No recurring lock-ins or hostage assets.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <UserCheck className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Direct Founder Access</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Talk directly with the developers and designers building your project. No confusing account managers or gatekeepers.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center font-bold">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900">Tangible Outcomes</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We focus on metrics that matter: Google Maps 3-Pack rankings, organic phone calls, and direct WhatsApp customer inquiries.
            </p>
          </div>
        </div>
      </section>

      {/* Team Cards Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Meet the Team
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            The people behind {COMPANY_INFO.name}
          </h2>
          <p className="text-xs text-slate-500">Click on any team profile to view detailed credentials and background.</p>
        </div>

        {loading ? (
          <div className="py-12 flex items-center justify-center">
            <FlyoLoader size="sm" label="Loading team members..." />
          </div>
        ) : members.length === 0 ? (
          <p className="text-sm text-slate-500">Team coming soon…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                onClick={() => setSelectedMember(member)}
                className="p-6 rounded-2xl bg-white border border-slate-200 hover:border-indigo-400 hover:shadow-xl transition-all duration-200 space-y-4 flex flex-col justify-between cursor-pointer group active:scale-95"
              >
                <div className="space-y-3">
                  {/* Photo Avatar */}
                  <div className="relative w-16 h-16 rounded-2xl overflow-hidden bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-sm">
                    <TeamAvatarImage avatar={member.avatar} name={member.name} />
                  </div>

                  <div className="space-y-1">
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-indigo-600 transition-colors flex items-center justify-between">
                      <span>{member.name}</span>
                      <UserCheck className="w-4 h-4 text-indigo-400 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </h3>
                    <span className="text-xs font-bold text-indigo-600 block">{member.role}</span>
                    {member.college && (
                      <div className="flex items-center gap-1 text-[11px] text-slate-400 font-medium pt-0.5">
                        <GraduationCap className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        <span className="truncate">{member.college}</span>
                      </div>
                    )}
                  </div>

                  <p className="text-xs text-slate-600 leading-relaxed line-clamp-3 pt-1">{member.bio}</p>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-indigo-600 font-bold">
                  <span>View Full Profile</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 4-Stage Collaboration Process */}
      <section className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white space-y-8">
        <div className="space-y-2">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-400">
            How We Work With You
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
            Our 4-Stage Client Collaboration Journey
          </h2>
          <p className="text-xs sm:text-sm text-slate-300 max-w-2xl leading-relaxed">
            We make working together straightforward, structured, and completely transparent from day one.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <span className="font-mono text-xs font-bold text-indigo-400">01. Discovery</span>
            <h3 className="font-bold text-base text-white">Free Strategy Audit</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We analyze your local competitors, Google visibility, and customer journey to identify high-leverage growth opportunities.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <span className="font-mono text-xs font-bold text-indigo-400">02. Design &amp; Prototype</span>
            <h3 className="font-bold text-base text-white">Interactive Mockups</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We design custom visual mockups and layout prototypes tailored to your brand colors, typography, and service catalog.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <span className="font-mono text-xs font-bold text-indigo-400">03. Code &amp; SEO Setup</span>
            <h3 className="font-bold text-base text-white">Full-Stack Build</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We code your platform with Next.js, embed Schema markup, configure Google Business Profiles, and integrate WhatsApp funnels.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-800/80 border border-slate-700/60 space-y-2">
            <span className="font-mono text-xs font-bold text-indigo-400">04. Launch &amp; Scale</span>
            <h3 className="font-bold text-base text-white">Production Delivery</h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              We deploy your site to global high-speed cloud infrastructure, hand over 100% ownership, and monitor initial search indexing.
            </p>
          </div>
        </div>
      </section>

      {/* About FAQs */}
      <section className="space-y-6 pt-4 border-t border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Common Questions</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions About flyoo
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ABOUT_FAQS.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-900">{faq.question}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Profile Detail Modal */}
      {selectedMember && (
        <div
          className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setSelectedMember(null)}
        >
          <div
            className="bg-white border border-slate-200 rounded-3xl max-w-lg w-full p-6 sm:p-8 space-y-6 shadow-2xl relative animate-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedMember(null)}
              className="absolute top-5 right-5 p-2 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
              aria-label="Close detail modal"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-start gap-4">
              <div className="w-20 h-20 rounded-2xl overflow-hidden bg-indigo-50 border border-indigo-100 flex items-center justify-center shrink-0 shadow-md">
                <TeamAvatarImage avatar={selectedMember.avatar} name={selectedMember.name} isModal={true} />
              </div>
              <div className="space-y-1">
                <h3 className="text-2xl font-bold text-slate-900">{selectedMember.name}</h3>
                <span className="text-xs font-bold text-indigo-600 block">{selectedMember.role}</span>
                {selectedMember.college && (
                  <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium pt-1">
                    <GraduationCap className="w-4 h-4 text-indigo-500" />
                    <span>{selectedMember.college}</span>
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-2 pt-2 border-t border-slate-100">
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">About {selectedMember.name.split(' ')[0]}</h4>
              <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
                {selectedMember.bio}
              </p>
            </div>

            {/* Social & Contact Actions */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
              <div className="flex gap-2">
                {selectedMember.linkedin && (
                  <a
                    href={selectedMember.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>LinkedIn</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {selectedMember.twitter && (
                  <a
                    href={selectedMember.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>Twitter</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
                {selectedMember.customLinkUrl && (
                  <a
                    href={selectedMember.customLinkUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-indigo-50 hover:text-indigo-600 text-slate-700 text-xs font-bold transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>{selectedMember.customLinkName || 'Link'}</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                )}
              </div>

              <Link
                href="/contact"
                onClick={() => setSelectedMember(null)}
                className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors inline-flex items-center gap-1.5 shadow-md shadow-indigo-600/20"
              >
                <span>Get In Touch</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Call to Action */}
      <div className="p-8 sm:p-10 rounded-3xl bg-indigo-600 text-white text-center space-y-4 shadow-sm">
        <h2 className="text-2xl sm:text-3xl font-extrabold">Want to work with a practical, energetic team?</h2>
        <p className="text-xs sm:text-sm text-indigo-100 max-w-md mx-auto leading-relaxed">
          Let&apos;s discuss how we can help your local business fly in the digital world. Free strategy consultation with zero obligations.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3.5 rounded-xl bg-white hover:bg-indigo-50 text-indigo-700 font-bold text-xs transition-colors shadow-sm"
        >
          <span>Let&apos;s Talk</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { ArrowRight, CheckCircle2, Users, Compass, ShieldCheck } from 'lucide-react';
import { generatePageMetadata } from '@/lib/seo/metadata';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { TEAM_MEMBERS } from '@/lib/data/team';
import { COMPANY_INFO } from '@/lib/data/company';

export const metadata = generatePageMetadata({
  title: 'About Us | Small Team. Big Focus.',
  description: 'Learn about Flyo, a student-led digital services startup helping local businesses build modern web presences and grow online.',
  canonicalUrl: '/about',
});

export default function AboutPage() {
  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-20">
      <Breadcrumbs items={[{ name: 'About Us', item: '/about' }]} />

      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Small Team. Big Focus.
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Founded & operated by college students who care about practical results.
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          {COMPANY_INFO.name} was started by a group of college friends passionate about modern web tech, design, and local business growth. We noticed local businesses often pay thousands for bloated services they don't need—so we built a startup that offers straightforward, affordable, high-quality digital solutions.
        </p>
      </div>

      {/* Team Cards */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Meet the Team
          </span>
          <h2 className="text-2xl font-bold text-slate-900">
            The people behind {COMPANY_INFO.name}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {TEAM_MEMBERS.map((member) => (
            <div
              key={member.name}
              className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-sm">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </div>
                <h3 className="font-bold text-base text-slate-900">{member.name}</h3>
                <span className="text-xs font-bold text-indigo-600 block">{member.role}</span>
                <p className="text-xs text-slate-600 leading-relaxed pt-1">
                  {member.bio}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white text-center space-y-4">
        <h2 className="text-2xl font-bold">Want to work with a practical, energetic team?</h2>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          Let's discuss how we can help your local business fly in the digital world.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
        >
          <span>Let's Talk</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

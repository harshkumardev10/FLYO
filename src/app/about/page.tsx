'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/data/company';
import { getVisibleTeamMembers, syncTeamFromFirestore } from '@/lib/data/teamStore';
import { TeamMember } from '@/lib/types/seo';

export default function AboutPage() {
  const [members, setMembers] = useState<TeamMember[]>([]);

  useEffect(() => {
    // Load from local cache first (instant)
    setMembers(getVisibleTeamMembers());
    // Then sync from Firestore for freshest data
    syncTeamFromFirestore().then(() => setMembers(getVisibleTeamMembers()));
  }, []);

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-20">

      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Small Team. Big Focus.
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight leading-tight">
          Founded &amp; operated by college students who care about practical results.
        </h1>
        <p className="text-slate-600 text-sm leading-relaxed">
          {COMPANY_INFO.name} was started by a group of college friends passionate about modern web
          tech, design, and local business growth. We noticed local businesses often pay thousands
          for bloated services they don&apos;t need—so we built a startup that offers
          straightforward, affordable, high-quality digital solutions.
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

        {members.length === 0 ? (
          <p className="text-sm text-slate-500">Team coming soon…</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {members.map((member) => (
              <div
                key={member.id}
                className="p-6 rounded-2xl bg-white border border-slate-200 space-y-3 flex flex-col justify-between"
              >
                <div className="space-y-2">
                  {/* Avatar */}
                  {member.avatar ? (
                    <img
                      src={member.avatar}
                      alt={member.name}
                      className="w-12 h-12 rounded-full object-cover border border-indigo-100"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <div className="w-12 h-12 rounded-full bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-700 font-extrabold text-sm">
                      {member.name.split(' ').map((n) => n[0]).join('')}
                    </div>
                  )}
                  <h3 className="font-bold text-base text-slate-900">{member.name}</h3>
                  <span className="text-xs font-bold text-indigo-600 block">{member.role}</span>
                  <p className="text-xs text-slate-600 leading-relaxed pt-1">{member.bio}</p>
                </div>

                {/* Social links */}
                {(member.linkedin || member.twitter) && (
                  <div className="flex items-center gap-3 pt-2 border-t border-slate-100">
                    {member.linkedin && (
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:underline font-semibold"
                      >
                        LinkedIn →
                      </a>
                    )}
                    {member.twitter && (
                      <a
                        href={member.twitter}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-indigo-600 hover:underline font-semibold"
                      >
                        Twitter →
                      </a>
                    )}
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Call to Action */}
      <div className="p-8 sm:p-10 rounded-3xl bg-slate-900 text-white text-center space-y-4">
        <h2 className="text-2xl font-bold">Want to work with a practical, energetic team?</h2>
        <p className="text-xs text-slate-300 max-w-md mx-auto leading-relaxed">
          Let&apos;s discuss how we can help your local business fly in the digital world.
        </p>
        <Link
          href="/contact"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors"
        >
          <span>Let&apos;s Talk</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, X, ExternalLink, GraduationCap, UserCheck } from 'lucide-react';
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

      {/* Team Cards Section */}
      <div className="space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Meet the Team
          </span>
          <h2 className="text-2xl font-bold text-slate-900">
            The people behind {COMPANY_INFO.name}
          </h2>
          <p className="text-xs text-slate-500">Click on any card to view detailed team profile.</p>
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

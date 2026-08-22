'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Lock } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/data/company';
import { getAllowedAdminEmails } from '@/lib/data/articlesStore';
import { useRipple } from '@/components/ui/RippleButton';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState<string | null>(null);
  const ripple = useRipple('rgba(255,255,255,0.5)');
  const rippleDark = useRipple('rgba(99,102,241,0.25)');
  const pathname = usePathname();

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedEmail = localStorage.getItem('flyo_authenticated_partner_email');
      const allowed = getAllowedAdminEmails();
      if (savedEmail && Array.isArray(allowed) && allowed.map(e => String(e).toLowerCase()).includes(savedEmail.toLowerCase())) {
        setPartnerEmail(savedEmail);
      } else {
        setPartnerEmail(null);
      }
    }
  }, [pathname]);

  const navLinks = [
    { name: 'Home', href: '/' },
    { name: 'Services', href: '/services' },
    { name: 'Our Work', href: '/work' },
    { name: 'Articles', href: '/articles' },
    { name: 'About', href: '/about' },
  ];

  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/80">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo with Kingfisher Bird Image */}
          <Link href="/" className="flex items-center gap-3 group" aria-label="FLYO Home">
            {/* Kingfisher Bird Photo Logo */}
            <div className="w-12 h-12 rounded-2xl overflow-hidden shadow-lg group-hover:shadow-blue-400/50 transition-all duration-300 group-hover:scale-110 flex-shrink-0">
              <Image
                src="/kingfisher-logo.jpg"
                alt="FLYO Kingfisher Bird Logo"
                width={48}
                height={48}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-xl tracking-wider text-slate-900 group-hover:text-blue-700 transition-colors uppercase leading-none">
                FLYO
              </span>
              <span className="text-[10px] font-semibold text-slate-500 tracking-tight">
                Make Your Business Fly
              </span>
            </div>
          </Link>

          {/* Desktop Links */}
          <nav className="hidden md:flex items-center gap-7" aria-label="Main Navigation">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  className={`text-sm font-medium transition-colors ${
                    isActive ? 'text-indigo-600 font-semibold' : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  {link.name}
                </Link>
              );
            })}
          </nav>

          {/* Right Section: Workspace Button ONLY if email access is granted */}
          <div className="hidden md:flex items-center gap-3">
            {partnerEmail && (
              <Link
                href="/workspace"
                className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-[#0B132B] hover:bg-[#101b3d] border border-slate-700 hover:border-cyan-400 text-white transition-all duration-200 shadow-md hover:shadow-cyan-500/20 hover:scale-105 active:scale-95"
                title={`Authorized Partner: ${partnerEmail}`}
              >
                <div className="w-5 h-5 rounded-md overflow-hidden bg-white p-0.5 flex items-center justify-center shadow-sm shrink-0">
                  <img src="/kingfisher-logo.jpg" alt="FLYO" className="w-full h-full object-cover" />
                </div>
                <span className="font-black text-xs tracking-wider text-white uppercase">FLYO</span>
                <span className="text-[9px] text-cyan-400 font-extrabold px-1.5 py-0.5 rounded border border-cyan-500/50 bg-cyan-950/60 leading-none">
                  STUDIO
                </span>
              </Link>
            )}

            <Link
              href="/contact"
              onClick={ripple}
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-sky-500/40 transition-all duration-100 active:scale-95 hover:scale-105"
              style={{background: 'linear-gradient(135deg, #0C1A3A 0%, #1D4ED8 100%)', position:'relative', overflow:'hidden'}}
            >
              <span>Let&#39;s Talk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={(e) => { rippleDark(e); setIsMobileMenuOpen(!isMobileMenuOpen); }}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-90 relative overflow-hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isMobileMenuOpen}
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-b border-slate-200 px-4 pt-3 pb-6 space-y-2 shadow-lg">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsMobileMenuOpen(false)}
              className="block text-sm font-medium text-slate-700 hover:text-indigo-600 py-2 border-b border-slate-100"
            >
              {link.name}
            </Link>
          ))}

          {partnerEmail && (
            <Link
              href="/workspace"
              onClick={() => setIsMobileMenuOpen(false)}
              className="flex items-center justify-between px-3.5 py-2.5 rounded-xl bg-[#0B132B] border border-slate-700 text-white font-bold text-xs"
            >
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-md overflow-hidden bg-white p-0.5 flex items-center justify-center shadow-sm shrink-0">
                  <img src="/kingfisher-logo.jpg" alt="FLYO" className="w-full h-full object-cover" />
                </div>
                <span className="font-black text-xs tracking-wider text-white uppercase">FLYO</span>
                <span className="text-[9px] text-cyan-400 font-extrabold px-1.5 py-0.5 rounded border border-cyan-500/50 bg-cyan-950/60 leading-none">
                  STUDIO
                </span>
              </div>
              <span className="text-[10px] text-slate-400 font-normal truncate max-w-[120px]">{partnerEmail}</span>
            </Link>
          )}

          <div className="pt-2">
            <Link
              href="/contact"
              onClick={(e) => { ripple(e); setIsMobileMenuOpen(false); }}
              className="w-full text-center py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg active:scale-95 transition-transform duration-100"
              style={{background: 'linear-gradient(135deg, #0C1A3A 0%, #1D4ED8 100%)', position:'relative', overflow:'hidden'}}
            >
              <span>Let&#39;s Talk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}

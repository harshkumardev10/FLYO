'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu, X, ArrowRight, Lock } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/data/company';
import { getAllowedAdminEmails } from '@/lib/data/articlesStore';

export function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [partnerEmail, setPartnerEmail] = useState<string | null>(null);
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 font-semibold text-xs hover:bg-amber-100 transition-all"
                title={`Authorized Partner: ${partnerEmail}`}
              >
                <Lock className="w-3.5 h-3.5 text-amber-600" />
                <span>Partner Workspace</span>
              </Link>
            )}

            <Link
              href="/contact"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-white font-semibold text-sm shadow-lg hover:shadow-sky-500/40 transition-all duration-150 active:scale-95 hover:scale-105"
              style={{background: 'linear-gradient(135deg, #0C1A3A 0%, #1D4ED8 100%)'}}
            >
              <span>Let&#39;s Talk</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* Mobile Hamburger */}
          <button
            type="button"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 hover:text-slate-900"
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
              className="block text-xs font-bold text-amber-800 bg-amber-50 p-2.5 rounded-xl border border-amber-200"
            >
              🔒 Partner Workspace ({partnerEmail})
            </Link>
          )}

          <div className="pt-2">
            <Link
              href="/contact"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full text-center py-3 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2 shadow-lg"
              style={{background: 'linear-gradient(135deg, #0C1A3A 0%, #1D4ED8 100%)'}}
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

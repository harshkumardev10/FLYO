import React from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin } from 'lucide-react';
import { COMPANY_INFO } from '@/lib/data/company';
import { SERVICES_DATA } from '@/lib/data/services';

export function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 text-slate-600 text-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-indigo-600 flex items-center justify-center text-white font-extrabold shadow-sm p-1.5">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                  <path d="M16 7c-1.5 0-3 1.5-3 3 0 1.5 1.5 3 3 3s3-1.5 3-3-1.5-3-3-3z"/>
                  <path d="M2 19c2.5-1 5.5-3.5 8.5-8 3 4.5 7.5 6.5 11.5 5.5-3 2.5-6 3.5-10 3.5-4 0-7-1-10-1z"/>
                </svg>
              </div>
              <span className="font-extrabold text-base tracking-tight text-slate-900 lowercase">
                flyoo <span className="text-indigo-600 font-bold lowercase">businesses</span>
              </span>
            </Link>
            <p className="text-slate-600 leading-relaxed max-w-sm">
              Make Your Business Fly. A student-led digital services startup helping local businesses build modern web presences, create promotional graphics, and grow organically online.
            </p>
            <div className="pt-1 text-slate-500 space-y-1">
              <p className="flex items-center gap-2 font-mono">
                <Phone className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <a href="tel:+918273946584" className="hover:text-slate-900">+91 82739 46584</a>
              </p>
              <p className="flex items-center gap-2 font-mono">
                <Mail className="w-3.5 h-3.5 text-indigo-600 shrink-0" />
                <a href={`mailto:${COMPANY_INFO.email}`} className="hover:text-slate-900">{COMPANY_INFO.email}</a>
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Navigation
            </h4>
            <ul className="space-y-2">
              <li><Link href="/" className="hover:text-indigo-600 transition-colors">Home</Link></li>
              <li><Link href="/services" className="hover:text-indigo-600 transition-colors">Services</Link></li>
              <li><Link href="/work" className="hover:text-indigo-600 transition-colors">Our Work</Link></li>
              <li><Link href="/articles" className="hover:text-indigo-600 transition-colors">Articles</Link></li>
              <li><Link href="/about" className="hover:text-indigo-600 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-indigo-600 transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Services
            </h4>
            <ul className="space-y-2">
              {SERVICES_DATA.slice(0, 5).map((s) => (
                <li key={s.slug}>
                  <Link href={`/services/${s.slug}`} className="hover:text-indigo-600 transition-colors">
                    {s.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Legal */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Legal & Policy
            </h4>
            <ul className="space-y-2">
              <li><Link href="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link></li>
              <li><Link href="/terms" className="hover:text-indigo-600 transition-colors">Terms of Service</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-6 border-t border-slate-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <p>© {new Date().getFullYear()} flyoo businesses. All rights reserved.</p>
          <p className="text-slate-400">Founded & operated by college students.</p>
        </div>
      </div>
    </footer>
  );
}

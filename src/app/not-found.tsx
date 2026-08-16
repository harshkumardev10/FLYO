import React from 'react';
import Link from 'next/link';
import { Home, ArrowRight, Compass } from 'lucide-react';
import { SERVICES_DATA } from '@/lib/data/services';

export const metadata = {
  title: 'Page Not Found (404)',
  description: 'The requested page could not be located.',
  robots: {
    index: false,
    follow: true,
  },
};

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
      <div className="max-w-md w-full text-center space-y-6">
        <div className="w-12 h-12 rounded-2xl bg-indigo-50 border border-indigo-100 text-indigo-600 flex items-center justify-center mx-auto font-bold text-lg">
          404
        </div>

        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-slate-900">
            Page Not Found
          </h1>
          <p className="text-slate-600 text-xs leading-relaxed">
            The page you are looking for may have moved or doesn't exist. Explore our services below or return to the home page.
          </p>
        </div>

        <div className="flex items-center justify-center gap-3">
          <Link
            href="/"
            className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-medium text-xs transition-colors flex items-center gap-1.5"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Back to Home</span>
          </Link>
          <Link
            href="/services"
            className="px-5 py-2.5 rounded-xl bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 font-medium text-xs transition-colors"
          >
            View Services
          </Link>
        </div>
      </div>
    </div>
  );
}

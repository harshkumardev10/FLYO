'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { Phone, Mail, MapPin, Send, CheckCircle2, AlertCircle, MessageSquare, Clock, Instagram, Facebook, HelpCircle, ShieldCheck, Zap, Sparkles } from 'lucide-react';
import FlyoLoader from '@/components/ui/FlyoLoader';
import { Breadcrumbs } from '@/components/seo/Breadcrumbs';
import { COMPANY_INFO } from '@/lib/data/company';

const CONTACT_FAQS = [
  {
    question: 'How quickly will I receive a response after submitting?',
    answer: 'We respond to all online inquiries within 2 to 4 hours during normal business hours (Mon–Sat, 9:00 AM – 8:00 PM IST). For urgent inquiries, feel free to call or WhatsApp our founder lead directly at +91 82739 46584.',
  },
  {
    question: 'Is the initial project consultation and website audit free?',
    answer: 'Yes, 100% free! We will review your current website, Google Business Profile, and local search competitors, providing actionable insights with zero high-pressure sales tactics.',
  },
  {
    question: 'What information should I have ready before contacting?',
    answer: 'Simply share what your business does, your current website or social links (if any), and what primary goals you want to achieve (e.g., more phone calls, modern website, or promotional posters).',
  },
  {
    question: 'Do you work with businesses outside Uttar Pradesh?',
    answer: 'Yes! While based at GLA University in Mathura, we collaborate seamlessly with local stores, restaurants, and service providers across all of India via WhatsApp, email, and video calls.',
  },
];

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    businessName: '',
    email: '',
    phone: '',
    serviceRequired: 'Web Development',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitSuccess(false);
    setErrorMessage(null);

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.error || 'Failed to send inquiry. Please try again.');
      }

      // Direct fail-safe client-side submission to Google Sheet Webhook
      const sheetUrl = process.env.NEXT_PUBLIC_GOOGLE_SHEET_WEBHOOK_URL;
      if (sheetUrl) {
        try {
          fetch(sheetUrl, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain;charset=utf-8' },
            body: JSON.stringify({
              ...formData,
              submittedAt: new Date().toISOString(),
            }),
          }).catch(() => {});
        } catch (e) {}
      }

      setSubmitSuccess(true);
      setFormData({
        name: '',
        businessName: '',
        email: '',
        phone: '',
        serviceRequired: 'Web Development',
        message: '',
      });
    } catch (err: any) {
      console.error('Contact form submission error:', err);
      setErrorMessage(err?.message || 'Something went wrong. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-16 pb-20">
      <Breadcrumbs items={[{ name: 'Contact', item: '/contact' }]} />

      {/* Header */}
      <div className="max-w-3xl space-y-4">
        <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
          Direct Founder Access · Fast Turnaround
        </span>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
          Let&apos;s talk about growing your business.
        </h1>
        <p className="text-slate-600 text-sm sm:text-base leading-relaxed">
          Have a question about high-speed web design, ranking #1 on Google Maps, or need a custom project quote? Send us a message or call/WhatsApp us directly. We respond promptly and provide straightforward, honest advice.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        
        {/* Contact Form */}
        <div className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 shadow-sm space-y-6">
          <div className="space-y-1">
            <h2 className="text-2xl font-bold text-slate-900">Send Us a Project Inquiry</h2>
            <p className="text-xs text-slate-500">Fill out this brief form and our team will get back to you within 2-4 hours.</p>
          </div>

          {submitSuccess && (
            <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <span>Thank you! Your inquiry has been sent and recorded. We will get back to you shortly with a personalized plan.</span>
            </div>
          )}

          {errorMessage && (
            <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2 animate-in fade-in">
              <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="name" className="font-bold text-slate-800">
                  Your Name *
                </label>
                <input
                  id="name"
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="e.g. Rahul Sharma"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="businessName" className="font-bold text-slate-800">
                  Business Name *
                </label>
                <input
                  id="businessName"
                  type="text"
                  required
                  value={formData.businessName}
                  onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                  placeholder="e.g. Sharma Bakery &amp; Cafe"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label htmlFor="email" className="font-bold text-slate-800">
                  Email Address *
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="name@business.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>

              <div className="space-y-1.5">
                <label htmlFor="phone" className="font-bold text-slate-800">
                  Phone / WhatsApp Number
                </label>
                <input
                  id="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="+91 82739 46584"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="serviceRequired" className="font-bold text-slate-800">
                Service Required
              </label>
              <select
                id="serviceRequired"
                value={formData.serviceRequired}
                onChange={(e) => setFormData({ ...formData, serviceRequired: e.target.value })}
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600"
              >
                <option value="Web Development">Web Development</option>
                <option value="Promotions">Promotions &amp; Marketing</option>
                <option value="SEO">Local SEO &amp; Google Maps</option>
                <option value="Social Media Handling">Social Media Management</option>
                <option value="Poster Design">Poster &amp; Banner Design</option>
                <option value="Thumbnail Design">YouTube Thumbnail Design</option>
                <option value="Local Business Growth Strategy">Business Growth Strategy</option>
                <option value="Custom Requirement">Custom Requirement / Multiple Services</option>
              </select>
            </div>

            <div className="space-y-1.5">
              <label htmlFor="message" className="font-bold text-slate-800">
                Tell us about your project requirements *
              </label>
              <textarea
                id="message"
                rows={4}
                required
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Briefly describe your business and what you'd like to achieve (e.g. launch new website, increase local customer calls)..."
                className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-2.5 text-slate-900 focus:outline-none focus:border-indigo-600"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-sm disabled:opacity-50 cursor-pointer"
            >
              {isSubmitting ? (
                <FlyoLoader size="xs" />
              ) : (
                <Send className="w-4 h-4" />
              )}
              <span>{isSubmitting ? 'Sending Inquiry...' : 'Submit Inquiry & Request Free Audit'}</span>
            </button>
          </form>
        </div>

        {/* Direct Contact Info Card */}
        <div className="lg:col-span-5 space-y-6">
          <div className="p-8 rounded-3xl bg-slate-900 text-white space-y-6 shadow-sm">
            <h2 className="text-xl font-bold">Direct Inquiry Contact</h2>
            <p className="text-xs text-slate-300 leading-relaxed">
              Prefer calling or sending a direct WhatsApp message? Reach out to our student founder lead directly.
            </p>

            <div className="space-y-4 pt-2 text-xs">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Phone className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase block">Phone / Direct Call</span>
                  <a href="tel:+918273946584" className="font-mono text-sm font-bold text-white hover:text-indigo-300">
                    +91 82739 46584
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-emerald-400 shrink-0 mt-0.5">
                  <MessageSquare className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase block">WhatsApp Chat</span>
                  <a
                    href="https://wa.me/918273946584"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-mono text-sm font-bold text-emerald-400 hover:underline"
                  >
                    +91 82739 46584
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Mail className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase block">Email Address</span>
                  <a href={`mailto:${COMPANY_INFO.email}`} className="font-mono text-sm font-bold text-white hover:text-indigo-300">
                    {COMPANY_INFO.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-800 flex items-center justify-center text-indigo-400 shrink-0 mt-0.5">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[11px] text-slate-400 font-bold uppercase block">Inquiry Response Time</span>
                  <span className="text-xs text-slate-300">Mon - Sat: 9:00 AM - 8:00 PM IST (Prompt response)</span>
                </div>
              </div>
            </div>

            {/* Social Media Channels */}
            <div className="pt-4 border-t border-slate-800 space-y-3">
              <span className="text-[11px] text-slate-400 font-bold uppercase tracking-wider block">
                Official Social Media
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <a
                  href={COMPANY_INFO.social.instagram}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-gradient-to-tr hover:from-amber-600 hover:via-rose-600 hover:to-purple-600 border border-slate-700/60 hover:border-transparent text-slate-200 hover:text-white transition-all duration-200 group text-xs font-semibold"
                >
                  <Instagram className="w-4 h-4 text-rose-400 group-hover:text-white transition-colors shrink-0" />
                  <span className="truncate">@flyoobusinesses</span>
                </a>
                <a
                  href={COMPANY_INFO.social.facebook}
                  target="_blank"
                  rel="me noopener noreferrer"
                  className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-xl bg-slate-800/80 hover:bg-[#1877F2] border border-slate-700/60 hover:border-transparent text-slate-200 hover:text-white transition-all duration-200 group text-xs font-semibold"
                >
                  <Facebook className="w-4 h-4 text-blue-400 group-hover:text-white transition-colors shrink-0" />
                  <span className="truncate">Facebook Page</span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* What Happens After Reaching Out */}
      <section className="p-8 sm:p-10 rounded-3xl bg-white border border-slate-200 space-y-6">
        <div className="space-y-1">
          <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
            Frictionless Process
          </span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            What Happens After You Contact Us
          </h2>
          <p className="text-xs sm:text-sm text-slate-500">
            Here is our straightforward 3-step process when you submit an inquiry:
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              Step 1
            </span>
            <h3 className="font-bold text-base text-slate-900">Same-Day Check-in</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We review your notes and reach out on WhatsApp or email to confirm project goals and gather basic brand assets.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              Step 2
            </span>
            <h3 className="font-bold text-base text-slate-900">Free 15-Min Audit &amp; Proposal</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              We audit your competitors, outline clear deliverables, provide exact timelines, and deliver a transparent flat-rate quote.
            </p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-50 border border-slate-100 space-y-2">
            <span className="font-mono text-xs font-bold text-indigo-600 bg-indigo-50 px-2 py-0.5 rounded">
              Step 3
            </span>
            <h3 className="font-bold text-base text-slate-900">Rapid Development &amp; Launch</h3>
            <p className="text-xs text-slate-600 leading-relaxed">
              Upon approval, we start building immediately and deliver complete prototypes within 5 to 7 business days.
            </p>
          </div>
        </div>
      </section>

      {/* Contact FAQs */}
      <section className="space-y-6 pt-4 border-t border-slate-200">
        <div className="space-y-1">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-xs font-bold uppercase tracking-wider">
            <HelpCircle className="w-3.5 h-3.5" />
            <span>Consultation FAQs</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900">
            Frequently Asked Questions
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {CONTACT_FAQS.map((faq, idx) => (
            <div key={idx} className="p-6 rounded-2xl bg-white border border-slate-200 space-y-2">
              <h3 className="font-bold text-sm sm:text-base text-slate-900">{faq.question}</h3>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">{faq.answer}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

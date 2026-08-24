'use client';

import React, { useState, useRef, useEffect } from 'react';
import {
  Share2, Link2, Check, X,
  Twitter, Facebook, Linkedin, Mail,
  MessageCircle, Send,
} from 'lucide-react';

interface ShareArticleProps {
  title: string;
  summary: string;
  slug: string;
  heroImage?: string;
}

const SITE_BASE =
  typeof window !== 'undefined'
    ? window.location.origin
    : 'https://flyodigital.com';

export default function ShareArticle({ title, summary, slug, heroImage }: ShareArticleProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imgCopied, setImgCopied] = useState(false);
  const [nativeShareDone, setNativeShareDone] = useState(false);
  const modalRef = useRef<HTMLDivElement>(null);

  const articleUrl = `${SITE_BASE}/articles/${slug}`;
  const encodedUrl = encodeURIComponent(articleUrl);
  const encodedTitle = encodeURIComponent(`flyoo businesses | ${title}`);
  const shortText = encodeURIComponent(`flyoo businesses | ${title}\n${articleUrl}`);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (open && modalRef.current && !modalRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('keydown', handler);
    return () => document.removeEventListener('keydown', handler);
  }, []);

  const platforms = [
    {
      name: 'WhatsApp',
      icon: <MessageCircle className="w-5 h-5" />,
      color: 'bg-[#25D366] hover:bg-[#1EB855]',
      url: `https://wa.me/?text=${shortText}`,
    },
    {
      name: 'Twitter / X',
      icon: <Twitter className="w-5 h-5" />,
      color: 'bg-black hover:bg-slate-800',
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    },
    {
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'bg-[#0A66C2] hover:bg-[#0854A0]',
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
    },
    {
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'bg-[#1877F2] hover:bg-[#1464D0]',
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    },
    {
      name: 'Telegram',
      icon: <Send className="w-5 h-5" />,
      color: 'bg-[#2AABEE] hover:bg-[#1A9BDE]',
      url: `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`,
    },
    {
      name: 'Email',
      icon: <Mail className="w-5 h-5" />,
      color: 'bg-slate-700 hover:bg-slate-600',
      url: `mailto:?subject=${encodedTitle}&body=${encodedUrl}`,
    },
  ];

  // Native Web Share API (mobile)
  const handleNativeShare = async () => {
    if (typeof navigator === 'undefined' || !navigator.share) {
      setOpen(true);
      return;
    }
    try {
      await navigator.share({
        title: `flyoo businesses | ${title}`,
        url: articleUrl,
      });
      setNativeShareDone(true);
      setTimeout(() => setNativeShareDone(false), 2000);
    } catch {
      setOpen(true);
    }
  };

  // Copy plain link
  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(articleUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      /* fallback */
    }
  };

  // Copy link + image URL — short format
  const handleCopyWithImage = async () => {
    const text = `flyoo businesses | ${title}\n🔗 ${articleUrl}${heroImage ? `\n🖼️ ${heroImage}` : ''}`;
    try {
      await navigator.clipboard.writeText(text);
      setImgCopied(true);
      setTimeout(() => setImgCopied(false), 2500);
    } catch { /* fallback */ }
  };

  return (
    <>
      {/* ── SHARE TRIGGER BUTTON ── */}
      <button
        onClick={handleNativeShare}
        className={`
          group relative flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm
          bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500
          text-white shadow-lg shadow-indigo-500/25 hover:shadow-indigo-500/40
          transition-all duration-300 hover:-translate-y-0.5 active:scale-95
        `}
        title="Share this article"
      >
        {nativeShareDone ? (
          <Check className="w-4 h-4 text-emerald-300" />
        ) : (
          <Share2 className="w-4 h-4 group-hover:rotate-12 transition-transform duration-200" />
        )}
        <span>{nativeShareDone ? 'Shared!' : 'Share'}</span>
        {/* Shine effect */}
        <span className="absolute inset-0 rounded-2xl overflow-hidden pointer-events-none">
          <span className="absolute top-0 left-[-100%] w-3/4 h-full bg-white/20 skew-x-[-20deg] group-hover:left-[120%] transition-all duration-700 ease-in-out" />
        </span>
      </button>

      {/* ── SHARE MODAL OVERLAY ── */}
      {open && (
        <div className="fixed inset-0 z-[999] flex items-end sm:items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div
            ref={modalRef}
            className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 sm:slide-in-from-bottom-0 duration-300"
          >
            {/* Header */}
            <div className="flex items-center justify-between px-6 pt-6 pb-4 border-b border-slate-100">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center shadow-sm">
                  <Share2 className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-extrabold text-slate-900 text-sm">Share Article</p>
                  <p className="text-[11px] text-slate-400">Choose how to share</p>
                </div>
              </div>
              <button
                onClick={() => setOpen(false)}
                className="w-8 h-8 flex items-center justify-center rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-800 transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Article preview */}
            <div className="px-6 py-4 flex gap-3 bg-slate-50 border-b border-slate-100">
              {heroImage && (
                <img
                  src={heroImage}
                  alt={title}
                  className="w-16 h-14 rounded-xl object-cover shrink-0 border border-slate-200"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
              )}
              <div className="min-w-0">
                <p className="text-xs font-extrabold text-slate-900 line-clamp-2 leading-tight">{title}</p>
                <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">{summary}</p>
                <p className="text-[10px] text-indigo-500 font-mono mt-1 truncate">{articleUrl}</p>
              </div>
            </div>

            {/* Platform grid */}
            <div className="px-6 py-5 space-y-4">
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Share to</p>
              <div className="grid grid-cols-3 gap-3">
                {platforms.map((p) => (
                  <a
                    key={p.name}
                    href={p.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => setTimeout(() => setOpen(false), 300)}
                    className={`
                      flex flex-col items-center gap-2 py-3 px-2 rounded-2xl
                      ${p.color} text-white text-[11px] font-bold
                      transition-all duration-200 hover:-translate-y-1 hover:shadow-lg active:scale-95
                    `}
                  >
                    {p.icon}
                    <span>{p.name}</span>
                  </a>
                ))}
              </div>

              {/* Copy section */}
              <div className="pt-2 space-y-2">
                <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Copy</p>

                {/* Copy Link */}
                <div className="flex items-center gap-2 p-3 rounded-2xl bg-slate-50 border border-slate-200">
                  <div className="flex-1 min-w-0">
                    <p className="text-[11px] font-semibold text-slate-700 truncate">{articleUrl}</p>
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className={`
                      flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0
                      ${copied
                        ? 'bg-emerald-100 text-emerald-700 border border-emerald-200'
                        : 'bg-indigo-600 hover:bg-indigo-700 text-white'
                      }
                    `}
                  >
                    {copied ? <Check className="w-3.5 h-3.5" /> : <Link2 className="w-3.5 h-3.5" />}
                    <span>{copied ? 'Copied!' : 'Copy Link'}</span>
                  </button>
                </div>

                {/* Copy Link + Image */}
                <button
                  onClick={handleCopyWithImage}
                  className={`
                    w-full flex items-center justify-center gap-2 py-3 rounded-2xl border-2 text-sm font-bold transition-all
                    ${imgCopied
                      ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
                      : 'border-dashed border-slate-200 bg-white text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50'
                    }
                  `}
                >
                  {imgCopied ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Copied with Image!</span>
                    </>
                  ) : (
                    <>
                      <span className="text-base">🖼️</span>
                      <span>Copy Link + Image</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Lock, 
  ShieldAlert, 
  KeyRound, 
  PenTool, 
  CheckCircle2, 
  Plus, 
  Mail, 
  Users, 
  Code2,
  LogOut,
  ArrowRight,
  Eye,
  EyeOff,
  Trash2,
  FileText,
  Globe,
  BarChart2,
  Settings,
  Sparkles,
  Upload,
  BookOpen,
  Clock,
  Calendar,
  X,
  ChevronDown,
  AlertCircle,
  Edit2,
  Save,
  Check,
  ShieldCheck,
  Clock3,
  PauseCircle,
  Image as ImageIcon
} from 'lucide-react';
import { uploadImageToCloudinary } from '@/lib/uploadImage';
import { 
  getAllowedAdminEmails, 
  addAllowedAdminEmail, 
  saveArticle, 
  getAllArticles, 
  getAllArticlesForAdmin,
  approveArticle,
  unpublishArticle,
  removeArticle, 
  getDynamicArticles, 
  removeAllowedAdminEmail,
  MAIN_ADMIN_EMAIL,
  syncFromFirestore
} from '@/lib/data/articlesStore';
import {
  getAllTeamMembersForAdmin,
  saveTeamMember,
  deleteTeamMember,
  toggleTeamMemberVisibility,
  syncTeamFromFirestore,
} from '@/lib/data/teamStore';
import { ArticleItem, TeamMember } from '@/lib/types/seo';
import { AuditTool } from '@/components/ui/AuditTool';

const AUTH_STORAGE_KEY = 'flyo_authenticated_partner_email';

export default function WorkspaceAdminPage() {
  const [emailInput, setEmailInput] = useState('');
  const [authenticatedEmail, setAuthenticatedEmail] = useState<string | null>(null);
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  const [allowedEmails, setAllowedEmails] = useState<string[]>([]);
  const [newEmailToAdd, setNewEmailToAdd] = useState('');
  const [emailSuccessMsg, setEmailSuccessMsg] = useState('');

  const [activeTab, setActiveTab] = useState<'articles' | 'manage' | 'emails' | 'audit' | 'team'>('articles');

  // ── Team Members State ──
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamForm, setTeamForm] = useState<{
    id: string; name: string; role: string; bio: string;
    college: string; avatar: string; linkedin: string; twitter: string;
    order: number; visible: boolean;
  }>({
    id: '', name: '', role: '', bio: '', college: '',
    avatar: '', linkedin: '', twitter: '', order: 0, visible: true,
  });
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [teamSuccess, setTeamSuccess] = useState('');
  const [isUploadingTeamAvatar, setIsUploadingTeamAvatar] = useState(false);

  // Article Upload Form State
  const [articleTitle, setArticleTitle] = useState('');
  const [articleCategory, setArticleCategory] = useState<'SEO' | 'Social Media' | 'Websites' | 'Marketing' | 'Local Business' | 'Design'>('Local Business');
  const [authorName, setAuthorName] = useState('FLYO Team');
  const [authorRole, setAuthorRole] = useState('Digital Strategist');
  const [readingTime, setReadingTime] = useState(5);
  const [summary, setSummary] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [heroImage, setHeroImage] = useState('https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1200&auto=format&fit=crop');
  const [relatedServiceSlug, setRelatedServiceSlug] = useState('web-development');
  const [publishSuccess, setPublishSuccess] = useState(false);
  const [publishedArticles, setPublishedArticles] = useState<ArticleItem[]>([]);
  const [dynamicArticles, setDynamicArticles] = useState<ArticleItem[]>([]);
  const [previewMode, setPreviewMode] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const [editingSlug, setEditingSlug] = useState<string | null>(null);
  const [isUploadingImage, setIsUploadingImage] = useState(false);

  const isCurrentPrimaryAdmin = authenticatedEmail?.toLowerCase() === MAIN_ADMIN_EMAIL.toLowerCase();

  useEffect(() => {
    const allowed = getAllowedAdminEmails();
    setAllowedEmails(allowed);
    setPublishedArticles(getAllArticlesForAdmin());
    setDynamicArticles(getDynamicArticles());
    setTeamMembers(getAllTeamMembersForAdmin());

    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem(AUTH_STORAGE_KEY);
      if (saved && allowed.includes(saved.toLowerCase())) {
        setAuthenticatedEmail(saved);
      }
    }

    // Sync remote Firestore articles, emails & team
    Promise.all([syncFromFirestore(), syncTeamFromFirestore()]).then(() => {
      const freshAllowed = getAllowedAdminEmails();
      setPublishedArticles(getAllArticlesForAdmin());
      setDynamicArticles(getDynamicArticles());
      setAllowedEmails(freshAllowed);
      setTeamMembers(getAllTeamMembersForAdmin());

      if (typeof window !== 'undefined') {
        const saved = localStorage.getItem(AUTH_STORAGE_KEY);
        if (saved && freshAllowed.includes(saved.toLowerCase())) {
          setAuthenticatedEmail(saved);
        }
      }
    });
  }, []);

  // Handle Login Verification (Syncs fresh data from Firebase first)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const cleanEmail = emailInput.trim().toLowerCase();
    
    if (!cleanEmail) {
      setAuthError('Please enter a valid email address.');
      return;
    }

    setIsLoggingIn(true);
    try {
      await syncFromFirestore();
    } catch (err) {
      console.error('Login sync error:', err);
    } finally {
      setIsLoggingIn(false);
    }

    const currentAllowed = getAllowedAdminEmails();
    if (currentAllowed.includes(cleanEmail)) {
      setAuthenticatedEmail(cleanEmail);
      setAllowedEmails(currentAllowed);
      if (typeof window !== 'undefined') {
        localStorage.setItem(AUTH_STORAGE_KEY, cleanEmail);
      }
      setAuthError('');
    } else {
      setAuthError(`Access Denied: "${cleanEmail}" is not authorized for FLYO partner access.`);
    }
  };

  // Handle Log Out
  const handleLogout = () => {
    setAuthenticatedEmail(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  };

  // Load article into form for editing
  const handleEditArticle = (article: ArticleItem) => {
    setEditingSlug(article.slug);
    setArticleTitle(article.title);
    setArticleCategory(article.category);
    setAuthorName(article.authorName);
    setAuthorRole(article.authorRole);
    setReadingTime(article.readingTimeMinutes);
    setSummary(article.summary);
    setContentHtml(article.contentHtml);
    setHeroImage(article.heroImage || '');
    setRelatedServiceSlug(article.relatedServiceSlug || 'web-development');
    setActiveTab('articles');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Cancel editing
  const handleCancelEdit = () => {
    setEditingSlug(null);
    setArticleTitle('');
    setSummary('');
    setContentHtml('');
    setHeroImage('https://images.unsplash.com/photo-1432888498266-38ffec3eaf0a?q=80&w=1200&auto=format&fit=crop');
    setAuthorName('FLYO Team');
    setAuthorRole('Digital Strategist');
    setReadingTime(5);
    setRelatedServiceSlug('web-development');
  };

  // Handle Article Publish / Update
  const handlePublishArticle = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!articleTitle || !summary || !contentHtml) return;

    const slug = editingSlug || articleTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const isMainAdmin = authenticatedEmail?.toLowerCase() === MAIN_ADMIN_EMAIL.toLowerCase();
    const existingArt = publishedArticles.find(a => a.slug === slug);
    
    // Status logic: Main admin posts directly as 'approved'. Partners post as 'pending' unless editing existing approved article.
    const articleStatus = isMainAdmin
      ? 'approved'
      : (existingArt?.status || 'pending');

    const newArticle: ArticleItem = {
      slug: slug || `article-${Date.now()}`,
      title: articleTitle,
      summary,
      category: articleCategory,
      publishedAt: editingSlug
        ? (existingArt?.publishedAt || new Date().toISOString().split('T')[0])
        : new Date().toISOString().split('T')[0],
      authorName,
      authorRole,
      readingTimeMinutes: Number(readingTime) || 5,
      heroImage,
      contentHtml: contentHtml.startsWith('<') ? contentHtml : `<p>${contentHtml.replace(/\n\n/g, '</p><p>')}</p>`,
      relatedServiceSlug,
      status: articleStatus,
      submittedBy: authenticatedEmail || 'Partner',
    };

    const saved = await saveArticle(newArticle);
    if (saved) {
      setPublishSuccess(true);
      setPublishedArticles(getAllArticlesForAdmin());
      setDynamicArticles(getDynamicArticles());
      setEditingSlug(null);
      setArticleTitle('');
      setSummary('');
      setContentHtml('');
      setActiveTab('manage');
      setTimeout(() => setPublishSuccess(false), 5000);
    }
  };

  // Handle Approve Article (Main Admin only)
  const handleApproveArticle = async (slug: string) => {
    const success = await approveArticle(slug);
    if (success) {
      setPublishedArticles(getAllArticlesForAdmin());
      setDynamicArticles(getDynamicArticles());
    }
  };

  // Handle Unpublish / Stop Article Live (Main Admin only)
  const handleUnpublishArticle = async (slug: string) => {
    const success = await unpublishArticle(slug);
    if (success) {
      setPublishedArticles(getAllArticlesForAdmin());
      setDynamicArticles(getDynamicArticles());
    }
  };

  // Delete an article (Primary Admin only)
  const handleDeleteArticle = async (slug: string) => {
    if (authenticatedEmail?.toLowerCase() !== MAIN_ADMIN_EMAIL.toLowerCase()) {
      alert('Only Primary Admin (harshkumarrr143@gmail.com) can delete articles.');
      return;
    }
    if (!confirm('Delete this article? This cannot be undone.')) return;
    await removeArticle(slug);
    setDynamicArticles(getDynamicArticles());
    setPublishedArticles(getAllArticlesForAdmin());
  };

  // Add Authorized Email (Primary Admin only)
  const handleAddEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isCurrentPrimaryAdmin) {
      alert('Only Primary Admin (harshkumarrr143@gmail.com) can add team members.');
      return;
    }
    if (!newEmailToAdd || !newEmailToAdd.trim()) return;
    const clean = newEmailToAdd.trim().toLowerCase();
    const updated = await addAllowedAdminEmail(clean);
    setAllowedEmails([...updated]);
    setNewEmailToAdd('');
    setEmailSuccessMsg(`✅ Access granted to: ${clean}`);
    setTimeout(() => setEmailSuccessMsg(''), 4000);
  };

  // Remove email access (Primary Admin only)
  const handleRemoveEmail = async (email: string) => {
    if (!isCurrentPrimaryAdmin) {
      alert('Only Primary Admin (harshkumarrr143@gmail.com) can remove team members.');
      return;
    }
    if (email.toLowerCase() === MAIN_ADMIN_EMAIL.toLowerCase()) {
      alert('Primary Admin (harshkumarrr143@gmail.com) cannot be removed.');
      return;
    }
    if (!confirm(`Remove access for ${email}?`)) return;
    const updated = await removeAllowedAdminEmail(email);
    setAllowedEmails([...updated]);
  };

  // ── Team Member Handlers ──
  const resetTeamForm = () => {
    setTeamForm({ id: '', name: '', role: '', bio: '', college: '', avatar: '', linkedin: '', twitter: '', order: teamMembers.length, visible: true });
    setEditingTeamId(null);
  };

  const handleEditTeamMember = (m: TeamMember) => {
    setEditingTeamId(m.id);
    setTeamForm({
      id: m.id, name: m.name, role: m.role, bio: m.bio,
      college: m.college, avatar: m.avatar || '',
      linkedin: m.linkedin || '', twitter: m.twitter || '',
      order: m.order, visible: m.visible,
    });
    setActiveTab('team');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!teamForm.name || !teamForm.role) return;
    const id = editingTeamId || teamForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    const member: TeamMember = {
      id,
      name: teamForm.name,
      role: teamForm.role,
      bio: teamForm.bio,
      college: teamForm.college,
      avatar: teamForm.avatar,
      linkedin: teamForm.linkedin || undefined,
      twitter: teamForm.twitter || undefined,
      order: Number(teamForm.order) || 0,
      visible: teamForm.visible,
    };
    const ok = await saveTeamMember(member);
    if (ok) {
      setTeamMembers(getAllTeamMembersForAdmin());
      setTeamSuccess(editingTeamId ? '✅ Member updated!' : '✅ Member added!');
      setTimeout(() => setTeamSuccess(''), 4000);
      resetTeamForm();
    }
  };

  const handleDeleteTeamMember = async (id: string) => {
    if (!confirm('Delete this team member? This cannot be undone.')) return;
    await deleteTeamMember(id);
    setTeamMembers(getAllTeamMembersForAdmin());
  };

  const handleToggleTeamVisibility = async (id: string) => {
    await toggleTeamMemberVisibility(id);
    setTeamMembers(getAllTeamMembersForAdmin());
  };

  const inputClass = "w-full bg-white border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent placeholder:text-slate-400 transition-all";
  const labelClass = "block text-xs font-bold text-slate-700 mb-1.5 uppercase tracking-wide";

  /* ═══════════════════════════════════════════
     LOGIN SCREEN
  ═══════════════════════════════════════════ */
  if (!authenticatedEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 p-4">
        {/* Animated background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-indigo-600/10 blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl" />
          <div className="absolute inset-0 hero-grid opacity-20" />
        </div>

        <div className="relative w-full max-w-md">
          {/* Logo */}
          <div className="text-center mb-8 space-y-2">
            <div className="inline-flex items-center gap-2.5 group">
              <div className="w-11 h-11 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-lg shadow-indigo-600/30">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6">
                  <path d="M16 7c-1.5 0-3 1.5-3 3 0 1.5 1.5 3 3 3s3-1.5 3-3-1.5-3-3-3z"/>
                  <path d="M2 19c2.5-1 5.5-3.5 8.5-8 3 4.5 7.5 6.5 11.5 5.5-3 2.5-6 3.5-10 3.5-4 0-7-1-10-1z"/>
                </svg>
              </div>
              <div>
                <span className="font-extrabold text-2xl text-white tracking-widest uppercase">FLYO</span>
                <p className="text-[10px] text-indigo-300 font-semibold tracking-wide -mt-0.5">Partner Portal</p>
              </div>
            </div>
          </div>

          {/* Login Card */}
          <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 space-y-6 shadow-2xl">
            <div className="text-center space-y-2">
              <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 border border-indigo-500/30 flex items-center justify-center mx-auto">
                <Lock className="w-7 h-7 text-indigo-400" />
              </div>
              <h1 className="text-xl font-bold text-white">Restricted Access</h1>
              <p className="text-sm text-slate-400 leading-relaxed">
                Enter your authorized partner email to access the FLYO admin workspace.
              </p>
            </div>

            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label htmlFor="adminEmail" className="block text-xs font-bold text-slate-400 mb-2 uppercase tracking-widest">
                  Partner Email
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    id="adminEmail"
                    type="email"
                    required
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    placeholder="admin@flyodigital.com"
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-10 pr-4 py-3.5 text-sm text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              {authError && (
                <div className="p-3.5 rounded-xl bg-red-500/10 border border-red-500/20 text-red-300 text-xs flex items-start gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                  <span>{authError}</span>
                </div>
              )}

              <button
                type="submit"
                disabled={isLoggingIn}
                className="w-full py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30"
              >
                {isLoggingIn ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <KeyRound className="w-4 h-4" />
                    <span>Unlock Partner Workspace</span>
                  </>
                )}
              </button>
            </form>

            <div className="pt-2 border-t border-white/10 text-center space-y-1">
              <p className="text-[11px] text-slate-500">
                Access is restricted to authorized FLYO team members and partners.
              </p>
            </div>
          </div>

          <p className="text-center text-xs text-slate-600 mt-6">
            <Link href="/" className="hover:text-slate-400 transition-colors flex items-center justify-center gap-1">
              ← Back to FLYO website
            </Link>
          </p>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     ADMIN DASHBOARD
  ═══════════════════════════════════════════ */
  const tabs = [
    { id: 'articles', label: 'Write Article', icon: <PenTool className="w-4 h-4" />, count: null, adminOnly: false },
    { id: 'manage', label: 'Manage Articles', icon: <BookOpen className="w-4 h-4" />, count: publishedArticles.length, adminOnly: false },
    { id: 'emails', label: 'Partner Access', icon: <Users className="w-4 h-4" />, count: allowedEmails.length, adminOnly: false },
    { id: 'audit', label: 'SEO Audit', icon: <BarChart2 className="w-4 h-4" />, count: null, adminOnly: false },
    { id: 'team', label: 'Team Members', icon: <Users className="w-4 h-4" />, count: teamMembers.length, adminOnly: true },
  ];

  return (
    <div className="min-h-screen bg-slate-50">
      
      {/* ── TOP ADMIN NAVBAR ── */}
      <div className="bg-slate-900 border-b border-slate-800 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Logo & breadcrumb */}
            <div className="flex items-center gap-3">
              <Link href="/" className="flex items-center gap-2 group">
                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4">
                    <path d="M16 7c-1.5 0-3 1.5-3 3 0 1.5 1.5 3 3 3s3-1.5 3-3-1.5-3-3-3z"/>
                    <path d="M2 19c2.5-1 5.5-3.5 8.5-8 3 4.5 7.5 6.5 11.5 5.5-3 2.5-6 3.5-10 3.5-4 0-7-1-10-1z"/>
                  </svg>
                </div>
                <span className="text-white font-bold text-sm group-hover:text-indigo-300 transition-colors">FLYO</span>
              </Link>
              <span className="text-slate-600">/</span>
              <span className="text-slate-400 text-sm font-medium">Admin Portal</span>
            </div>

            {/* Right: User info & logout */}
            <div className="flex items-center gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 text-xs font-semibold truncate max-w-[200px]">{authenticatedEmail}</span>
              </div>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-red-900/40 border border-slate-700 hover:border-red-500/30 text-slate-400 hover:text-red-400 text-xs font-semibold transition-all"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">

          {/* ── SIDEBAR ── */}
          <aside className="lg:w-56 shrink-0 space-y-2">
            {/* Dashboard header */}
            <div className="p-4 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-700 text-white space-y-1 mb-4">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-200" />
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-200">Dashboard</span>
              </div>
              <p className="text-sm font-bold leading-tight">FLYO Admin Workspace</p>
              <p className="text-[10px] text-indigo-200">Partner Portal v2.0</p>
            </div>

            {/* Nav Items */}
            {tabs
              .filter(tab => !tab.adminOnly || isCurrentPrimaryAdmin)
              .map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white shadow-md shadow-indigo-600/20'
                    : 'text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  {tab.icon}
                  <span>{tab.label}</span>
                  {tab.adminOnly && <span className="ml-1 px-1.5 py-0.5 rounded text-[8px] font-extrabold bg-amber-100 text-amber-700 uppercase tracking-wide">Admin</span>}
                </div>
                {tab.count !== null && (
                  <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                    activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-500'
                  }`}>
                    {tab.count}
                  </span>
                )}
              </button>
            ))}

            {/* Quick links */}
            <div className="pt-4 mt-4 border-t border-slate-200 space-y-1">
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Quick Links</p>
              <Link href="/articles" target="_blank" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                <Globe className="w-3.5 h-3.5" />
                <span>View Public Articles</span>
                <ArrowRight className="w-3 h-3 ml-auto" />
              </Link>
              <Link href="/" target="_blank" className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 transition-all">
                <Globe className="w-3.5 h-3.5" />
                <span>View Website</span>
                <ArrowRight className="w-3 h-3 ml-auto" />
              </Link>
            </div>
          </aside>

          {/* ── MAIN CONTENT ── */}
          <div className="flex-1 min-w-0 space-y-6">
            
            {/* Success banner */}
            {publishSuccess && (
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-fade-in">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                <div>
                  <span className="font-bold">Article submitted successfully!</span>
                  {' '}
                  {authenticatedEmail?.toLowerCase() === MAIN_ADMIN_EMAIL.toLowerCase()
                    ? 'It is live on the FLYO articles page.'
                    : 'It has been sent for approval to harshkumarrr143@gmail.com and will go live once approved.'}
                </div>
                <Link href="/articles" className="ml-auto text-xs font-bold text-emerald-700 hover:underline shrink-0">View →</Link>
              </div>
            )}

            {/* ═══ TAB: WRITE ARTICLE ═══ */}
            {activeTab === 'articles' && (
              <div className="space-y-6">
                {/* Editing banner */}
                {editingSlug && (
                  <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 flex items-center gap-3">
                    <Edit2 className="w-4 h-4 text-amber-600 shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-amber-900">Editing Article</p>
                      <p className="text-xs text-amber-700 truncate">Slug: /{editingSlug}</p>
                    </div>
                    <button
                      onClick={handleCancelEdit}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xs transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel Edit
                    </button>
                  </div>
                )}

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                      {editingSlug ? 'Edit Article' : 'Write New Article'}
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {editingSlug ? 'Update the article content and save changes' : 'Publish a new article or guide to the FLYO website'}
                    </p>
                  </div>
                  <button
                    onClick={() => setPreviewMode(!previewMode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold border transition-all ${
                      previewMode
                        ? 'bg-indigo-600 text-white border-indigo-600'
                        : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                    }`}
                  >
                    {previewMode ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                    <span>{previewMode ? 'Hide Preview' : 'Show Preview'}</span>
                  </button>
                </div>

                <div className={`grid gap-6 ${previewMode ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
                  
                  {/* Article Form */}
                  <form onSubmit={handlePublishArticle} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                    
                    {/* Form sections */}
                    <div className="p-6 border-b border-slate-100 space-y-5">
                      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Article Details</h2>
                      
                      <div>
                        <label htmlFor="title" className={labelClass}>Article Title *</label>
                        <input
                          id="title"
                          type="text"
                          required
                          value={articleTitle}
                          onChange={(e) => setArticleTitle(e.target.value)}
                          placeholder="e.g. 5 Local SEO Tips for Restaurants in 2026"
                          className={inputClass}
                        />
                        {articleTitle && (
                          <p className="mt-1.5 text-[11px] text-slate-400 font-mono">
                            Slug: /{articleTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}
                          </p>
                        )}
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="category" className={labelClass}>Category</label>
                          <select
                            id="category"
                            value={articleCategory}
                            onChange={(e) => setArticleCategory(e.target.value as any)}
                            className={inputClass}
                          >
                            <option value="Local Business">Local Business</option>
                            <option value="SEO">SEO</option>
                            <option value="Websites">Websites</option>
                            <option value="Social Media">Social Media</option>
                            <option value="Marketing">Marketing</option>
                            <option value="Design">Design</option>
                          </select>
                        </div>
                        <div>
                          <label htmlFor="readingTime" className={labelClass}>Read Time (min)</label>
                          <input
                            id="readingTime"
                            type="number"
                            min={1}
                            value={readingTime}
                            onChange={(e) => setReadingTime(Number(e.target.value))}
                            className={inputClass}
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="summary" className={labelClass}>Summary / Excerpt *</label>
                        <textarea
                          id="summary"
                          rows={2}
                          required
                          value={summary}
                          onChange={(e) => setSummary(e.target.value)}
                          placeholder="A brief, compelling summary of what readers will learn..."
                          className={inputClass}
                        />
                        <p className="mt-1 text-[11px] text-slate-400">{summary.length}/200 characters</p>
                      </div>
                    </div>

                    <div className="p-6 border-b border-slate-100 space-y-5">
                      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Author Info</h2>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label htmlFor="authorName" className={labelClass}>Author Name</label>
                          <input
                            id="authorName"
                            type="text"
                            value={authorName}
                            onChange={(e) => setAuthorName(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                        <div>
                          <label htmlFor="authorRole" className={labelClass}>Author Role</label>
                          <input
                            id="authorRole"
                            type="text"
                            value={authorRole}
                            onChange={(e) => setAuthorRole(e.target.value)}
                            className={inputClass}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-b border-slate-100 space-y-5">
                      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Content</h2>
                      
                      <div>
                        <label htmlFor="contentHtml" className={labelClass}>
                          Article Body (HTML or Plain Paragraphs) *
                        </label>
                        <div className="rounded-xl border border-slate-200 overflow-hidden">
                          <div className="flex items-center gap-2 px-3 py-2 bg-slate-50 border-b border-slate-200 text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                            <Code2 className="w-3 h-3" />
                            <span>HTML Editor</span>
                            <div className="ml-auto flex gap-1">
                              {['<h2>', '<p>', '<ul>', '<strong>'].map(tag => (
                                <button
                                  key={tag}
                                  type="button"
                                  onClick={() => setContentHtml(prev => prev + tag + '</' + tag.slice(1))}
                                  className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors text-[10px] font-mono"
                                >
                                  {tag}
                                </button>
                              ))}
                            </div>
                          </div>
                          <textarea
                            id="contentHtml"
                            rows={10}
                            required
                            value={contentHtml}
                            onChange={(e) => setContentHtml(e.target.value)}
                            placeholder={'<h2>Introduction</h2>\n<p>Start your article here...</p>\n\n<h2>Section 1</h2>\n<p>Write your content...</p>'}
                            className="w-full px-4 py-3 text-sm text-slate-900 font-mono bg-white focus:outline-none focus:ring-0 resize-none"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="p-6 border-b border-slate-100 space-y-5">
                      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Media & Links</h2>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <label htmlFor="heroImage" className={labelClass}>Hero Image (Upload or URL)</label>
                          
                          {/* File Upload Button for Cloudinary */}
                          <div className="relative">
                            <input
                              type="file"
                              accept="image/*"
                              onChange={async (e) => {
                                const file = e.target.files?.[0];
                                if (!file) return;
                                setIsUploadingImage(true);
                                try {
                                  const url = await uploadImageToCloudinary(file);
                                  setHeroImage(url);
                                } catch (err) {
                                  alert('Image upload failed. Please try again.');
                                } finally {
                                  setIsUploadingImage(false);
                                }
                              }}
                              className="hidden"
                              id="cloudinaryUploadInput"
                            />
                            <label
                              htmlFor="cloudinaryUploadInput"
                              className="w-full py-2.5 px-4 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-100/50 text-indigo-700 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all mb-2"
                            >
                              <ImageIcon className="w-4 h-4 text-indigo-600" />
                              <span>{isUploadingImage ? 'Uploading Image...' : '☁️ Upload Photo from Device'}</span>
                            </label>
                          </div>

                          <input
                            id="heroImage"
                            type="url"
                            value={heroImage}
                            onChange={(e) => setHeroImage(e.target.value)}
                            placeholder="Or paste image URL https://..."
                            className={inputClass}
                          />
                          
                          {heroImage && (
                            <div className="mt-2 rounded-lg overflow-hidden h-20 bg-slate-100 border border-slate-200">
                              <img src={heroImage} alt="Hero preview" className="w-full h-full object-cover" />
                            </div>
                          )}
                        </div>
                        <div>
                          <label htmlFor="relatedService" className={labelClass}>Related Service</label>
                          <select
                            id="relatedService"
                            value={relatedServiceSlug}
                            onChange={(e) => setRelatedServiceSlug(e.target.value)}
                            className={inputClass}
                          >
                            <option value="web-development">Web Development</option>
                            <option value="promotions">Promotions</option>
                            <option value="seo">SEO</option>
                            <option value="social-media">Social Media</option>
                            <option value="poster-design">Poster Design</option>
                            <option value="thumbnail-design">Thumbnail Design</option>
                            <option value="local-business-growth">Local Business Growth</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Submit */}
                    <div className="p-6 flex gap-3">
                      {editingSlug && (
                        <button
                          type="button"
                          onClick={handleCancelEdit}
                          className="flex-1 py-4 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2"
                        >
                          <X className="w-4 h-4" />
                          <span>Cancel</span>
                        </button>
                      )}
                      <button
                        type="submit"
                        className="flex-1 py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 hover:shadow-indigo-600/30"
                      >
                        {editingSlug ? <Save className="w-4 h-4" /> : <Upload className="w-4 h-4" />}
                        <span>{editingSlug ? 'Save Changes' : 'Publish Article to FLYO'}</span>
                      </button>
                    </div>
                  </form>

                  {/* Preview Panel */}
                  {previewMode && (
                    <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                      <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-slate-500" />
                        <span className="text-sm font-bold text-slate-700">Live Preview</span>
                      </div>
                      <div className="p-6 space-y-4">
                        {/* Article preview */}
                        {heroImage && (
                          <div className="h-40 rounded-xl overflow-hidden bg-slate-100">
                            <img src={heroImage} alt="Preview" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase">{articleCategory}</span>
                          <span className="text-[11px] text-slate-400">{readingTime} min read</span>
                        </div>
                        <h3 className="text-xl font-extrabold text-slate-900 leading-tight">
                          {articleTitle || 'Article Title will appear here'}
                        </h3>
                        <p className="text-sm text-slate-600">{summary || 'Summary will appear here...'}</p>
                        <div className="flex items-center gap-2 pt-2 border-t border-slate-100">
                          <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600">
                            {authorName.charAt(0)}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-slate-800">{authorName}</p>
                            <p className="text-[10px] text-slate-400">{authorRole}</p>
                          </div>
                        </div>
                        {contentHtml && (
                          <div
                            className="prose prose-sm max-w-none pt-4 border-t border-slate-100 text-slate-700"
                            dangerouslySetInnerHTML={{ __html: contentHtml }}
                          />
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* ═══ TAB: MANAGE ARTICLES ═══ */}
            {activeTab === 'manage' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Manage Articles</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {publishedArticles.length} article{publishedArticles.length !== 1 ? 's' : ''} total ({publishedArticles.filter(a => a.status === 'pending').length} pending approval)
                    </p>
                  </div>
                  {authenticatedEmail?.toLowerCase() === MAIN_ADMIN_EMAIL.toLowerCase() && (
                    <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      Super Admin (Approval Rights)
                    </span>
                  )}
                </div>

                {publishedArticles.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="text-base font-bold text-slate-700">No articles yet</h3>
                    <p className="text-sm text-slate-500">Start by writing your first article above.</p>
                    <button
                      onClick={() => setActiveTab('articles')}
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs mt-2"
                    >
                      <PenTool className="w-3.5 h-3.5" />
                      Write First Article
                    </button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {publishedArticles.map((article, idx) => {
                      const isPending = article.status === 'pending';
                      const isMainAdmin = authenticatedEmail?.toLowerCase() === MAIN_ADMIN_EMAIL.toLowerCase();

                      return (
                        <div
                          key={article.slug}
                          className={`bg-white border rounded-2xl p-5 flex items-start justify-between gap-4 transition-all ${
                            isPending ? 'border-amber-200 bg-amber-50/30' : 'border-slate-200 hover:border-indigo-200'
                          }`}
                        >
                          <div className="flex gap-4 items-start min-w-0">
                            {article.heroImage && (
                              <div className="w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                                <img src={article.heroImage} alt={article.title} className="w-full h-full object-cover" />
                              </div>
                            )}
                            <div className="min-w-0">
                              <div className="flex items-center gap-2 mb-1 flex-wrap">
                                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-700 text-[10px] font-bold uppercase">{article.category}</span>
                                
                                {isPending ? (
                                  <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300 text-[10px] font-bold uppercase flex items-center gap-1">
                                    <Clock3 className="w-3 h-3 text-amber-600" />
                                    Pending Approval
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 text-[10px] font-bold uppercase flex items-center gap-1">
                                    <Check className="w-3 h-3 text-emerald-600" />
                                    Live
                                  </span>
                                )}

                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                  <Clock className="w-3 h-3" />{article.readingTimeMinutes}m
                                </span>
                                <span className="text-[11px] text-slate-400 flex items-center gap-1">
                                  <Calendar className="w-3 h-3" />{article.publishedAt}
                                </span>
                              </div>
                              <h3 className="font-bold text-sm text-slate-900 line-clamp-1">{article.title}</h3>
                              <p className="text-xs text-slate-500 line-clamp-1 mt-0.5">{article.summary}</p>
                              {article.submittedBy && (
                                <p className="text-[10px] text-slate-400 mt-1">Submitted by: {article.submittedBy}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Primary Admin Controls: Approve or Stop Live */}
                            {isMainAdmin && (
                              <>
                                {isPending ? (
                                  <button
                                    onClick={() => handleApproveArticle(article.slug)}
                                    className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-sm"
                                    title="Approve and Publish to Live Site"
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Approve</span>
                                  </button>
                                ) : (
                                  <button
                                    onClick={() => handleUnpublishArticle(article.slug)}
                                    className="px-3 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-600 text-white font-bold text-xs flex items-center gap-1 transition-colors shadow-sm"
                                    title="Stop article from live site (move back to pending)"
                                  >
                                    <PauseCircle className="w-3.5 h-3.5" />
                                    <span>Stop Live</span>
                                  </button>
                                )}
                              </>
                            )}

                            {/* View button (Everyone) */}
                            <Link
                              href={`/articles/${article.slug}`}
                              target="_blank"
                              className="p-2 rounded-lg bg-slate-100 hover:bg-indigo-100 text-slate-500 hover:text-indigo-600 transition-colors"
                              title="View article"
                            >
                              <Eye className="w-4 h-4" />
                            </Link>

                            {/* Edit button (Everyone) */}
                            <button
                              onClick={() => handleEditArticle(article)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-400 hover:text-amber-600 transition-colors"
                              title="Edit article"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete button (Primary Admin ONLY) */}
                            {isMainAdmin && (
                              <button
                                onClick={() => handleDeleteArticle(article.slug)}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                                title="Delete article (Primary Admin only)"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* ═══ TAB: EMAIL ACCESS MANAGEMENT ═══ */}
            {activeTab === 'emails' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">Partner Access Management</h1>
                  <p className="text-sm text-slate-500 mt-0.5">Control which email addresses can access the FLYO admin portal</p>
                </div>

                {/* Logged-in session status banner */}
                <div className="bg-indigo-50/80 border border-indigo-100 rounded-2xl p-4 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-xl bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm">
                      {authenticatedEmail?.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="text-[10px] uppercase tracking-wider font-extrabold text-indigo-700">Active Session</p>
                      <p className="text-sm font-bold text-slate-900">{authenticatedEmail}</p>
                    </div>
                  </div>
                  {isCurrentPrimaryAdmin ? (
                    <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                      👑 Primary Admin (Owner) — You have full permission to add/remove members
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold flex items-center gap-1.5">
                      🔒 Standard Partner — Read-only team list (Cannot add or remove members)
                    </span>
                  )}
                </div>

                {/* Grant access form (Primary Admin only) */}
                {isCurrentPrimaryAdmin ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-6 space-y-4 shadow-sm">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-lg bg-indigo-100 flex items-center justify-center">
                        <Plus className="w-4 h-4 text-indigo-600" />
                      </div>
                      <h2 className="text-base font-bold text-slate-900">Grant Partner Access</h2>
                    </div>

                    {emailSuccessMsg && (
                      <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                        <span>{emailSuccessMsg}</span>
                      </div>
                    )}

                    <form onSubmit={handleAddEmail} className="flex gap-3">
                      <div className="relative flex-1">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          value={newEmailToAdd}
                          onChange={(e) => setNewEmailToAdd(e.target.value)}
                          placeholder="partner@example.com"
                          className="w-full pl-10 pr-4 py-3 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                      </div>
                      <button
                        type="submit"
                        className="px-5 py-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-sm transition-colors flex items-center gap-2 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Add Access</span>
                      </button>
                    </form>
                  </div>
                ) : (
                  <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-slate-600 text-xs flex items-center gap-2">
                    <span>🔒 Only Primary Admin ({MAIN_ADMIN_EMAIL}) can grant or remove partner access.</span>
                  </div>
                )}

                {/* Email list */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-700">Authorized Partners ({allowedEmails.length})</h2>
                    <span className="text-[11px] text-slate-400 font-medium">All have full admin access</span>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {allowedEmails
                      .filter((e): e is string => typeof e === 'string' && e.trim() !== '')
                      .map((email, idx) => {
                        const isPrimaryAdmin = email.toLowerCase() === MAIN_ADMIN_EMAIL.toLowerCase();

                        return (
                          <div key={idx} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-white text-xs font-bold">
                                {email.charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p className="text-sm font-semibold text-slate-800">{email}</p>
                                {isPrimaryAdmin && (
                                  <p className="text-[10px] text-amber-600 font-extrabold flex items-center gap-1">
                                    👑 Primary Admin (Owner)
                                  </p>
                                )}
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold">
                                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                Authorized
                              </span>
                              {isCurrentPrimaryAdmin && !isPrimaryAdmin && (
                                <button
                                  onClick={() => handleRemoveEmail(email)}
                                  className="p-1.5 rounded-lg text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                                  title="Remove access"
                                >
                                  <X className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>
              </div>
            )}

            {/* ═══ TAB: SEO AUDIT ═══ */}
            {activeTab === 'audit' && (
              <div className="space-y-6">
                <div>
                  <h1 className="text-2xl font-extrabold text-slate-900">SEO Quality Audit</h1>
                  <p className="text-sm text-slate-500 mt-0.5">Run technical SEO checks on the FLYO website</p>
                </div>
                <AuditTool />
              </div>
            )}

            {/* ═══ TAB: TEAM MEMBERS (Primary Admin Only) ═══ */}
            {activeTab === 'team' && isCurrentPrimaryAdmin && (
              <div className="space-y-6">

                {/* Header */}
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Team Members</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Add, edit, or remove people shown on the <span className="font-semibold text-indigo-600">/about</span> page
                    </p>
                  </div>
                  {editingTeamId && (
                    <button
                      onClick={resetTeamForm}
                      className="flex items-center gap-2 px-3 py-2 rounded-xl bg-amber-100 hover:bg-amber-200 text-amber-800 font-bold text-xs transition-all"
                    >
                      <X className="w-3.5 h-3.5" />
                      Cancel Edit
                    </button>
                  )}
                </div>

                {/* Success banner */}
                {teamSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                    <span>{teamSuccess}</span>
                  </div>
                )}

                {/* ── ADD / EDIT FORM ── */}
                <form onSubmit={handleSaveTeamMember} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-100 bg-slate-50 flex items-center gap-2">
                    {editingTeamId ? <Edit2 className="w-4 h-4 text-amber-500" /> : <Plus className="w-4 h-4 text-indigo-500" />}
                    <span className="text-sm font-bold text-slate-700">{editingTeamId ? 'Edit Team Member' : 'Add New Team Member'}</span>
                  </div>

                  <div className="p-6 grid grid-cols-1 sm:grid-cols-2 gap-5">

                    {/* Name */}
                    <div>
                      <label className={labelClass}>Full Name *</label>
                      <input
                        type="text" required value={teamForm.name}
                        onChange={e => setTeamForm(f => ({ ...f, name: e.target.value }))}
                        placeholder="e.g. Alex Rivers"
                        className={inputClass}
                      />
                      {teamForm.name && !editingTeamId && (
                        <p className="mt-1 text-[11px] text-slate-400 font-mono">
                          ID: {teamForm.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '')}
                        </p>
                      )}
                    </div>

                    {/* Role */}
                    <div>
                      <label className={labelClass}>Role / Title *</label>
                      <input
                        type="text" required value={teamForm.role}
                        onChange={e => setTeamForm(f => ({ ...f, role: e.target.value }))}
                        placeholder="e.g. Lead Designer"
                        className={inputClass}
                      />
                    </div>

                    {/* College */}
                    <div className="sm:col-span-2">
                      <label className={labelClass}>College / Program</label>
                      <input
                        type="text" value={teamForm.college}
                        onChange={e => setTeamForm(f => ({ ...f, college: e.target.value }))}
                        placeholder="e.g. Design & Visual Arts Senior"
                        className={inputClass}
                      />
                    </div>

                    {/* Bio */}
                    <div className="sm:col-span-2">
                      <label className={labelClass}>Bio / Description</label>
                      <textarea
                        rows={3} value={teamForm.bio}
                        onChange={e => setTeamForm(f => ({ ...f, bio: e.target.value }))}
                        placeholder="Short bio that appears on the about page..."
                        className={inputClass}
                      />
                    </div>

                    {/* Avatar upload or URL */}
                    <div className="sm:col-span-2 space-y-2">
                      <label className={labelClass}>Profile Photo (Upload or URL)</label>
                      <div className="flex gap-3 items-start">
                        {/* Upload button */}
                        <div className="flex-1">
                          <input
                            type="file" accept="image/*" id="teamAvatarUpload"
                            className="hidden"
                            onChange={async (e) => {
                              const file = e.target.files?.[0];
                              if (!file) return;
                              setIsUploadingTeamAvatar(true);
                              try {
                                const url = await uploadImageToCloudinary(file);
                                setTeamForm(f => ({ ...f, avatar: url }));
                              } catch {
                                alert('Upload failed. Try again.');
                              } finally {
                                setIsUploadingTeamAvatar(false);
                              }
                            }}
                          />
                          <label
                            htmlFor="teamAvatarUpload"
                            className="w-full py-2.5 px-4 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-100/50 text-indigo-700 font-semibold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all mb-2"
                          >
                            <ImageIcon className="w-4 h-4 text-indigo-600" />
                            {isUploadingTeamAvatar ? 'Uploading...' : '☁️ Upload Photo'}
                          </label>
                          <input
                            type="url" value={teamForm.avatar}
                            onChange={e => setTeamForm(f => ({ ...f, avatar: e.target.value }))}
                            placeholder="Or paste image URL https://..."
                            className={inputClass}
                          />
                        </div>
                        {teamForm.avatar && (
                          <img src={teamForm.avatar} alt="preview" className="w-16 h-16 rounded-full object-cover border border-slate-200 shrink-0" />
                        )}
                      </div>
                    </div>

                    {/* LinkedIn */}
                    <div>
                      <label className={labelClass}>LinkedIn URL</label>
                      <input
                        type="url" value={teamForm.linkedin}
                        onChange={e => setTeamForm(f => ({ ...f, linkedin: e.target.value }))}
                        placeholder="https://linkedin.com/in/..."
                        className={inputClass}
                      />
                    </div>

                    {/* Twitter */}
                    <div>
                      <label className={labelClass}>Twitter / X URL</label>
                      <input
                        type="url" value={teamForm.twitter}
                        onChange={e => setTeamForm(f => ({ ...f, twitter: e.target.value }))}
                        placeholder="https://x.com/..."
                        className={inputClass}
                      />
                    </div>

                    {/* Order */}
                    <div>
                      <label className={labelClass}>Display Order</label>
                      <input
                        type="number" min={0} value={teamForm.order}
                        onChange={e => setTeamForm(f => ({ ...f, order: Number(e.target.value) }))}
                        className={inputClass}
                      />
                    </div>

                    {/* Visible toggle */}
                    <div className="flex items-center gap-3 self-end pb-2">
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={teamForm.visible}
                          onChange={e => setTeamForm(f => ({ ...f, visible: e.target.checked }))}
                          className="sr-only peer"
                        />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-500 rounded-full peer peer-checked:bg-indigo-600 transition-colors" />
                        <div className="absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform peer-checked:translate-x-5" />
                      </label>
                      <span className="text-sm font-semibold text-slate-700">Visible on site</span>
                    </div>
                  </div>

                  <div className="px-6 pb-6 flex gap-3">
                    {editingTeamId && (
                      <button
                        type="button" onClick={resetTeamForm}
                        className="flex-1 py-3.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-sm transition-all flex items-center justify-center gap-2"
                      >
                        <X className="w-4 h-4" /> Cancel
                      </button>
                    )}
                    <button
                      type="submit"
                      className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                    >
                      {editingTeamId ? <Save className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                      {editingTeamId ? 'Save Changes' : 'Add Member'}
                    </button>
                  </div>
                </form>

                {/* ── MEMBERS LIST ── */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-700">All Team Members ({teamMembers.length})</h2>
                    <span className="text-[11px] text-slate-400">{teamMembers.filter(m => m.visible).length} visible on site</span>
                  </div>

                  {teamMembers.length === 0 ? (
                    <div className="p-12 text-center space-y-2">
                      <Users className="w-10 h-10 text-slate-300 mx-auto" />
                      <p className="text-sm text-slate-500">No team members yet. Add one above.</p>
                    </div>
                  ) : (
                    <div className="divide-y divide-slate-100">
                      {teamMembers.map((m) => (
                        <div key={m.id} className="flex items-center gap-4 px-6 py-4 hover:bg-slate-50 transition-colors">
                          {/* Avatar */}
                          {m.avatar ? (
                            <img src={m.avatar} alt={m.name} className="w-10 h-10 rounded-full object-cover border border-slate-200 shrink-0" />
                          ) : (
                            <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-700 font-bold text-sm shrink-0">
                              {m.name.split(' ').map(n => n[0]).join('')}
                            </div>
                          )}

                          {/* Info */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2">
                              <p className="text-sm font-bold text-slate-900 truncate">{m.name}</p>
                              <span className={`px-2 py-0.5 rounded-full text-[9px] font-extrabold uppercase ${
                                m.visible
                                  ? 'bg-emerald-100 text-emerald-700'
                                  : 'bg-slate-100 text-slate-500'
                              }`}>
                                {m.visible ? 'Visible' : 'Hidden'}
                              </span>
                            </div>
                            <p className="text-xs text-indigo-600 font-semibold">{m.role}</p>
                            <p className="text-xs text-slate-400 truncate">{m.college}</p>
                          </div>

                          {/* Actions */}
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Toggle visibility */}
                            <button
                              onClick={() => handleToggleTeamVisibility(m.id)}
                              className={`p-2 rounded-lg text-xs font-bold transition-colors ${
                                m.visible
                                  ? 'bg-emerald-50 text-emerald-600 hover:bg-red-50 hover:text-red-500'
                                  : 'bg-slate-100 text-slate-400 hover:bg-emerald-50 hover:text-emerald-600'
                              }`}
                              title={m.visible ? 'Hide from site' : 'Show on site'}
                            >
                              {m.visible ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                            </button>

                            {/* Edit */}
                            <button
                              onClick={() => handleEditTeamMember(m)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-400 hover:text-amber-600 transition-colors"
                              title="Edit member"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>

                            {/* Delete */}
                            <button
                              onClick={() => handleDeleteTeamMember(m.id)}
                              className="p-2 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                              title="Delete member"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* Link to site */}
                <div className="flex items-center gap-2 text-xs text-slate-500">
                  <Globe className="w-3.5 h-3.5" />
                  <span>Changes are reflected immediately on the </span>
                  <Link href="/about" target="_blank" className="text-indigo-600 hover:underline font-semibold">/about page →</Link>
                </div>

              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

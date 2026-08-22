'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import FlyoLoader from '@/components/ui/FlyoLoader';
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
  ArrowLeft,
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
  Loader2,
  Image as ImageIcon
} from 'lucide-react';
import { uploadImageToCloudinary } from '@/lib/uploadImage';
import RichTextEditor from '@/components/ui/RichTextEditor';
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
import { saveProject } from '@/lib/data/workStore';
import { formatContentWithHyperlinks } from '@/lib/utils/formatContent';
import { ArticleItem, TeamMember, WorkProject } from '@/lib/types/seo';
import { verifyUserPassword, changeUserPassword } from '@/lib/data/authStore';

const AUTH_STORAGE_KEY = 'flyo_authenticated_partner_email';

export default function WorkspaceAdminPage() {
  const [emailInput, setEmailInput] = useState('');
  const [passwordInput, setPasswordInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authenticatedEmail, setAuthenticatedEmail] = useState<string | null>(null);
  const [authError, setAuthError] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  // ── Change Password State ──
  const [isPasswordModalOpen, setIsPasswordModalOpen] = useState(false);
  const [currentPassInput, setCurrentPassInput] = useState('');
  const [newPassInput, setNewPassInput] = useState('');
  const [confirmPassInput, setConfirmPassInput] = useState('');
  const [showCurrentPass, setShowCurrentPass] = useState(false);
  const [showNewPass, setShowNewPass] = useState(false);
  const [passwordChangeSuccess, setPasswordChangeSuccess] = useState('');
  const [passwordChangeError, setPasswordChangeError] = useState('');
  const [isSavingPassword, setIsSavingPassword] = useState(false);
  
  const [allowedEmails, setAllowedEmails] = useState<string[]>([]);
  const [newEmailToAdd, setNewEmailToAdd] = useState('');
  const [emailSuccessMsg, setEmailSuccessMsg] = useState('');

  const [activeTab, setActiveTab] = useState<'articles' | 'projects' | 'manage' | 'emails' | 'team'>('articles');

  // Real Project Form State
  const [projectTitle, setProjectTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [projectCategory, setProjectCategory] = useState<'Websites' | 'Social Media' | 'Posters' | 'Thumbnails' | 'Branding' | 'Marketing'>('Websites');
  const [projectService, setProjectService] = useState('Web Development');
  const [projectShortDescription, setProjectShortDescription] = useState('');
  const [projectChallenge, setProjectChallenge] = useState('');
  const [projectWhatWeDid, setProjectWhatWeDid] = useState('');
  const [projectFinalResult, setProjectFinalResult] = useState('');
  const [projectMeasurableResult, setProjectMeasurableResult] = useState('');
  const [projectHeroImage, setProjectHeroImage] = useState('');
  const [isUploadingProjectImage, setIsUploadingProjectImage] = useState(false);
  const [projectSuccess, setProjectSuccess] = useState(false);
  const [projectError, setProjectError] = useState('');

  // ── Team Members State ──
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [teamForm, setTeamForm] = useState<{
    id: string; name: string; role: string; bio: string;
    college: string; avatar: string; linkedin: string; twitter: string;
    customLinkName: string; customLinkUrl: string;
    order: number; visible: boolean;
  }>({
    id: '', name: '', role: '', bio: '', college: '',
    avatar: '', linkedin: '', twitter: '', customLinkName: '', customLinkUrl: '', order: 0, visible: true,
  });
  const [editingTeamId, setEditingTeamId] = useState<string | null>(null);
  const [teamSuccess, setTeamSuccess] = useState('');
  const [teamError, setTeamError] = useState('');
  const [isSavingTeam, setIsSavingTeam] = useState(false);
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
  const [publishError, setPublishError] = useState('');
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

  // Handle Login Verification (Verifies Email & Password)
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError('');
    const cleanEmail = emailInput.trim().toLowerCase();
    const cleanPass = passwordInput.trim();
    
    if (!cleanEmail) {
      setAuthError('Please enter a valid email address.');
      return;
    }
    if (!cleanPass) {
      setAuthError('Please enter your workspace password. (Default is "user")');
      return;
    }

    setIsLoggingIn(true);

    try {
      const res = await verifyUserPassword(cleanEmail, cleanPass);
      
      if (res.valid) {
        // Single continuous smooth expansion & fade-out (750ms)
        await new Promise((resolve) => setTimeout(resolve, 750));

        setAuthenticatedEmail(cleanEmail);
        setAllowedEmails(getAllowedAdminEmails());
        if (typeof window !== 'undefined') {
          localStorage.setItem(AUTH_STORAGE_KEY, cleanEmail);
        }
        setAuthError('');
        setPasswordInput('');
      } else {
        setAuthError(res.error || 'Access Denied: Invalid email or password.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setAuthError('Login failed. Please check your connection and try again.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // Handle Change Password
  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordChangeError('');
    setPasswordChangeSuccess('');

    if (!authenticatedEmail) return;

    if (!currentPassInput) {
      setPasswordChangeError('Please enter your current password.');
      return;
    }
    if (!newPassInput || newPassInput.length < 3) {
      setPasswordChangeError('New password must be at least 3 characters long.');
      return;
    }
    if (newPassInput !== confirmPassInput) {
      setPasswordChangeError('New password and confirm password do not match.');
      return;
    }

    setIsSavingPassword(true);
    try {
      const res = await changeUserPassword(authenticatedEmail, currentPassInput, newPassInput);
      if (res.success) {
        setPasswordChangeSuccess('✅ Password updated successfully! Use your new password on next login.');
        setCurrentPassInput('');
        setNewPassInput('');
        setConfirmPassInput('');
        setTimeout(() => {
          setPasswordChangeSuccess('');
          setIsPasswordModalOpen(false);
        }, 2200);
      } else {
        setPasswordChangeError(res.error || 'Failed to update password.');
      }
    } catch (err) {
      console.error('Change password error:', err);
      setPasswordChangeError('An unexpected error occurred while changing password.');
    } finally {
      setIsSavingPassword(false);
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
    // Strip HTML tags to get actual text length for validation
    const contentText = contentHtml.replace(/<[^>]*>/g, '').trim();
    if (!articleTitle || !summary || !contentText) return;

    const slug = editingSlug || articleTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const isMainAdmin = authenticatedEmail?.toLowerCase() === MAIN_ADMIN_EMAIL.toLowerCase();
    const existingArt = publishedArticles.find(a => a.slug === slug);
    
    // Status logic: Primary admin posts directly as 'approved'. All other partner posts/edits come as 'pending' for review.
    const articleStatus: 'approved' | 'pending' = isMainAdmin ? 'approved' : 'pending';

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
      // Rich editor already outputs HTML — only use formatContentWithHyperlinks for legacy plain-text fallback
      contentHtml: (() => {
        const trimmed = contentHtml.trim();
        // If it starts with an HTML tag it came from the rich editor — keep it as-is
        if (trimmed.startsWith('<')) return trimmed;
        // Legacy plain text → auto-format
        return formatContentWithHyperlinks(trimmed);
      })(),
      relatedServiceSlug,
      status: articleStatus,
      submittedBy: existingArt?.submittedBy || authenticatedEmail || 'Partner',
    };

    setPublishError('');
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
    } else {
      setPublishError('Save failed. Please check your connection and try again.');
      setTimeout(() => setPublishError(''), 5000);
    }
  };

  // Handle Real Project Publishing
  const handlePublishProject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!projectTitle || !projectShortDescription) return;

    const slug = projectTitle
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)+/g, '');

    const steps = projectWhatWeDid
      .split('\n')
      .map((s) => s.trim())
      .filter(Boolean);

    const newProject: WorkProject = {
      slug: slug || `project-${Date.now()}`,
      title: projectTitle,
      clientName: clientName || projectTitle,
      category: projectCategory,
      service: projectService,
      shortDescription: projectShortDescription,
      challenge: projectChallenge,
      whatWeDid: steps.length > 0 ? steps : [projectShortDescription],
      finalResult: projectFinalResult || 'Project delivered on time with high client satisfaction.',
      heroImage: projectHeroImage || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?q=80&w=1200&auto=format&fit=crop',
      measurableResult: projectMeasurableResult || undefined,
    };

    setProjectError('');
    const saved = await saveProject(newProject);
    if (saved) {
      setProjectSuccess(true);
      setProjectTitle('');
      setClientName('');
      setProjectShortDescription('');
      setProjectChallenge('');
      setProjectWhatWeDid('');
      setProjectFinalResult('');
      setProjectMeasurableResult('');
      setProjectHeroImage('');
      setTimeout(() => setProjectSuccess(false), 5000);
    } else {
      setProjectError('Failed to publish project. Please check your connection and try again.');
      setTimeout(() => setProjectError(''), 5000);
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

  // Delete an article — Main Admin can delete any; partners can only delete their own
  const handleDeleteArticle = async (slug: string) => {
    const isMainAdmin = authenticatedEmail?.toLowerCase() === MAIN_ADMIN_EMAIL.toLowerCase();
    if (!isMainAdmin) {
      // Find the article and verify ownership
      const article = publishedArticles.find(a => a.slug === slug);
      if (!article || article.submittedBy?.toLowerCase() !== authenticatedEmail?.toLowerCase()) {
        alert('You can only delete articles that you submitted.');
        return;
      }
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
    setTeamForm({ id: '', name: '', role: '', bio: '', college: '', avatar: '', linkedin: '', twitter: '', customLinkName: '', customLinkUrl: '', order: teamMembers.length, visible: true });
    setEditingTeamId(null);
  };

  const handleEditTeamMember = (m: TeamMember) => {
    setEditingTeamId(m.id);
    setTeamForm({
      id: m.id, name: m.name, role: m.role, bio: m.bio,
      college: m.college, avatar: m.avatar || '',
      linkedin: m.linkedin || '', twitter: m.twitter || '',
      customLinkName: m.customLinkName || '', customLinkUrl: m.customLinkUrl || '',
      order: m.order, visible: m.visible,
    });
    setActiveTab('team');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSaveTeamMember = async (e: React.FormEvent) => {
    e.preventDefault();
    setTeamError('');
    setTeamSuccess('');

    if (!teamForm.name.trim() || !teamForm.role.trim()) {
      setTeamError('Please enter both Full Name and Role.');
      return;
    }

    setIsSavingTeam(true);
    try {
      const id = editingTeamId || teamForm.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
      const member: TeamMember = {
        id: id || `member-${Date.now()}`,
        name: teamForm.name.trim(),
        role: teamForm.role.trim(),
        bio: teamForm.bio.trim(),
        college: teamForm.college.trim(),
        avatar: teamForm.avatar.trim(),
        linkedin: teamForm.linkedin.trim(),
        twitter: teamForm.twitter.trim(),
        customLinkName: teamForm.customLinkName.trim(),
        customLinkUrl: teamForm.customLinkUrl.trim(),
        order: Number(teamForm.order) || 0,
        visible: teamForm.visible,
      };

      await saveTeamMember(member);

      // Fetch fresh list and put newly updated/added member at the top (first position)
      const freshList = getAllTeamMembersForAdmin();
      const updatedMember = freshList.find(m => m.id === member.id);
      const otherMembers = freshList.filter(m => m.id !== member.id);
      const reordered = updatedMember ? [updatedMember, ...otherMembers] : freshList;

      setTeamMembers(reordered);
      setTeamSuccess(editingTeamId ? `✅ ${member.name} updated and moved to top of profile list!` : `✅ ${member.name} added to team!`);
      setTimeout(() => setTeamSuccess(''), 5000);
      resetTeamForm();

      // Scroll to members list below smoothly
      const listEl = document.getElementById('team-members-list');
      if (listEl) {
        listEl.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    } catch (err) {
      console.error('Save team error:', err);
      setTeamError('Failed to save team member. Please try again.');
    } finally {
      setIsSavingTeam(false);
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
     CREATIVE LOGIN SCREEN — Blue, Orange & White FLYO Palette
  ═══════════════════════════════════════════ */
  if (!authenticatedEmail) {
    return (
      <div className="fixed inset-0 z-[100] h-[100dvh] w-full overflow-hidden bg-[#060c1d] flex flex-col lg:flex-row">
        
        {/* Custom CSS Animation Keyframes */}
        <style jsx global>{`
          @keyframes flyoBirdFloat {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            50% {
              transform: translateY(-14px) rotate(1.5deg);
            }
          }
          @keyframes flyoPulseRing {
            0%, 100% {
              transform: scale(0.95);
              opacity: 0.35;
            }
            50% {
              transform: scale(1.15);
              opacity: 0.85;
            }
          }
          @keyframes flyoContinuousFadeOut {
            0% {
              transform: scale(1);
              opacity: 1;
            }
            50% {
              transform: scale(1.6);
              opacity: 0.95;
            }
            85% {
              transform: scale(2.8);
              opacity: 0.4;
            }
            100% {
              transform: scale(3.8);
              opacity: 0;
            }
          }
          .animate-flyo-bird {
            animation: flyoBirdFloat 4.5s ease-in-out infinite;
          }
          .animate-flyo-ring {
            animation: flyoPulseRing 6s ease-in-out infinite;
          }
          .animate-flyo-continuous-zoom-fade {
            animation: flyoContinuousFadeOut 0.75s cubic-bezier(0.25, 1, 0.5, 1) forwards;
          }
        `}</style>

        {/* ── CINEMATIC CONTINUOUS CENTER EXPANSION & FADE-OUT ON LOGIN ── */}
        {isLoggingIn && (
          <div className="fixed inset-0 z-[200] bg-[#060c1d] flex flex-col items-center justify-center p-6 text-center select-none overflow-hidden animate-fadeIn transition-opacity duration-300">
            {/* Massive Ambient Background Light Filling the Entire Viewport */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] rounded-full bg-gradient-to-tr from-blue-600/40 via-white/20 to-orange-500/40 blur-[180px] animate-pulse" />
              <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-blue-600/25 via-[#060c1d]/80 to-[#060c1d]" />
            </div>

            {/* Single Continuous Smooth Logo Expansion & Fade-Out */}
            <div className="relative z-10 flex flex-col items-center justify-center space-y-6 animate-flyo-continuous-zoom-fade pointer-events-none">
              {/* Luminous Pulsing Shockwave Rings */}
              <div className="relative flex items-center justify-center">
                <div className="absolute w-[380px] h-[380px] rounded-full bg-gradient-to-tr from-blue-500/50 via-white/30 to-orange-500/50 blur-3xl animate-flyo-ring" />
                <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-blue-400/50 animate-spin" style={{ animationDuration: '6s' }} />
                <div className="absolute w-[250px] h-[250px] rounded-full border-2 border-dashed border-orange-400/60 animate-spin" style={{ animationDuration: '4s', animationDirection: 'reverse' }} />

                {/* Center Bird Card in Pure White Frame with Vibrant Gradient */}
                <div className="w-48 h-48 md:w-56 md:h-56 rounded-3xl p-1.5 bg-gradient-to-b from-blue-500 via-white to-orange-500 shadow-2xl shadow-blue-950/90">
                  <div className="w-full h-full rounded-[22px] bg-white flex items-center justify-center p-4 shadow-inner">
                    <img
                      src="/kingfisher-logo.jpg"
                      alt="FLYO Kingfisher"
                      className="w-full h-full object-contain filter drop-shadow-[0_15px_30px_rgba(29,78,216,0.45)]"
                    />
                  </div>
                </div>
              </div>

              {/* Status Indicator */}
              <div className="space-y-2.5">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0c183a]/90 border border-blue-400/50 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-orange-400 animate-pulse" />
                  <span className="text-xs font-bold text-white uppercase tracking-widest">
                    Unlocking Workspace...
                  </span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                  Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-orange-400">FLYO</span>
                </h3>
              </div>
            </div>
          </div>
        )}

        {/* ── LEFT SCREEN: Blue, Orange & White Branding Visual ── */}
        <div className="hidden lg:flex lg:flex-1 relative overflow-hidden bg-gradient-to-br from-[#08122c] via-[#0b193d] to-[#050b1a] flex-col justify-between p-12 select-none border-r border-blue-900/40">
          
          {/* Ambient Blue & Orange Light Orbs */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            <div className="absolute -top-24 -left-24 w-[550px] h-[550px] rounded-full bg-blue-600/20 blur-[130px] animate-flyo-ring" />
            <div className="absolute top-1/2 left-1/3 -translate-x-1/2 -translate-y-1/2 w-[400px] h-[400px] rounded-full bg-blue-500/15 blur-[120px] animate-pulse" />
            <div className="absolute bottom-0 right-0 w-[500px] h-[500px] rounded-full bg-orange-500/15 blur-[130px] animate-flyo-ring" style={{ animationDelay: '2s' }} />
            {/* Fine White Grid */}
            <div
              className="absolute inset-0 opacity-[0.06]"
              style={{
                backgroundImage: 'linear-gradient(rgba(255,255,255,0.2) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.2) 1px, transparent 1px)',
                backgroundSize: '48px 48px',
              }}
            />
          </div>

          {/* Top Branding Pill */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0c183a]/90 border border-blue-500/30 backdrop-blur-xl shadow-lg shadow-blue-950/50">
              <div className="w-7 h-7 rounded-xl overflow-hidden bg-white p-0.5 border border-blue-400 shadow-sm flex items-center justify-center">
                <img src="/kingfisher-logo.jpg" alt="FLYO" className="w-full h-full object-cover" />
              </div>
              <span className="text-white font-black text-sm tracking-wider uppercase">FLYO</span>
              <span className="text-[10px] text-orange-400 font-extrabold px-1.5 py-0.5 rounded border border-orange-500/50 bg-orange-950/60">STUDIO</span>
            </div>

            <div className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-[11px] font-bold tracking-wide">Workspace Ready</span>
            </div>
          </div>

          {/* Central Hero: Animated Kingfisher with Blue/Orange Rings */}
          <div className="relative z-10 flex flex-col items-center justify-center my-auto text-center px-4">
            
            {/* Kingfisher Container with Floating Animation */}
            <div className="relative mb-6 flex items-center justify-center">
              {/* Outer Luminous Blue & Orange Rings */}
              <div className="absolute w-64 h-64 rounded-full bg-gradient-to-tr from-blue-500/30 via-white/10 to-orange-500/30 blur-2xl animate-flyo-ring" />
              <div className="absolute w-52 h-52 rounded-full border border-blue-400/30 animate-spin" style={{ animationDuration: '30s' }} />
              <div className="absolute w-44 h-44 rounded-full border border-dashed border-orange-400/35 animate-spin" style={{ animationDuration: '20s', animationDirection: 'reverse' }} />

              {/* Floating Bird Artwork Card in Pure White Frame with Blue-Orange Border */}
              <div className="animate-flyo-bird relative z-10 w-44 h-44 rounded-3xl p-1 bg-gradient-to-b from-blue-500 via-white to-orange-500 shadow-2xl shadow-blue-950/70 backdrop-blur-md group">
                <div className="w-full h-full rounded-[22px] overflow-hidden bg-white flex items-center justify-center p-3 relative shadow-inner">
                  <img
                    src="/kingfisher-logo.jpg"
                    alt="FLYO Kingfisher"
                    className="w-full h-full object-contain filter drop-shadow-[0_10px_20px_rgba(29,78,216,0.35)] transform transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </div>
            </div>

            {/* Headline & Description */}
            <div className="space-y-3 max-w-lg">
              <h1 className="text-4xl xl:text-5xl font-black text-white tracking-tight leading-[1.15]">
                Grow your business with{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-white to-orange-400">
                  FLYO
                </span>.
              </h1>
              <p className="text-sm text-blue-100/80 leading-relaxed max-w-md mx-auto">
                Next-generation digital craft powering high-converting websites, 10x Google SEO rankings & modern brand authority.
              </p>
            </div>

            {/* Blue, Orange & White Feature Tags */}
            <div className="flex flex-wrap items-center justify-center gap-2.5 mt-7">
              {[
                { icon: '🚀', text: 'Lightning Fast Sites', color: 'border-blue-400/40 text-blue-200 bg-blue-950/60' },
                { icon: '📈', text: 'Top Google SEO', color: 'border-orange-400/40 text-orange-200 bg-orange-950/60' },
                { icon: '✍️', text: 'Live Article Portal', color: 'border-white/30 text-white bg-white/10' },
              ].map((pill) => (
                <div
                  key={pill.text}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full border text-xs font-semibold backdrop-blur-md shadow-sm ${pill.color}`}
                >
                  <span className="text-sm">{pill.icon}</span>
                  <span>{pill.text}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom Micro Footer */}
          <div className="relative z-10 flex items-center justify-between text-xs text-blue-200/60 pt-4 border-t border-blue-900/40">
            <span className="tracking-wide font-medium">© {new Date().getFullYear()} FLYO Digital Growth Studio</span>
            <span className="text-orange-400 font-mono text-[11px]">v2.4 Partner Build</span>
          </div>
        </div>

        {/* ── RIGHT SCREEN: Blue, Orange & White Login Box ── */}
        <div className="flex-1 lg:max-w-[500px] xl:max-w-[540px] flex flex-col justify-between p-6 sm:p-10 bg-[#070e24] relative overflow-hidden">
          
          {/* Subtle Ambient Blue & Orange Light */}
          <div className="absolute top-0 right-0 w-80 h-80 bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-orange-500/15 rounded-full blur-[100px] pointer-events-none" />

          {/* Top Bar for Mobile Branding */}
          <div className="lg:hidden flex items-center justify-between mb-4">
            <div className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#0c183a] border border-blue-500/30 shadow-md">
              <div className="w-7 h-7 rounded-xl overflow-hidden bg-white p-0.5 border border-blue-400 shadow-sm flex items-center justify-center">
                <img src="/kingfisher-logo.jpg" alt="FLYO" className="w-full h-full object-cover" />
              </div>
              <span className="text-white font-black text-sm tracking-wider uppercase">FLYO</span>
              <span className="text-[10px] text-orange-400 font-extrabold px-1.5 py-0.5 rounded border border-orange-500/50 bg-orange-950/60">STUDIO</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span className="text-emerald-400 text-[10px] font-bold">Admin Portal</span>
            </div>
          </div>

          <div className="hidden lg:block" />

          {/* ── CREATIVE LOGIN CARD BOX ── */}
          <div className="my-auto w-full max-w-[420px] mx-auto">
            <div className="relative rounded-3xl p-[1px] bg-gradient-to-b from-blue-500/50 via-white/20 to-orange-500/50 shadow-2xl shadow-blue-950/80">
              
              {/* Card Interior */}
              <div className="bg-[#0b1636]/95 backdrop-blur-2xl rounded-[23px] p-7 sm:p-8 space-y-6 border border-blue-400/20">
                
                {/* Card Header with Exact Amber/Orange Lock Pill Badge */}
                <div className="space-y-1.5 text-center sm:text-left">
                  <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#fff7ed] border border-[#fed7aa] text-[#c2410c] shadow-sm mb-2">
                    <Lock className="w-3.5 h-3.5 text-[#ea580c] stroke-[2.2]" />
                    <span className="text-xs font-semibold tracking-tight">Partner Workspace</span>
                  </div>
                  <h2 className="text-2xl font-black text-white tracking-tight">Sign In</h2>
                  <p className="text-xs text-blue-200/70">Enter your authorized partner credentials</p>
                </div>

                {/* Form */}
                <form onSubmit={handleLogin} className="space-y-4">
                  
                  {/* Email Field */}
                  <div className="space-y-1.5">
                    <label htmlFor="adminEmail" className="block text-[11px] font-bold text-blue-200 uppercase tracking-wider">
                      Partner Email
                    </label>
                    <div className="relative group">
                      <Mail className="w-4 h-4 text-blue-300/60 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-orange-400 transition-colors pointer-events-none" />
                      <input
                        id="adminEmail"
                        type="email"
                        required
                        value={emailInput}
                        onChange={(e) => setEmailInput(e.target.value)}
                        placeholder="admin@flyodigital.com"
                        className="w-full bg-[#060e22] border border-blue-900/60 focus:border-orange-400 rounded-xl pl-10 pr-4 py-3 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-all"
                      />
                    </div>
                  </div>

                  {/* Password Field */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between">
                      <label htmlFor="adminPassword" className="block text-[11px] font-bold text-blue-200 uppercase tracking-wider">
                        Password
                      </label>
                      <span className="text-[10px] text-orange-400 font-semibold flex items-center gap-1">
                        Default: <code className="bg-orange-950/80 border border-orange-500/40 text-orange-300 px-1.5 py-0.5 rounded font-mono text-[10px]">user</code>
                      </span>
                    </div>
                    <div className="relative group">
                      <Lock className="w-4 h-4 text-blue-300/60 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within:text-orange-400 transition-colors pointer-events-none" />
                      <input
                        id="adminPassword"
                        type={showPassword ? 'text' : 'password'}
                        required
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        placeholder="Enter password"
                        className="w-full bg-[#060e22] border border-blue-900/60 focus:border-orange-400 rounded-xl pl-10 pr-10 py-3 text-sm text-white placeholder:text-blue-300/30 focus:outline-none focus:ring-2 focus:ring-orange-400/20 transition-all"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-blue-300/60 hover:text-white transition-colors"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  {/* Error Notification */}
                  {authError && (
                    <div className="flex items-start gap-2.5 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-300 text-xs">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-red-400" />
                      <span>{authError}</span>
                    </div>
                  )}

                  {/* Submit Button in Radiant Blue-to-Orange Gradient */}
                  <button
                    type="submit"
                    disabled={isLoggingIn}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-blue-600 via-indigo-600 to-orange-500 hover:from-blue-500 hover:to-orange-400 disabled:opacity-60 disabled:cursor-not-allowed text-white font-extrabold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-orange-500/20 active:scale-[0.98]"
                  >
                    {isLoggingIn ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        <span>Verifying...</span>
                      </>
                    ) : (
                      <>
                        <KeyRound className="w-4 h-4" />
                        <span>Unlock Workspace</span>
                        <ArrowRight className="w-4 h-4 ml-1" />
                      </>
                    )}
                  </button>
                </form>

                {/* Divider & Back Link */}
                <div className="pt-2 border-t border-blue-900/50 text-center space-y-3">
                  <p className="text-[11px] text-blue-200/60">
                    Restricted to authorized FLYO partners.
                  </p>
                  <Link
                    href="/"
                    className="inline-flex items-center gap-1.5 text-xs text-white/80 hover:text-orange-400 font-semibold transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5" />
                    <span>Back to FLYO Website</span>
                  </Link>
                </div>
              </div>
            </div>

            {/* Bottom Security Pill */}
            <div className="flex items-center justify-center gap-2 mt-4">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[10px] text-blue-200/60 font-medium uppercase tracking-widest">
                256-Bit Encrypted Session
              </span>
            </div>
          </div>

          <div className="text-center text-[11px] text-blue-200/40 lg:block hidden">
            <span>FLYO Digital Partner System</span>
          </div>
        </div>
      </div>
    );
  }

  /* ═══════════════════════════════════════════
     ADMIN DASHBOARD
  ═══════════════════════════════════════════ */
  const displayedArticles = isCurrentPrimaryAdmin
    ? publishedArticles
    : publishedArticles.filter(a => a.submittedBy?.toLowerCase() === authenticatedEmail?.toLowerCase());

  const tabs = [
    { id: 'articles', label: 'Write Article', icon: <PenTool className="w-4 h-4" />, count: null, adminOnly: false },
    { id: 'projects', label: 'Add Real Project', icon: <Upload className="w-4 h-4" />, count: null, adminOnly: false },
    { id: 'manage', label: isCurrentPrimaryAdmin ? 'Manage Articles' : 'My Articles', icon: <BookOpen className="w-4 h-4" />, count: displayedArticles.length, adminOnly: false },
    { id: 'emails', label: 'Partner Access', icon: <Users className="w-4 h-4" />, count: allowedEmails.length, adminOnly: true },
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

            {/* Right: User info & actions */}
            <div className="flex items-center gap-2 sm:gap-3">
              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/20">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="text-emerald-300 text-xs font-semibold truncate max-w-[200px]">{authenticatedEmail}</span>
              </div>

              <button
                onClick={() => {
                  setPasswordChangeError('');
                  setPasswordChangeSuccess('');
                  setIsPasswordModalOpen(true);
                }}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-950/80 hover:bg-indigo-900 border border-indigo-500/30 text-indigo-300 hover:text-white text-xs font-semibold transition-all"
                title="Change your workspace password"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Change Password</span>
                <span className="sm:hidden">Password</span>
              </button>
              
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

            {/* Error banner */}
            {publishError && (
              <div className="p-4 rounded-2xl bg-red-50 border border-red-200 text-red-800 text-sm flex items-center gap-3 animate-fade-in">
                <AlertCircle className="w-5 h-5 text-red-500 shrink-0" />
                <div>
                  <span className="font-bold">{publishError}</span>
                </div>
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
                      <h2 className="text-sm font-bold text-slate-700 uppercase tracking-wider">Article Content</h2>
                      
                      <div>
                        <label className={labelClass}>Article Body *</label>
                        <RichTextEditor
                          id="contentHtml"
                          value={contentHtml}
                          onChange={setContentHtml}
                          placeholder="Write your article content here. Use the toolbar above to add headings, bold text, lists, links, and more..."
                          minHeight={320}
                        />
                        <p className="mt-1.5 text-[11px] text-slate-500">
                          ✨ Use the toolbar to format your article — headings, bold, lists, links & more. Content is saved exactly as you see it.
                        </p>
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
                            type="text"
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

            {/* ═══ TAB: ADD REAL PROJECT ═══ */}
            {activeTab === 'projects' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">Add Real Project</h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                      Publish a real client project to the FLYO portfolio with photos and impact details
                    </p>
                  </div>
                </div>

                {projectSuccess && (
                  <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-in fade-in">
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                    <div>
                      <span className="font-bold">Real Project published successfully!</span> It is now live in your portfolio (/work).
                    </div>
                    <Link href="/work" target="_blank" className="ml-auto text-xs font-bold text-emerald-700 hover:underline shrink-0">View Portfolio →</Link>
                  </div>
                )}

                {projectError && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3 animate-in fade-in">
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0" />
                    <span>{projectError}</span>
                  </div>
                )}

                <form onSubmit={handlePublishProject} className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm space-y-6 p-6 sm:p-8">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="projectTitle" className={labelClass}>Project Title *</label>
                      <input
                        id="projectTitle"
                        type="text"
                        required
                        value={projectTitle}
                        onChange={(e) => setProjectTitle(e.target.value)}
                        placeholder="e.g. Verde Bistro Mobile Website"
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="clientName" className={labelClass}>Client / Business Name *</label>
                      <input
                        id="clientName"
                        type="text"
                        required
                        value={clientName}
                        onChange={(e) => setClientName(e.target.value)}
                        placeholder="e.g. Verde Bistro & Bakery"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="projectCategory" className={labelClass}>Category *</label>
                      <select
                        id="projectCategory"
                        value={projectCategory}
                        onChange={(e) => setProjectCategory(e.target.value as any)}
                        className={inputClass}
                      >
                        <option value="Websites">Websites</option>
                        <option value="Social Media">Social Media</option>
                        <option value="Posters">Posters</option>
                        <option value="Thumbnails">Thumbnails</option>
                        <option value="Branding">Branding</option>
                        <option value="Marketing">Marketing</option>
                      </select>
                    </div>
                    <div>
                      <label htmlFor="projectService" className={labelClass}>Service Delivered *</label>
                      <input
                        id="projectService"
                        type="text"
                        required
                        value={projectService}
                        onChange={(e) => setProjectService(e.target.value)}
                        placeholder="e.g. Web Development / Poster Design"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="projectShortDescription" className={labelClass}>Short Description / Summary *</label>
                    <textarea
                      id="projectShortDescription"
                      rows={2}
                      required
                      value={projectShortDescription}
                      onChange={(e) => setProjectShortDescription(e.target.value)}
                      placeholder="Brief overview of what was accomplished for the client..."
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="projectChallenge" className={labelClass}>The Challenge / Problem Solved</label>
                    <textarea
                      id="projectChallenge"
                      rows={2}
                      value={projectChallenge}
                      onChange={(e) => setProjectChallenge(e.target.value)}
                      placeholder="What issue or difficulty was the client facing before this project?"
                      className={inputClass}
                    />
                  </div>

                  <div>
                    <label htmlFor="projectWhatWeDid" className={labelClass}>What We Did (One step per line)</label>
                    <textarea
                      id="projectWhatWeDid"
                      rows={4}
                      value={projectWhatWeDid}
                      onChange={(e) => setProjectWhatWeDid(e.target.value)}
                      placeholder="Built fast Next.js responsive website with mobile menu\nAdded click-to-call & Google Maps direction buttons\nOptimized page load speed under 1 second"
                      className={inputClass}
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="projectFinalResult" className={labelClass}>Final Result & Impact</label>
                      <input
                        id="projectFinalResult"
                        type="text"
                        value={projectFinalResult}
                        onChange={(e) => setProjectFinalResult(e.target.value)}
                        placeholder="e.g. 40% more online inquiries and faster customer orders."
                        className={inputClass}
                      />
                    </div>
                    <div>
                      <label htmlFor="projectMeasurableResult" className={labelClass}>Measurable Outcome Metric</label>
                      <input
                        id="projectMeasurableResult"
                        type="text"
                        value={projectMeasurableResult}
                        onChange={(e) => setProjectMeasurableResult(e.target.value)}
                        placeholder="e.g. Sub-1s Mobile Menu Load Time"
                        className={inputClass}
                      />
                    </div>
                  </div>

                  {/* Photo Uploading Section */}
                  <div className="space-y-3 pt-4 border-t border-slate-100">
                    <label htmlFor="projectHeroImage" className={labelClass}>Project Photo (Photo Uploading) *</label>
                    
                    <div className="relative">
                      <input
                        type="file"
                        accept="image/*"
                        id="projectPhotoUpload"
                        className="hidden"
                        onChange={async (e) => {
                          const file = e.target.files?.[0];
                          if (!file) return;
                          setIsUploadingProjectImage(true);
                          try {
                            const url = await uploadImageToCloudinary(file);
                            setProjectHeroImage(url);
                          } catch (err) {
                            alert('Photo upload failed. Please try again.');
                          } finally {
                            setIsUploadingProjectImage(false);
                          }
                        }}
                      />
                      <label
                        htmlFor="projectPhotoUpload"
                        className="w-full py-3.5 px-4 rounded-xl border border-dashed border-indigo-300 bg-indigo-50/50 hover:bg-indigo-100/50 text-indigo-700 font-bold text-xs flex items-center justify-center gap-2 cursor-pointer transition-all mb-2 shadow-sm"
                      >
                        <ImageIcon className="w-4 h-4 text-indigo-600" />
                        <span>{isUploadingProjectImage ? 'Uploading Project Photo...' : '📷 Upload Real Project Photo from Device'}</span>
                      </label>
                    </div>

                    <input
                      id="projectHeroImage"
                      type="text"
                      value={projectHeroImage}
                      onChange={(e) => setProjectHeroImage(e.target.value)}
                      placeholder="Or paste photo URL https://..."
                      className={inputClass}
                    />

                    {projectHeroImage && (
                      <div className="mt-3 rounded-2xl overflow-hidden h-48 bg-slate-900 border border-slate-200 relative shadow-inner">
                        <img src={projectHeroImage} alt="Project Preview" className="w-full h-full object-cover" />
                        <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-black/70 backdrop-blur-md text-white text-[10px] font-bold">
                          Live Photo Preview
                        </span>
                      </div>
                    )}
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Publish Real Project to Portfolio</span>
                  </button>
                </form>
              </div>
            )}

            {/* ═══ TAB: MANAGE ARTICLES ═══ */}
            {activeTab === 'manage' && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-extrabold text-slate-900">
                      {isCurrentPrimaryAdmin ? 'Manage All Articles' : 'My Submitted Articles'}
                    </h1>
                    <p className="text-sm text-slate-500 mt-0.5">
                      {isCurrentPrimaryAdmin
                        ? `${publishedArticles.length} article${publishedArticles.length !== 1 ? 's' : ''} total (${publishedArticles.filter(a => a.status === 'pending').length} pending approval)`
                        : `${displayedArticles.length} article${displayedArticles.length !== 1 ? 's' : ''} submitted by you (${displayedArticles.filter(a => a.status === 'pending').length} awaiting Primary Admin approval)`}
                    </p>
                  </div>
                  {isCurrentPrimaryAdmin ? (
                    <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-bold flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-amber-600" />
                      Super Admin (Approval Rights)
                    </span>
                  ) : (
                    <span className="px-3 py-1 rounded-full bg-indigo-50 border border-indigo-200 text-indigo-700 text-xs font-bold flex items-center gap-1.5">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      Partner Submissions
                    </span>
                  )}
                </div>

                {displayedArticles.length === 0 ? (
                  <div className="bg-white border border-slate-200 rounded-2xl p-12 text-center space-y-3">
                    <FileText className="w-12 h-12 text-slate-300 mx-auto" />
                    <h3 className="text-base font-bold text-slate-700">
                      {isCurrentPrimaryAdmin ? 'No articles yet' : 'No articles submitted yet'}
                    </h3>
                    <p className="text-sm text-slate-500">
                      {isCurrentPrimaryAdmin ? 'Start by writing your first article above.' : 'Write and submit your first article. It will be sent to the Primary Admin for approval.'}
                    </p>
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
                    {displayedArticles.map((article, idx) => {
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

                            {/* Edit button — own articles or main admin */}
                            {(isMainAdmin || article.submittedBy?.toLowerCase() === authenticatedEmail?.toLowerCase()) && (
                              <button
                                onClick={() => handleEditArticle(article)}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-amber-100 text-slate-400 hover:text-amber-600 transition-colors"
                                title="Edit article"
                              >
                                <Edit2 className="w-4 h-4" />
                              </button>
                            )}

                            {/* Delete button — own articles or main admin */}
                            {(isMainAdmin || article.submittedBy?.toLowerCase() === authenticatedEmail?.toLowerCase()) && (
                              <button
                                onClick={() => handleDeleteArticle(article.slug)}
                                className="p-2 rounded-lg bg-slate-100 hover:bg-red-100 text-slate-400 hover:text-red-500 transition-colors"
                                title={isMainAdmin ? 'Delete article' : 'Delete your article'}
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

            {/* ═══ TAB: EMAIL ACCESS MANAGEMENT (Primary Admin Only) ═══ */}
            {activeTab === 'emails' && isCurrentPrimaryAdmin && (
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
                  <span className="px-3 py-1 rounded-full bg-amber-100 border border-amber-300 text-amber-800 text-xs font-extrabold flex items-center gap-1.5 shadow-sm">
                    👑 Primary Admin (Owner) — You have full permission to add/remove members
                  </span>
                </div>

                {/* Grant access form (Primary Admin only) */}
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

                {/* Email list */}
                <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                  <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
                    <h2 className="text-sm font-bold text-slate-700">Authorized Partners ({allowedEmails.length})</h2>
                    <span className="text-[11px] text-slate-400 font-medium">All have admin access</span>
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
                              {!isPrimaryAdmin && (
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

                {/* Error banner */}
                {teamError && (
                  <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-800 text-sm flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                    <span>{teamError}</span>
                  </div>
                )}

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
                            type="text" value={teamForm.avatar}
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
                        type="text" value={teamForm.linkedin}
                        onChange={e => setTeamForm(f => ({ ...f, linkedin: e.target.value }))}
                        placeholder="https://linkedin.com/in/..."
                        className={inputClass}
                      />
                    </div>

                    {/* Twitter */}
                    <div>
                      <label className={labelClass}>Twitter / X URL</label>
                      <input
                        type="text" value={teamForm.twitter}
                        onChange={e => setTeamForm(f => ({ ...f, twitter: e.target.value }))}
                        placeholder="https://x.com/..."
                        className={inputClass}
                      />
                    </div>

                    {/* Custom Link Title */}
                    <div>
                      <label className={labelClass}>Custom Link Title / Name</label>
                      <input
                        type="text" value={teamForm.customLinkName}
                        onChange={e => setTeamForm(f => ({ ...f, customLinkName: e.target.value }))}
                        placeholder="e.g. Portfolio, GitHub, Website"
                        className={inputClass}
                      />
                    </div>

                    {/* Custom Link URL */}
                    <div>
                      <label className={labelClass}>Custom Link URL</label>
                      <input
                        type="text" value={teamForm.customLinkUrl}
                        onChange={e => setTeamForm(f => ({ ...f, customLinkUrl: e.target.value }))}
                        placeholder="https://..."
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
                      disabled={isSavingTeam}
                      className="flex-1 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-bold text-sm transition-all flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20 active:scale-95 cursor-pointer"
                    >
                      {isSavingTeam ? (
                        <>
                          <FlyoLoader size="xs" />
                          <span>Saving Changes...</span>
                        </>
                      ) : editingTeamId ? (
                        <>
                          <Save className="w-4 h-4" />
                          <span>Save Changes</span>
                        </>
                      ) : (
                        <>
                          <Plus className="w-4 h-4" />
                          <span>Add Member</span>
                        </>
                      )}
                    </button>
                  </div>
                </form>

                {/* ── MEMBERS LIST ── */}
                <div id="team-members-list" className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
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

      {/* ── CHANGE PASSWORD MODAL ── */}
      {isPasswordModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-100 animate-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-slate-100 bg-slate-50">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-indigo-600 flex items-center justify-center text-white shadow-md shadow-indigo-600/20">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-extrabold text-slate-900 text-sm">Change Workspace Password</h3>
                  <p className="text-[11px] text-slate-500">{authenticatedEmail}</p>
                </div>
              </div>
              <button
                onClick={() => setIsPasswordModalOpen(false)}
                className="w-8 h-8 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-400 hover:text-slate-700 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body */}
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              <div>
                <label className={labelClass}>Current Password *</label>
                <div className="relative">
                  <input
                    type={showCurrentPass ? 'text' : 'password'}
                    required
                    value={currentPassInput}
                    onChange={(e) => setCurrentPassInput(e.target.value)}
                    placeholder="Enter current password (default: user)"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowCurrentPass(!showCurrentPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showCurrentPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>New Password *</label>
                <div className="relative">
                  <input
                    type={showNewPass ? 'text' : 'password'}
                    required
                    minLength={3}
                    value={newPassInput}
                    onChange={(e) => setNewPassInput(e.target.value)}
                    placeholder="Enter new password"
                    className={inputClass}
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPass(!showNewPass)}
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    {showNewPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className={labelClass}>Confirm New Password *</label>
                <input
                  type="password"
                  required
                  value={confirmPassInput}
                  onChange={(e) => setConfirmPassInput(e.target.value)}
                  placeholder="Re-type new password"
                  className={inputClass}
                />
              </div>

              {/* Status alerts */}
              {passwordChangeError && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
                  <span>{passwordChangeError}</span>
                </div>
              )}

              {passwordChangeSuccess && (
                <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                  <span>{passwordChangeSuccess}</span>
                </div>
              )}

              <div className="pt-2 flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => setIsPasswordModalOpen(false)}
                  className="flex-1 py-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSavingPassword}
                  className="flex-1 py-3 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
                >
                  {isSavingPassword ? (
                    <>
                      <FlyoLoader size="xs" />
                      <span>Updating...</span>
                    </>
                  ) : (
                    <>
                      <Save className="w-3.5 h-3.5" />
                      <span>Save Password</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

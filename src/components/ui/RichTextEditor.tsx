'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  Bold, Italic, Underline, Strikethrough, Highlighter, Palette,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Indent, Outdent, Quote, Code2,
  Link2, Unlink, ExternalLink, Image as ImageIcon,
  Undo2, Redo2,
  ChevronDown, Type, Mail, X, Check,
  Sparkles, Minus, RemoveFormatting, Eye, Edit3
} from 'lucide-react';
import { convertTextToStructuredHtml } from '@/lib/utils/formatContent';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  id?: string;
  articleTitle?: string;
}

const HEADING_OPTIONS = [
  { label: 'Normal Text', tag: 'p', icon: '¶' },
  { label: 'Heading 1 (Main Title)', tag: 'h1', icon: 'H1' },
  { label: 'Heading 2 (Sub-heading)', tag: 'h2', icon: 'H2' },
  { label: 'Heading 3 (Section Title)', tag: 'h3', icon: 'H3' },
];

const FONT_SIZES = [
  { label: 'Small', value: '13px', cmdSize: '2' },
  { label: 'Normal', value: '15px', cmdSize: '3' },
  { label: 'Medium', value: '18px', cmdSize: '4' },
  { label: 'Large', value: '22px', cmdSize: '5' },
  { label: 'Huge', value: '28px', cmdSize: '6' },
];

const FONT_FAMILIES = [
  { label: 'Default (Sans-serif)', value: 'ui-sans-serif, system-ui, sans-serif' },
  { label: 'Editorial (Serif)', value: 'Georgia, Cambria, "Times New Roman", Times, serif' },
  { label: 'Monospace (Code)', value: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace' },
];

const TEXT_COLORS = [
  { name: 'Default Dark', color: '#0f172a' },
  { name: 'Slate Gray', color: '#64748b' },
  { name: 'Indigo Accent', color: '#4f46e5' },
  { name: 'Electric Blue', color: '#2563eb' },
  { name: 'Emerald Green', color: '#059669' },
  { name: 'Amber Orange', color: '#d97706' },
  { name: 'Crimson Red', color: '#dc2626' },
  { name: 'Purple Violet', color: '#7c3aed' },
];

const HIGHLIGHT_COLORS = [
  { name: 'None (Transparent)', color: 'transparent' },
  { name: 'Solar Yellow', color: '#fef08a' },
  { name: 'Mint Green', color: '#bbf7d0' },
  { name: 'Sky Cyan', color: '#bae6fd' },
  { name: 'Peach Orange', color: '#fed7aa' },
  { name: 'Rose Pink', color: '#fbcfe8' },
  { name: 'Lavender Purple', color: '#e9d5ff' },
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Type your article content here... (Email-style rich text formatting supported)',
  minHeight = 340,
  id,
  articleTitle = '',
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Dropdown states
  const [isHeadingOpen, setIsHeadingOpen] = useState(false);
  const [currentHeading, setCurrentHeading] = useState('Normal Text');
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState('Normal');
  const [isFontFamilyOpen, setIsFontFamilyOpen] = useState(false);
  const [currentFontFamily, setCurrentFontFamily] = useState('Sans-serif');
  const [isTextColorOpen, setIsTextColorOpen] = useState(false);
  const [isHighlightOpen, setIsHighlightOpen] = useState(false);
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  // Link Dialog Modal state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkUrlInput, setLinkUrlInput] = useState('');
  const [linkTextInput, setLinkTextInput] = useState('');
  const [isEmailType, setIsEmailType] = useState(false);
  const savedSelectionRange = useRef<Range | null>(null);

  // Floating Link Inspection Bar
  const [hoveredLink, setHoveredLink] = useState<{ url: string; element: HTMLAnchorElement } | null>(null);

  // Image Modal state
  const [showImageModal, setShowImageModal] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState('');
  const [imageAltInput, setImageAltInput] = useState('');

  // Stats
  const [wordCount, setWordCount] = useState(0);
  const [charCount, setCharCount] = useState(0);

  const isInternalChange = useRef(false);

  // Set initial content
  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value;
      computeStats(editorRef.current.innerText || '');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value updates
  useEffect(() => {
    if (!editorRef.current) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
      computeStats(editorRef.current.innerText || '');
    }
  }, [value]);

  const computeStats = (text: string) => {
    const trimmed = text.trim();
    setCharCount(trimmed.length);
    setWordCount(trimmed ? trimmed.split(/\s+/).filter(Boolean).length : 0);
  };

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    isInternalChange.current = true;
    const html = editorRef.current.innerHTML;
    onChange(html);
    computeStats(editorRef.current.innerText || '');
  }, [onChange]);

  // Update active toolbar states based on cursor selection
  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    try {
      if (document.queryCommandState('bold')) formats.add('bold');
      if (document.queryCommandState('italic')) formats.add('italic');
      if (document.queryCommandState('underline')) formats.add('underline');
      if (document.queryCommandState('strikeThrough')) formats.add('strikeThrough');
      if (document.queryCommandState('justifyLeft')) formats.add('justifyLeft');
      if (document.queryCommandState('justifyCenter')) formats.add('justifyCenter');
      if (document.queryCommandState('justifyRight')) formats.add('justifyRight');
      if (document.queryCommandState('justifyFull')) formats.add('justifyFull');
      if (document.queryCommandState('insertUnorderedList')) formats.add('insertUnorderedList');
      if (document.queryCommandState('insertOrderedList')) formats.add('insertOrderedList');

      const block = document.queryCommandValue('formatBlock').toLowerCase();
      if (block === 'h1') setCurrentHeading('Heading 1');
      else if (block === 'h2') setCurrentHeading('Heading 2');
      else if (block === 'h3') setCurrentHeading('Heading 3');
      else setCurrentHeading('Normal Text');

      // Check if cursor is inside an <a> tag
      const sel = window.getSelection();
      if (sel && sel.anchorNode) {
        let parent: Node | null = sel.anchorNode;
        let foundAnchor: HTMLAnchorElement | null = null;
        while (parent && parent !== editorRef.current) {
          if (parent.nodeName === 'A') {
            foundAnchor = parent as HTMLAnchorElement;
            break;
          }
          parent = parent.parentNode;
        }
        if (foundAnchor) {
          formats.add('link');
          setHoveredLink({ url: foundAnchor.getAttribute('href') || '', element: foundAnchor });
        } else {
          setHoveredLink(null);
        }
      }
    } catch (_) {}
    setActiveFormats(formats);
  }, []);

  const exec = useCallback((command: string, value: string | undefined = undefined) => {
    editorRef.current?.focus();
    document.execCommand(command, false, value);
    handleInput();
    updateActiveFormats();
  }, [handleInput, updateActiveFormats]);

  // Save current user selection range before opening modal dialogs
  const saveSelection = () => {
    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      savedSelectionRange.current = sel.getRangeAt(0).cloneRange();
    } else {
      savedSelectionRange.current = null;
    }
  };

  const restoreSelection = () => {
    const sel = window.getSelection();
    if (sel && savedSelectionRange.current) {
      sel.removeAllRanges();
      sel.addRange(savedSelectionRange.current);
    }
  };

  // ── Smart Hyperlink Modal (Email Style) ──
  const openLinkModal = (prefillUrl = '', prefillText = '') => {
    saveSelection();
    const sel = window.getSelection();
    let selectedText = prefillText;

    if (!selectedText && sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      selectedText = sel.toString();
    }

    setLinkTextInput(selectedText);
    setLinkUrlInput(prefillUrl);
    setIsEmailType(prefillUrl.startsWith('mailto:'));
    setShowLinkModal(true);
    setShowImageModal(false);
    setIsHeadingOpen(false);
    setIsFontSizeOpen(false);
    setIsFontFamilyOpen(false);
    setIsTextColorOpen(false);
    setIsHighlightOpen(false);
  };

  const closeLinkModal = () => {
    setShowLinkModal(false);
    setLinkUrlInput('');
    setLinkTextInput('');
    savedSelectionRange.current = null;
  };

  const handleApplyLink = () => {
    if (!linkUrlInput.trim()) return;

    let targetUrl = linkUrlInput.trim();
    const isEmail = isEmailType || (targetUrl.includes('@') && !targetUrl.startsWith('http'));

    if (isEmail) {
      targetUrl = targetUrl.replace(/^mailto:/i, '');
      targetUrl = `mailto:${targetUrl}`;
    } else if (
      !targetUrl.startsWith('http://') &&
      !targetUrl.startsWith('https://') &&
      !targetUrl.startsWith('#') &&
      !targetUrl.startsWith('mailto:')
    ) {
      targetUrl = `https://${targetUrl}`;
    }

    const displayText = (linkTextInput.trim() || linkUrlInput.trim()).replace(/</g, '&lt;').replace(/>/g, '&gt;');

    editorRef.current?.focus();
    restoreSelection();

    // If text was selected or range exists, replace cleanly with hyperlink
    const linkHtml = `<a href="${targetUrl}" ${!isEmail ? 'target="_blank" rel="noopener noreferrer"' : ''} style="color:#2563eb; text-decoration:underline; font-weight:600;">${displayText}</a>&nbsp;`;
    document.execCommand('insertHTML', false, linkHtml);

    handleInput();
    closeLinkModal();
  };

  // Remove hyperlink from current hovered/selected anchor
  const handleRemoveLink = (anchorEl?: HTMLAnchorElement) => {
    const el = anchorEl || hoveredLink?.element;
    if (el && el.parentNode) {
      const textNode = document.createTextNode(el.textContent || '');
      el.parentNode.replaceChild(textNode, el);
      setHoveredLink(null);
      handleInput();
    }
  };

  // Edit current hyperlink
  const handleEditHoveredLink = () => {
    if (hoveredLink) {
      openLinkModal(hoveredLink.url, hoveredLink.element.textContent || '');
    }
  };

  // ── Smart Paste: Detect HTML, Bullet Points, Lists, Headings, Hyperlinks & Symbols ──
  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    const pastedText = e.clipboardData.getData('text/plain');
    const pastedHtml = e.clipboardData.getData('text/html');
    const urlPattern = /^(https?:\/\/[^\s]+|mailto:[^\s]+)$/i;

    const sel = window.getSelection();

    // 1. If a URL is pasted over selected text, turn selection into a hyperlink
    if (
      pastedText?.trim() &&
      urlPattern.test(pastedText.trim()) &&
      sel &&
      !sel.isCollapsed &&
      editorRef.current?.contains(sel.anchorNode)
    ) {
      e.preventDefault();
      const selectedText = sel.toString();
      const linkHtml = `<a href="${pastedText.trim()}" target="_blank" rel="noopener noreferrer" style="color:#2563eb; text-decoration:underline; font-weight:600;">${selectedText}</a>&nbsp;`;
      document.execCommand('insertHTML', false, linkHtml);
      handleInput();
      return;
    }

    // 2. If rich HTML is available from clipboard (from another site, Google Docs, Word)
    if (pastedHtml && /<(?:p|h[1-6]|ul|ol|li|table|blockquote|a|strong|b|em|i)\b/i.test(pastedHtml)) {
      e.preventDefault();
      let cleanHtml = pastedHtml;
      // Extract content from <body> if full HTML doc was pasted
      const bodyMatch = cleanHtml.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
      if (bodyMatch) {
        cleanHtml = bodyMatch[1];
      }
      // Standardize <a> links with our vibrant blue styling
      cleanHtml = cleanHtml.replace(
        /<a\s+([^>]*?)href=(["'])(.*?)\2([^>]*)>(.*?)<\/a>/gi,
        (match, beforeHref, quote, href, afterHref, innerText) => {
          const isEmail = href.startsWith('mailto:') || href.includes('@');
          const finalHref = (isEmail && !href.startsWith('mailto:') && !href.startsWith('http'))
            ? `mailto:${href}`
            : (href.startsWith('www.') ? `https://${href}` : href);
          const target = isEmail ? '' : ' target="_blank" rel="noopener noreferrer"';
          return `<a href="${finalHref}"${target} style="color:#2563eb; text-decoration:underline; font-weight:600;">${innerText}</a>`;
        }
      );
      // Remove noise comments and styles
      cleanHtml = cleanHtml.replace(/<!--[\s\S]*?-->/g, '');
      cleanHtml = cleanHtml.replace(/<style[\s\S]*?<\/style>/gi, '');
      cleanHtml = cleanHtml.replace(/<script[\s\S]*?<\/script>/gi, '');

      document.execCommand('insertHTML', false, cleanHtml);
      handleInput();
      return;
    }

    // 3. If plain text has multiline structure, bullets, lists, headings, or markdown
    if (pastedText && (
      pastedText.includes('\n') ||
      /^[\s]*(?:•|[-*▪▫‣✓✔►–—]|\d+[\.\)])[\s]+/m.test(pastedText) ||
      /^[\s]*#{1,4}[\s]+/m.test(pastedText) ||
      /\[.*?\]\(https?:\/\/.*?\)/.test(pastedText)
    )) {
      e.preventDefault();
      const structured = convertTextToStructuredHtml(pastedText);
      document.execCommand('insertHTML', false, structured);
      handleInput();
      return;
    }
  };

  // ── Keyboard Shortcuts (Ctrl+K for Link, etc.) ──
  const handleKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
      e.preventDefault();
      openLinkModal();
    }
  };

  // ── Image Modal ──
  const openImageModal = () => {
    saveSelection();
    setImageUrlInput('');
    setImageAltInput(articleTitle ? `${articleTitle} illustration` : '');
    setShowImageModal(true);
    setShowLinkModal(false);
    setIsHeadingOpen(false);
    setIsFontSizeOpen(false);
    setIsFontFamilyOpen(false);
    setIsTextColorOpen(false);
    setIsHighlightOpen(false);
  };

  const closeImageModal = () => {
    setShowImageModal(false);
    setImageUrlInput('');
    setImageAltInput('');
  };

  const handleApplyImage = () => {
    if (!imageUrlInput.trim()) return;

    editorRef.current?.focus();
    restoreSelection();

    const imgHtml = `
      <div style="margin: 16px 0; text-align: center;">
        <img src="${imageUrlInput.trim()}" alt="${imageAltInput.trim() || 'Article Graphic'}" style="max-width: 100%; border-radius: 14px; border: 1px solid #e2e8f0; display: inline-block; box-shadow: 0 4px 12px rgba(0,0,0,0.05);" />
        ${imageAltInput.trim() ? `<p style="font-size: 12px; color: #64748b; margin-top: 6px; font-style: italic;">${imageAltInput.trim()}</p>` : ''}
      </div>
      <p><br></p>
    `;

    document.execCommand('insertHTML', false, imgHtml);
    handleInput();
    closeImageModal();
  };

  // ── Clear Formatting (Email Tx Style) ──
  const handleClearFormatting = () => {
    editorRef.current?.focus();
    document.execCommand('removeFormat', false);
    document.execCommand('unlink', false);
    handleInput();
    updateActiveFormats();
  };

  // ── Horizontal Rule / Divider ──
  const handleInsertDivider = () => {
    editorRef.current?.focus();
    document.execCommand('insertHorizontalRule', false);
    handleInput();
  };

  // ── Blockquote ──
  const handleBlockquote = () => {
    editorRef.current?.focus();
    const block = document.queryCommandValue('formatBlock').toLowerCase();
    document.execCommand('formatBlock', false, block === 'blockquote' ? 'p' : 'blockquote');
    handleInput();
    updateActiveFormats();
  };

  // ── Code Block / Inline Code ──
  const handleCodeBlock = () => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || !editorRef.current?.contains(sel.anchorNode) || sel.isCollapsed) {
      document.execCommand(
        'insertHTML',
        false,
        '<code style="background:#f1f5f9;color:#0f172a;padding:2px 6px;border-radius:4px;font-size:0.85em;font-family:monospace;">code</code>&nbsp;'
      );
    } else {
      const codeHtml = `<code style="background:#f1f5f9;color:#0f172a;padding:2px 6px;border-radius:4px;font-size:0.85em;font-family:monospace;">${sel.toString()}</code>&nbsp;`;
      document.execCommand('insertHTML', false, codeHtml);
    }
    handleInput();
  };

  const btnBase =
    'flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg transition-all text-slate-600 hover:bg-slate-200/80 hover:text-slate-900 focus:outline-none';
  const btnActive = 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300 font-bold';

  function ToolbarBtn({
    onClick, title, active, children,
  }: { onClick: () => void; title: string; active?: boolean; children: React.ReactNode; }) {
    return (
      <button
        type="button"
        onMouseDown={(e) => { e.preventDefault(); onClick(); }}
        title={title}
        className={`${btnBase} ${active ? btnActive : ''}`}
      >
        {children}
      </button>
    );
  }

  function Sep() {
    return <div className="w-px h-5 bg-slate-200 mx-0.5 shrink-0" />;
  }

  return (
    <div className="rounded-2xl border border-slate-200 overflow-hidden shadow-sm bg-white focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all relative">
      
      {/* ── EMAIL COMPOSER HEADER BAR ── */}
      <div className="px-3 py-1.5 bg-slate-900 text-slate-200 flex items-center justify-between text-xs border-b border-slate-800">
        <div className="flex items-center gap-2">
          <div className="flex gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-red-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
          </div>
          <span className="font-semibold text-slate-300 ml-1.5 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            Article Content Box (Rich Email Composer)
          </span>
        </div>
        <div className="flex items-center gap-3 text-[11px] text-slate-400">
          <span className="hidden sm:inline">⚡ Hyperlinks & Smart Spacing Enabled</span>
          <span className="bg-slate-800 px-2 py-0.5 rounded text-indigo-300 font-mono text-[10px]">Ctrl+K for Link</span>
        </div>
      </div>

      {/* ── TOOLBAR (GMAIL / OUTLOOK STYLE) ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2.5 py-2 bg-slate-50/90 border-b border-slate-200 relative">
        
        {/* Undo / Redo */}
        <ToolbarBtn onClick={() => exec('undo')} title="Undo (Ctrl+Z)">
          <Undo2 className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('redo')} title="Redo (Ctrl+Y)">
          <Redo2 className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <Sep />

        {/* Heading Style Dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsHeadingOpen(!isHeadingOpen);
              setIsFontSizeOpen(false);
              setIsFontFamilyOpen(false);
              setIsTextColorOpen(false);
              setIsHighlightOpen(false);
            }}
            className="flex items-center gap-1 px-2 h-7 sm:h-8 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200/80 transition-all min-w-[95px] justify-between border border-transparent hover:border-slate-300"
            title="Text Style / Heading"
          >
            <span className="truncate">{currentHeading}</span>
            <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
          </button>
          {isHeadingOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 min-w-[170px] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Text Style
              </div>
              {HEADING_OPTIONS.map((opt) => (
                <button
                  key={opt.tag}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    exec('formatBlock', opt.tag);
                    setCurrentHeading(opt.label);
                    setIsHeadingOpen(false);
                  }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-xs font-medium flex items-center justify-between"
                >
                  <span>{opt.label}</span>
                  <span className="text-[10px] font-mono text-slate-400">{opt.icon}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Font Size Dropdown */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsFontSizeOpen(!isFontSizeOpen);
              setIsHeadingOpen(false);
              setIsFontFamilyOpen(false);
              setIsTextColorOpen(false);
              setIsHighlightOpen(false);
            }}
            className="flex items-center gap-1 px-2 h-7 sm:h-8 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200/80 transition-all min-w-[75px] justify-between border border-transparent hover:border-slate-300"
            title="Font Size"
          >
            <span className="truncate">{currentFontSize}</span>
            <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
          </button>
          {isFontSizeOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 min-w-[140px] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Font Size
              </div>
              {FONT_SIZES.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onMouseDown={(e) => {
                    e.preventDefault();
                    exec('fontSize', size.cmdSize);
                    setCurrentFontSize(size.label);
                    setIsFontSizeOpen(false);
                  }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-xs font-medium flex items-center justify-between"
                >
                  <span>{size.label}</span>
                  <span className="text-[10px] text-slate-400 font-mono">{size.value}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <Sep />

        {/* Bold / Italic / Underline / Strike */}
        <ToolbarBtn onClick={() => exec('bold')} title="Bold (Ctrl+B)" active={activeFormats.has('bold')}>
          <Bold className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('italic')} title="Italic (Ctrl+I)" active={activeFormats.has('italic')}>
          <Italic className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('underline')} title="Underline (Ctrl+U)" active={activeFormats.has('underline')}>
          <Underline className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('strikeThrough')} title="Strikethrough" active={activeFormats.has('strikeThrough')}>
          <Strikethrough className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <Sep />

        {/* Text Color Picker */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsTextColorOpen(!isTextColorOpen);
              setIsHighlightOpen(false);
              setIsHeadingOpen(false);
              setIsFontSizeOpen(false);
            }}
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-slate-600 hover:bg-slate-200/80 transition-all relative"
            title="Text Color"
          >
            <Palette className="w-3.5 h-3.5 text-slate-700" />
            <span className="absolute bottom-1 w-3.5 h-0.5 bg-indigo-600 rounded-full" />
          </button>
          {isTextColorOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2.5 min-w-[170px] animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Text Color</div>
              <div className="grid grid-cols-4 gap-1.5">
                {TEXT_COLORS.map((tc) => (
                  <button
                    key={tc.color}
                    type="button"
                    title={tc.name}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      exec('foreColor', tc.color);
                      setIsTextColorOpen(false);
                    }}
                    className="w-7 h-7 rounded-lg border border-slate-200 hover:scale-110 transition-transform flex items-center justify-center shadow-xs"
                    style={{ backgroundColor: tc.color }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Background Highlight Picker */}
        <div className="relative">
          <button
            type="button"
            onMouseDown={(e) => {
              e.preventDefault();
              setIsHighlightOpen(!isHighlightOpen);
              setIsTextColorOpen(false);
              setIsHeadingOpen(false);
              setIsFontSizeOpen(false);
            }}
            className="flex items-center justify-center w-7 h-7 sm:w-8 sm:h-8 rounded-lg text-slate-600 hover:bg-slate-200/80 transition-all relative"
            title="Highlight Color"
          >
            <Highlighter className="w-3.5 h-3.5 text-amber-600" />
            <span className="absolute bottom-1 w-3.5 h-0.5 bg-amber-400 rounded-full" />
          </button>
          {isHighlightOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 p-2.5 min-w-[170px] animate-in fade-in zoom-in-95 duration-150">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">Highlight Color</div>
              <div className="grid grid-cols-4 gap-1.5">
                {HIGHLIGHT_COLORS.map((hc) => (
                  <button
                    key={hc.name}
                    type="button"
                    title={hc.name}
                    onMouseDown={(e) => {
                      e.preventDefault();
                      exec('hiliteColor', hc.color);
                      setIsHighlightOpen(false);
                    }}
                    className="w-7 h-7 rounded-lg border border-slate-200 hover:scale-110 transition-transform flex items-center justify-center text-[10px] font-bold"
                    style={{ backgroundColor: hc.color === 'transparent' ? '#ffffff' : hc.color }}
                  >
                    {hc.color === 'transparent' ? '✕' : ''}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        <Sep />

        {/* Text Alignment */}
        <ToolbarBtn onClick={() => exec('justifyLeft')} title="Align Left" active={activeFormats.has('justifyLeft')}>
          <AlignLeft className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('justifyCenter')} title="Align Center" active={activeFormats.has('justifyCenter')}>
          <AlignCenter className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('justifyRight')} title="Align Right" active={activeFormats.has('justifyRight')}>
          <AlignRight className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('justifyFull')} title="Justify" active={activeFormats.has('justifyFull')}>
          <AlignJustify className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <Sep />

        {/* Lists & Indentation */}
        <ToolbarBtn onClick={() => exec('insertUnorderedList')} title="Bulleted List" active={activeFormats.has('insertUnorderedList')}>
          <List className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('insertOrderedList')} title="Numbered List" active={activeFormats.has('insertOrderedList')}>
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('outdent')} title="Decrease Indent">
          <Outdent className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('indent')} title="Increase Indent">
          <Indent className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <Sep />

        {/* Quote & Code */}
        <ToolbarBtn onClick={handleBlockquote} title="Blockquote">
          <Quote className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={handleCodeBlock} title="Inline Code">
          <Code2 className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={handleInsertDivider} title="Horizontal Divider Line">
          <Minus className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <Sep />

        {/* ── HYPERTEXT LINK (EMAIL STYLE) ── */}
        <button
          type="button"
          onMouseDown={(e) => { e.preventDefault(); openLinkModal(); }}
          title="Insert Hyperlink (Ctrl+K)"
          className={`flex items-center gap-1 px-2.5 h-7 sm:h-8 rounded-lg text-xs font-bold transition-all ${
            activeFormats.has('link')
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-indigo-50 text-indigo-700 hover:bg-indigo-100 border border-indigo-200'
          }`}
        >
          <Link2 className="w-3.5 h-3.5" />
          <span>Hyperlink</span>
        </button>

        {/* Image */}
        <ToolbarBtn onClick={openImageModal} title="Insert Image by URL">
          <ImageIcon className="w-3.5 h-3.5" />
        </ToolbarBtn>

        {/* Clear Formatting */}
        <ToolbarBtn onClick={handleClearFormatting} title="Clear Formatting (Remove styles & unlinks)">
          <RemoveFormatting className="w-3.5 h-3.5 text-slate-500" />
        </ToolbarBtn>
      </div>

      {/* ── FLOATING INLINE LINK INSPECTOR CHIP ── */}
      {hoveredLink && !showLinkModal && (
        <div className="px-3 py-2 bg-slate-900 text-white flex items-center justify-between text-xs border-b border-slate-800 animate-in fade-in slide-in-from-top-1 duration-150">
          <div className="flex items-center gap-2 min-w-0">
            <span className="w-5 h-5 rounded bg-indigo-500/20 text-indigo-400 flex items-center justify-center shrink-0">
              <Link2 className="w-3 h-3" />
            </span>
            <span className="text-slate-300 text-xs truncate max-w-xs sm:max-w-md font-mono">{hoveredLink.url}</span>
          </div>
          <div className="flex items-center gap-2 shrink-0 ml-3">
            <a
              href={hoveredLink.url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-indigo-300 hover:text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Visit Link</span>
            </a>
            <button
              type="button"
              onClick={handleEditHoveredLink}
              className="px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white font-semibold text-[11px] flex items-center gap-1 transition-colors"
            >
              <Edit3 className="w-3 h-3" />
              <span>Change</span>
            </button>
            <button
              type="button"
              onClick={() => handleRemoveLink()}
              className="px-2 py-1 rounded bg-red-950/60 hover:bg-red-900 text-red-300 font-semibold text-[11px] flex items-center gap-1 transition-colors"
            >
              <Unlink className="w-3 h-3" />
              <span>Remove</span>
            </button>
          </div>
        </div>
      )}

      {/* ── INLINE HYPERLINK MODAL (GMAIL / OUTLOOK STYLE) ── */}
      {/* NOTE: intentionally NOT a <form> — this component lives inside the outer article <form>.
           Using a <div> prevents Enter/submit from bubbling up and refreshing the page. */}
      {showLinkModal && (
        <div className="p-4 bg-indigo-50/95 border-b border-indigo-100 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-3 max-w-xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center shadow-sm">
                  <Link2 className="w-3.5 h-3.5" />
                </span>
                <div>
                  <span className="text-xs font-bold text-slate-900 block leading-tight">Add Hyperlink / Wrapped Text</span>
                  <span className="text-[10px] text-slate-500">Only the display text will show on the web, cleanly linked to your URL</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsEmailType(!isEmailType)}
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-md border transition-all ${
                    isEmailType
                      ? 'bg-indigo-600 text-white border-indigo-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-indigo-300'
                  }`}
                >
                  <Mail className="w-3 h-3 inline mr-1 -mt-0.5" />
                  Email Format (mailto:)
                </button>
                <button
                  type="button"
                  onClick={closeLinkModal}
                  className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  Text to Display (Hypertext) *
                </label>
                <input
                  type="text"
                  autoFocus
                  value={linkTextInput}
                  onChange={(e) => setLinkTextInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyLink(); } }}
                  placeholder="e.g. Visit Our Website / Contact Support"
                  className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider mb-1">
                  {isEmailType ? 'Email Address *' : 'Target URL Address *'}
                </label>
                <input
                  type={isEmailType ? 'email' : 'text'}
                  value={linkUrlInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLinkUrlInput(val);
                    if (val.includes('@') && !val.startsWith('http')) {
                      setIsEmailType(true);
                    }
                  }}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyLink(); } }}
                  placeholder={isEmailType ? 'contact@flyodigital.com' : 'https://example.com/page'}
                  className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-between pt-1">
              <div className="text-[11px] text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-indigo-500" />
                <span>Text will be wrapped safely as a clickable link without exposing raw tags</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeLinkModal}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyLink}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm flex items-center gap-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>Insert Hyperlink</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── INLINE IMAGE MODAL ── */}
      {/* NOTE: intentionally NOT a <form> — same reason as link modal above. */}
      {showImageModal && (
        <div className="p-4 bg-slate-100 border-b border-slate-200 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-3 max-w-xl mx-auto">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <ImageIcon className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-slate-800">Insert Image into Article</span>
              </div>
              <button
                type="button"
                onClick={closeImageModal}
                className="w-6 h-6 rounded-md bg-white hover:bg-slate-200 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Image Web URL (.webp recommended) *
                </label>
                <input
                  type="url"
                  autoFocus
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); handleApplyImage(); } }}
                  placeholder="https://...image.webp"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Alt Text * (Required for SEO)
                </label>
                <input
                  type="text"
                  value={imageAltInput}
                  onChange={(e) => setImageAltInput(e.target.value)}
                  placeholder="Descriptive alt text for search engines"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>
            </div>

            {imageUrlInput && (
              <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-3">
                <img
                  src={imageUrlInput}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded-md border"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="text-[11px] text-slate-500 truncate">{imageUrlInput}</span>
              </div>
            )}

            <div className="flex items-center justify-between gap-2 pt-1">
              <span className="text-[10px] text-slate-500">
                🖼️ Image alt text will be saved for accessibility & SEO
              </span>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={closeImageModal}
                  className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyImage}
                  className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm"
                >
                  Insert Image
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── EDITABLE EMAIL CONTENT AREA ── */}
      <div
        ref={editorRef}
        id={id}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        onFocus={updateActiveFormats}
        onPaste={handlePaste}
        onKeyDown={handleKeyDown}
        style={{ minHeight, maxHeight: minHeight * 2.5 }}
        data-placeholder={placeholder}
        className={[
          'px-5 py-4 text-[15px] text-slate-900 bg-white focus:outline-none leading-relaxed font-normal',
          /* Scroll */
          'overflow-y-auto',
          /* Custom thin scrollbar */
          '[&::-webkit-scrollbar]:w-1.5',
          '[&::-webkit-scrollbar-track]:bg-slate-100 [&::-webkit-scrollbar-track]:rounded-full',
          '[&::-webkit-scrollbar-thumb]:bg-indigo-300 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:hover:bg-indigo-400',
          /* Paragraph & list spacing (Gmail-standard spacing) */
          '[&_p]:mb-5 [&_p]:leading-[1.8]',
          '[&_strong]:font-bold [&_strong]:text-slate-900 [&_b]:font-bold [&_b]:text-slate-900',
          '[&_em]:italic [&_em]:text-slate-800 [&_i]:italic [&_i]:text-slate-800',
          '[&_blockquote]:border-l-4 [&_blockquote]:border-blue-500 [&_blockquote]:bg-blue-50/50 [&_blockquote]:px-4 [&_blockquote]:py-2 [&_blockquote]:rounded-r-lg [&_blockquote]:italic [&_blockquote]:text-slate-600 [&_blockquote]:my-4',
          '[&_ul]:list-disc [&_ul]:pl-6 [&_ul]:my-3 [&_ul]:space-y-1.5',
          '[&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:my-3 [&_ol]:space-y-1.5',
          '[&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-slate-900 [&_h1]:mb-3 [&_h1]:mt-5',
          '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:mb-2.5 [&_h2]:mt-4',
          '[&_h3]:text-lg [&_h3]:font-bold [&_h3]:text-slate-800 [&_h3]:mb-2 [&_h3]:mt-3',
          '[&_a]:text-blue-600 [&_a]:underline [&_a]:font-semibold hover:[&_a]:text-blue-800 cursor-pointer [&_a]:decoration-blue-500/80 [&_a]:underline-offset-2',
          '[&_hr]:my-5 [&_hr]:border-t-2 [&_hr]:border-slate-200',
          '[&_code]:bg-slate-100 [&_code]:text-slate-800 [&_code]:px-1.5 [&_code]:py-0.5 [&_code]:rounded [&_code]:text-xs [&_code]:font-mono',
          '[&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-3 [&_img]:border [&_img]:border-slate-200',
          /* Empty placeholder */
          'empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none',
        ].join(' ')}
      />


      {/* ── EMAIL COMPOSER BOTTOM STATUS BAR ── */}
      <div className="px-4 py-2 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-500">
        <div className="flex items-center gap-3">
          <span className="font-semibold text-slate-700">{wordCount} {wordCount === 1 ? 'word' : 'words'}</span>
          <span>•</span>
          <span>{charCount} characters</span>
          <span>•</span>
          {wordCount < 200 ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 font-bold text-[10px]">
              ⚠️ Min 200 words needed ({200 - wordCount} more)
            </span>
          ) : wordCount <= 400 ? (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 font-bold text-[10px]">
              ✅ Word Count: Optimal (200–400 limit)
            </span>
          ) : (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-rose-100 text-rose-800 font-bold text-[10px]">
              ❌ Exceeds 400 words ({wordCount - 400} over limit)
            </span>
          )}
        </div>
        <div className="flex items-center gap-2 text-slate-400">
          <span>💡 Select text & press <kbd className="px-1 py-0.5 bg-white border border-slate-300 rounded font-mono text-[10px]">Ctrl+K</kbd> for link</span>
        </div>
      </div>
    </div>
  );
}

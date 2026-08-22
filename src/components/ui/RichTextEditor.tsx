'use client';

import React, { useRef, useEffect, useCallback, useState } from 'react';
import {
  Bold, Italic, Strikethrough, Highlighter,
  Superscript, Subscript,
  AlignLeft, AlignCenter, AlignRight, AlignJustify,
  List, ListOrdered, Quote, Code2,
  Link2, Image as ImageIcon,
  Undo2, Redo2,
  ChevronDown,
  Type,
  Mail,
  X,
  Check,
} from 'lucide-react';

interface RichTextEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
  minHeight?: number;
  id?: string;
}

const HEADING_OPTIONS = [
  { label: 'Normal Text', tag: 'p' },
  { label: 'Heading 1',   tag: 'h1' },
  { label: 'Heading 2',   tag: 'h2' },
  { label: 'Heading 3',   tag: 'h3' },
];

const FONT_SIZES = [
  { label: 'Small (12px)', value: '12px', fontSizeCmd: '1' },
  { label: 'Normal (14px)', value: '14px', fontSizeCmd: '2' },
  { label: 'Default (16px)', value: '16px', fontSizeCmd: '3' },
  { label: 'Medium (18px)', value: '18px', fontSizeCmd: '4' },
  { label: 'Large (22px)', value: '22px', fontSizeCmd: '5' },
  { label: 'XL (26px)', value: '26px', fontSizeCmd: '6' },
  { label: '2XL (32px)', value: '32px', fontSizeCmd: '7' },
];

export default function RichTextEditor({
  value,
  onChange,
  placeholder = 'Write your article content here...',
  minHeight = 320,
  id,
}: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  // Dropdowns state
  const [isHeadingOpen, setIsHeadingOpen] = useState(false);
  const [currentHeading, setCurrentHeading] = useState('Text');
  const [isFontSizeOpen, setIsFontSizeOpen] = useState(false);
  const [currentFontSize, setCurrentFontSize] = useState('16px');
  const [activeFormats, setActiveFormats] = useState<Set<string>>(new Set());

  // Inline Modal state
  const [showLinkModal, setShowLinkModal] = useState(false);
  const [linkInput, setLinkInput] = useState('');
  const [linkTextInput, setLinkTextInput] = useState('');
  const [isEmailType, setIsEmailType] = useState(false);

  const [showImageModal, setShowImageModal] = useState(false);
  const [imageInput, setImageInput] = useState('');
  const [imageAltInput, setImageAltInput] = useState('');

  const isInternalChange = useRef(false);

  // Set initial content on mount
  useEffect(() => {
    if (editorRef.current && value) {
      editorRef.current.innerHTML = value;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sync external value changes
  useEffect(() => {
    if (!editorRef.current) return;
    if (isInternalChange.current) {
      isInternalChange.current = false;
      return;
    }
    if (editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value || '';
    }
  }, [value]);

  const handleInput = useCallback(() => {
    if (!editorRef.current) return;
    isInternalChange.current = true;
    onChange(editorRef.current.innerHTML);
  }, [onChange]);

  const updateActiveFormats = useCallback(() => {
    const formats = new Set<string>();
    try {
      if (document.queryCommandState('bold')) formats.add('bold');
      if (document.queryCommandState('italic')) formats.add('italic');
      if (document.queryCommandState('strikeThrough')) formats.add('strikeThrough');
      if (document.queryCommandState('superscript')) formats.add('superscript');
      if (document.queryCommandState('subscript')) formats.add('subscript');
      if (document.queryCommandState('justifyLeft')) formats.add('justifyLeft');
      if (document.queryCommandState('justifyCenter')) formats.add('justifyCenter');
      if (document.queryCommandState('justifyRight')) formats.add('justifyRight');
      if (document.queryCommandState('justifyFull')) formats.add('justifyFull');
      if (document.queryCommandState('insertUnorderedList')) formats.add('insertUnorderedList');
      if (document.queryCommandState('insertOrderedList')) formats.add('insertOrderedList');

      const block = document.queryCommandValue('formatBlock').toLowerCase();
      if (block === 'h1') setCurrentHeading('H1');
      else if (block === 'h2') setCurrentHeading('H2');
      else if (block === 'h3') setCurrentHeading('H3');
      else setCurrentHeading('Text');
    } catch (_) {}
    setActiveFormats(formats);
  }, []);

  const exec = useCallback((command: string) => {
    editorRef.current?.focus();
    document.execCommand(command, false);
    handleInput();
    updateActiveFormats();
  }, [handleInput, updateActiveFormats]);

  const handleHighlight = useCallback(() => {
    editorRef.current?.focus();
    const currentColor = document.queryCommandValue('backColor');
    const isHighlighted =
      currentColor === 'rgb(254, 240, 138)' || currentColor === '#fef08a';
    document.execCommand('backColor', false, isHighlighted ? 'transparent' : '#fef08a');
    handleInput();
    updateActiveFormats();
  }, [handleInput, updateActiveFormats]);

  const handleBlockquote = useCallback(() => {
    editorRef.current?.focus();
    const block = document.queryCommandValue('formatBlock').toLowerCase();
    document.execCommand('formatBlock', false, block === 'blockquote' ? 'p' : 'blockquote');
    handleInput();
    updateActiveFormats();
  }, [handleInput, updateActiveFormats]);

  // Code Block without alert box
  const handleCodeBlock = useCallback(() => {
    editorRef.current?.focus();
    const sel = window.getSelection();
    if (!sel || !editorRef.current?.contains(sel.anchorNode)) {
      if (editorRef.current) {
        editorRef.current.innerHTML += '<code style="background:#f1f5f9;color:#0f172a;padding:2px 6px;border-radius:4px;font-size:0.85em;font-family:monospace;">code</code> ';
        handleInput();
      }
      return;
    }

    if (sel.isCollapsed || sel.toString().length === 0) {
      document.execCommand('insertHTML', false, '<code style="background:#f1f5f9;color:#0f172a;padding:2px 6px;border-radius:4px;font-size:0.85em;font-family:monospace;">code</code> ');
    } else {
      const range = sel.getRangeAt(0);
      const selectedText = range.toString();
      const code = document.createElement('code');
      code.style.cssText = 'background:#f1f5f9;color:#0f172a;padding:2px 6px;border-radius:4px;font-size:0.85em;font-family:monospace;';
      code.textContent = selectedText;
      range.deleteContents();
      range.insertNode(code);
      sel.removeAllRanges();
    }
    handleInput();
  }, [handleInput]);

  // ── Open Link / Email Modal ──
  const openLinkModal = () => {
    // Clean any prior anchor
    const oldAnchor = editorRef.current?.querySelector('#_flyo_link_anchor');
    if (oldAnchor) {
      const text = document.createTextNode(oldAnchor.textContent || '');
      oldAnchor.parentNode?.replaceChild(text, oldAnchor);
    }

    const sel = window.getSelection();
    let selectedText = '';

    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      selectedText = range.toString();

      const span = document.createElement('span');
      span.id = '_flyo_link_anchor';
      span.textContent = selectedText;
      range.deleteContents();
      range.insertNode(span);
    } else if (editorRef.current) {
      const span = document.createElement('span');
      span.id = '_flyo_link_anchor';
      editorRef.current.appendChild(span);
    }

    setLinkTextInput(selectedText.trim());
    setLinkInput('');
    setIsEmailType(false);
    setShowLinkModal(true);
    setShowImageModal(false);
    setIsHeadingOpen(false);
    setIsFontSizeOpen(false);
  };

  const closeLinkModal = () => {
    const anchor = editorRef.current?.querySelector('#_flyo_link_anchor');
    if (anchor && anchor.parentNode) {
      const text = document.createTextNode(anchor.textContent || '');
      anchor.parentNode.replaceChild(text, anchor);
      handleInput();
    }
    setShowLinkModal(false);
    setLinkInput('');
    setLinkTextInput('');
  };

  // ── Apply Link or Email ──
  const handleApplyLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkInput.trim()) return;

    let targetUrl = linkInput.trim();
    const isEmail = isEmailType || (targetUrl.includes('@') && !targetUrl.startsWith('http'));

    if (isEmail) {
      targetUrl = targetUrl.replace(/^mailto:/i, '');
      targetUrl = `mailto:${targetUrl}`;
    } else if (!targetUrl.startsWith('http://') && !targetUrl.startsWith('https://') && !targetUrl.startsWith('#') && !targetUrl.startsWith('mailto:')) {
      targetUrl = `https://${targetUrl}`;
    }

    const displayText = linkTextInput.trim() || linkInput.trim();

    const a = document.createElement('a');
    a.href = targetUrl;
    if (!isEmail) {
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
    }
    a.style.color = '#4f46e5';
    a.style.textDecoration = 'underline';
    a.style.fontWeight = '600';
    a.textContent = displayText;

    const anchor = editorRef.current?.querySelector('#_flyo_link_anchor');
    if (anchor && anchor.parentNode) {
      anchor.parentNode.replaceChild(a, anchor);
    } else if (editorRef.current) {
      editorRef.current.appendChild(a);
    }

    // Trailing non-breaking space
    const space = document.createTextNode('\u00A0');
    if (a.nextSibling) {
      a.parentNode?.insertBefore(space, a.nextSibling);
    } else {
      a.parentNode?.appendChild(space);
    }

    handleInput();
    setShowLinkModal(false);
    setLinkInput('');
    setLinkTextInput('');
  };

  // ── Open Image Modal ──
  const openImageModal = () => {
    const oldAnchor = editorRef.current?.querySelector('#_flyo_img_anchor');
    if (oldAnchor) oldAnchor.remove();

    const sel = window.getSelection();
    if (sel && sel.rangeCount > 0 && editorRef.current?.contains(sel.anchorNode)) {
      const range = sel.getRangeAt(0);
      const span = document.createElement('span');
      span.id = '_flyo_img_anchor';
      range.insertNode(span);
    } else if (editorRef.current) {
      const span = document.createElement('span');
      span.id = '_flyo_img_anchor';
      editorRef.current.appendChild(span);
    }

    setImageInput('');
    setImageAltInput('');
    setShowImageModal(true);
    setShowLinkModal(false);
    setIsHeadingOpen(false);
    setIsFontSizeOpen(false);
  };

  const closeImageModal = () => {
    const anchor = editorRef.current?.querySelector('#_flyo_img_anchor');
    if (anchor) anchor.remove();
    setShowImageModal(false);
    setImageInput('');
    setImageAltInput('');
  };

  // ── Apply Image ──
  const handleApplyImage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageInput.trim()) return;

    const imgUrl = imageInput.trim();
    const altText = imageAltInput.trim() || 'Article Image';

    const img = document.createElement('img');
    img.src = imgUrl;
    img.alt = altText;
    img.style.maxWidth = '100%';
    img.style.borderRadius = '12px';
    img.style.margin = '14px 0';
    img.style.border = '1px solid #e2e8f0';
    img.style.display = 'block';

    const p = document.createElement('p');
    p.innerHTML = '<br>';

    const anchor = editorRef.current?.querySelector('#_flyo_img_anchor');
    if (anchor && anchor.parentNode) {
      anchor.parentNode.replaceChild(img, anchor);
      if (img.nextSibling) {
        img.parentNode?.insertBefore(p, img.nextSibling);
      } else {
        img.parentNode?.appendChild(p);
      }
    } else if (editorRef.current) {
      editorRef.current.appendChild(img);
      editorRef.current.appendChild(p);
    }

    handleInput();
    setShowImageModal(false);
    setImageInput('');
    setImageAltInput('');
  };

  const handleHeadingSelect = useCallback((tag: string, label: string) => {
    editorRef.current?.focus();
    document.execCommand('formatBlock', false, tag);
    setCurrentHeading(label === 'Normal Text' ? 'Text' : label);
    setIsHeadingOpen(false);
    handleInput();
    updateActiveFormats();
  }, [handleInput, updateActiveFormats]);

  const handleFontSizeSelect = (sizeItem: typeof FONT_SIZES[0]) => {
    editorRef.current?.focus();
    document.execCommand('fontSize', false, sizeItem.fontSizeCmd);

    const fontTags = editorRef.current?.querySelectorAll('font[size]') || [];
    fontTags.forEach((f) => {
      const span = document.createElement('span');
      span.style.fontSize = sizeItem.value;
      span.innerHTML = f.innerHTML;
      f.parentNode?.replaceChild(span, f);
    });

    setCurrentFontSize(sizeItem.value);
    setIsFontSizeOpen(false);
    handleInput();
  };

  const btnBase =
    'flex items-center justify-center w-8 h-8 rounded-lg transition-all text-slate-600 hover:bg-slate-200 hover:text-slate-900';
  const btnActive = 'bg-indigo-100 text-indigo-700 ring-1 ring-indigo-300';

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
    <div className="rounded-xl border border-slate-200 overflow-hidden shadow-sm focus-within:ring-2 focus-within:ring-indigo-500 focus-within:border-transparent transition-all relative">
      {/* ── TOOLBAR ── */}
      <div className="flex flex-wrap items-center gap-0.5 px-2 py-1.5 bg-slate-50 border-b border-slate-200 relative">

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
            }}
            className="flex items-center gap-1 px-2 h-8 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all min-w-[70px]"
            title="Text Heading Style"
          >
            <Type className="w-3.5 h-3.5 shrink-0" />
            <span className="flex-1 text-left">{currentHeading}</span>
            <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
          </button>
          {isHeadingOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 min-w-[150px] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              {HEADING_OPTIONS.map((opt) => (
                <button
                  key={opt.tag}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleHeadingSelect(opt.tag, opt.label); }}
                  className="w-full text-left px-3 py-2 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-xs font-medium"
                >
                  {opt.label}
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
            }}
            className="flex items-center gap-1 px-2 h-8 rounded-lg text-xs font-semibold text-slate-700 hover:bg-slate-200 transition-all min-w-[65px]"
            title="Text Size"
          >
            <span className="flex-1 text-left">{currentFontSize}</span>
            <ChevronDown className="w-3 h-3 opacity-60 shrink-0" />
          </button>
          {isFontSizeOpen && (
            <div className="absolute top-full left-0 mt-1 bg-white border border-slate-200 rounded-xl shadow-xl z-50 min-w-[140px] overflow-hidden animate-in fade-in zoom-in-95 duration-150">
              <div className="px-3 py-1.5 bg-slate-50 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                Text Size
              </div>
              {FONT_SIZES.map((size) => (
                <button
                  key={size.value}
                  type="button"
                  onMouseDown={(e) => { e.preventDefault(); handleFontSizeSelect(size); }}
                  className="w-full text-left px-3 py-1.5 text-slate-700 hover:bg-indigo-50 hover:text-indigo-700 transition-colors text-xs font-medium flex items-center justify-between"
                >
                  <span>{size.label}</span>
                  {currentFontSize === size.value && <Check className="w-3 h-3 text-indigo-600" />}
                </button>
              ))}
            </div>
          )}
        </div>

        <Sep />

        {/* Bold / Italic / Strike / Highlight */}
        <ToolbarBtn onClick={() => exec('bold')} title="Bold" active={activeFormats.has('bold')}>
          <Bold className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('italic')} title="Italic" active={activeFormats.has('italic')}>
          <Italic className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('strikeThrough')} title="Strikethrough" active={activeFormats.has('strikeThrough')}>
          <Strikethrough className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={handleHighlight} title="Highlight Text">
          <Highlighter className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <Sep />

        {/* Superscript / Subscript */}
        <ToolbarBtn onClick={() => exec('superscript')} title="Superscript (x²)" active={activeFormats.has('superscript')}>
          <Superscript className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('subscript')} title="Subscript (x₂)" active={activeFormats.has('subscript')}>
          <Subscript className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <Sep />

        {/* Alignment */}
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

        {/* Lists */}
        <ToolbarBtn onClick={() => exec('insertUnorderedList')} title="Bullet List" active={activeFormats.has('insertUnorderedList')}>
          <List className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={() => exec('insertOrderedList')} title="Numbered List" active={activeFormats.has('insertOrderedList')}>
          <ListOrdered className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <Sep />

        {/* Blockquote / Code */}
        <ToolbarBtn onClick={handleBlockquote} title="Blockquote">
          <Quote className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={handleCodeBlock} title="Inline Code">
          <Code2 className="w-3.5 h-3.5" />
        </ToolbarBtn>

        <Sep />

        {/* Link / Image */}
        <ToolbarBtn onClick={openLinkModal} title="Insert Link or Email">
          <Link2 className="w-3.5 h-3.5" />
        </ToolbarBtn>
        <ToolbarBtn onClick={openImageModal} title="Insert Image by URL">
          <ImageIcon className="w-3.5 h-3.5" />
        </ToolbarBtn>
      </div>

      {/* ── INLINE LINK & EMAIL MODAL ── */}
      {showLinkModal && (
        <div className="p-4 bg-indigo-50/95 border-b border-indigo-100 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleApplyLink} className="space-y-3 max-w-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <Link2 className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-slate-800">Add Link or Email</span>
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

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  {isEmailType ? 'Email Address *' : 'URL Link or Email *'}
                </label>
                <input
                  type={isEmailType ? 'email' : 'text'}
                  autoFocus
                  required
                  value={linkInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setLinkInput(val);
                    if (val.includes('@') && !val.startsWith('http')) {
                      setIsEmailType(true);
                    }
                  }}
                  placeholder={isEmailType ? 'info@example.com' : 'https://example.com or user@mail.com'}
                  className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>

              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Text to Display (Optional)
                </label>
                <input
                  type="text"
                  value={linkTextInput}
                  onChange={(e) => setLinkTextInput(e.target.value)}
                  placeholder="e.g. Click Here / Contact Us"
                  className="w-full bg-white border border-indigo-200 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={closeLinkModal}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm"
              >
                Insert Link
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── INLINE IMAGE MODAL ── */}
      {showImageModal && (
        <div className="p-4 bg-slate-100 border-b border-slate-200 backdrop-blur-sm animate-in slide-in-from-top-2 duration-200">
          <form onSubmit={handleApplyImage} className="space-y-3 max-w-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-lg bg-indigo-600 text-white flex items-center justify-center">
                  <ImageIcon className="w-3.5 h-3.5" />
                </span>
                <span className="text-xs font-bold text-slate-800">Insert Image by URL</span>
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
                  Image Web URL *
                </label>
                <input
                  type="url"
                  autoFocus
                  required
                  value={imageInput}
                  onChange={(e) => setImageInput(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                  Alt / Caption Text
                </label>
                <input
                  type="text"
                  value={imageAltInput}
                  onChange={(e) => setImageAltInput(e.target.value)}
                  placeholder="e.g. Local shop storefront"
                  className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 placeholder:text-slate-400"
                />
              </div>
            </div>

            {imageInput && (
              <div className="p-2 rounded-lg bg-white border border-slate-200 flex items-center gap-3">
                <img
                  src={imageInput}
                  alt="Preview"
                  className="w-12 h-12 object-cover rounded-md border"
                  onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                />
                <span className="text-[11px] text-slate-500 truncate">{imageInput}</span>
              </div>
            )}

            <div className="flex items-center justify-end gap-2 pt-1">
              <button
                type="button"
                onClick={closeImageModal}
                className="px-3 py-1.5 rounded-lg bg-white border border-slate-200 text-slate-600 text-xs font-semibold hover:bg-slate-100 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 rounded-lg bg-indigo-600 text-white text-xs font-bold hover:bg-indigo-700 transition-all shadow-sm"
              >
                Insert Image
              </button>
            </div>
          </form>
        </div>
      )}

      {/* ── EDITABLE CONTENT AREA ── */}
      <div
        ref={editorRef}
        id={id}
        contentEditable
        suppressContentEditableWarning
        onInput={handleInput}
        onKeyUp={updateActiveFormats}
        onMouseUp={updateActiveFormats}
        onFocus={updateActiveFormats}
        style={{ minHeight }}
        data-placeholder={placeholder}
        className={[
          'px-4 py-3 text-sm text-slate-900 bg-white focus:outline-none leading-relaxed overflow-y-auto',
          /* prose-like styles via Tailwind arbitrary selectors */
          '[&_blockquote]:border-l-4 [&_blockquote]:border-indigo-400 [&_blockquote]:pl-4 [&_blockquote]:italic [&_blockquote]:text-slate-500 [&_blockquote]:my-3',
          '[&_ul]:list-disc [&_ul]:pl-5 [&_ul]:my-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:my-2',
          '[&_h1]:text-2xl [&_h1]:font-extrabold [&_h1]:text-slate-900 [&_h1]:mb-2 [&_h1]:mt-3',
          '[&_h2]:text-xl [&_h2]:font-bold [&_h2]:text-slate-800 [&_h2]:mb-2 [&_h2]:mt-3',
          '[&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-slate-800 [&_h3]:mb-1 [&_h3]:mt-2',
          '[&_a]:text-indigo-600 [&_a]:underline [&_a]:font-semibold hover:[&_a]:text-indigo-800',
          '[&_img]:max-w-full [&_img]:rounded-xl [&_img]:my-3 [&_img]:border [&_img]:border-slate-200',
          '[&_p]:mb-3',
          /* placeholder */
          'empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none',
        ].join(' ')}
      />
    </div>
  );
}

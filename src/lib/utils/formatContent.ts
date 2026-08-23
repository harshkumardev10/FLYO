/**
 * Converts raw text lines (or mixed markdown/plain text) into structured HTML:
 * - Detects bullet points (•, -, *, ▪, ▫, ‣, ✓, ✔, ►, –, —) -> <ul><li>
 * - Detects numbered lists (1., 2., 1), (1)) -> <ol><li>
 * - Detects markdown headings (#, ##, ###) -> <h1>, <h2>, <h3>
 * - Detects blockquotes (>) -> <blockquote>
 * - Detects markdown bold (**text**, __text__) -> <strong>
 * - Detects markdown italic (*text*, _text_) -> <em>
 * - Detects markdown links [text](url) & raw URLs -> <a href="..." class="text-blue-600 underline font-semibold ...">
 * - Preserves all symbols, emojis, and paragraph line spacing.
 */
export function convertTextToStructuredHtml(text: string): string {
  if (!text) return '';

  const lines = text.split('\n');
  const result: string[] = [];
  let currentListType: 'ul' | 'ol' | null = null;
  let currentParagraphLines: string[] = [];

  const flushParagraph = () => {
    if (currentParagraphLines.length > 0) {
      const paragraphText = currentParagraphLines.join('<br />').trim();
      if (paragraphText) {
        result.push(`<p class="mb-5 leading-[1.85] text-slate-700 text-base sm:text-lg">${paragraphText}</p>`);
      }
      currentParagraphLines = [];
    }
  };

  const flushList = () => {
    if (currentListType) {
      result.push(currentListType === 'ul' ? '</ul>' : '</ol>');
      currentListType = null;
    }
  };

  const bulletRegex = /^[\s]*(?:•|[-*▪▫‣✓✔►–—])[\s]+(.*)$/;
  const numberedRegex = /^[\s]*(?:\d+[\.\)]|\(\d+\))[\s]+(.*)$/;
  const h1Regex = /^[\s]*#[\s]+(.*)$/;
  const h2Regex = /^[\s]*##[\s]+(.*)$/;
  const h3Regex = /^[\s]*###+[\s]+(.*)$/;
  const quoteRegex = /^[\s]*>[\s]+(.*)$/;

  for (let i = 0; i < lines.length; i++) {
    const rawLine = lines[i];
    const trimmedLine = rawLine.trim();

    // Empty line -> flush open lists & paragraphs
    if (!trimmedLine) {
      flushParagraph();
      flushList();
      continue;
    }

    // Heading 1
    const h1Match = rawLine.match(h1Regex);
    if (h1Match) {
      flushParagraph();
      flushList();
      result.push(`<h1 class="text-3xl font-extrabold text-slate-900 mt-8 mb-4 tracking-tight">${formatInline(h1Match[1])}</h1>`);
      continue;
    }

    // Heading 2
    const h2Match = rawLine.match(h2Regex);
    if (h2Match) {
      flushParagraph();
      flushList();
      result.push(`<h2 class="text-2xl font-bold text-slate-900 mt-8 mb-4 tracking-tight">${formatInline(h2Match[1])}</h2>`);
      continue;
    }

    // Heading 3
    const h3Match = rawLine.match(h3Regex);
    if (h3Match) {
      flushParagraph();
      flushList();
      result.push(`<h3 class="text-xl font-bold text-slate-800 mt-6 mb-3">${formatInline(h3Match[1])}</h3>`);
      continue;
    }

    // Blockquote
    const quoteMatch = rawLine.match(quoteRegex);
    if (quoteMatch) {
      flushParagraph();
      flushList();
      result.push(`<blockquote class="border-l-4 border-blue-500 bg-blue-50/60 px-5 py-3 rounded-r-xl italic my-5 text-slate-700 font-medium">${formatInline(quoteMatch[1])}</blockquote>`);
      continue;
    }

    // Bullet List item
    const bulletMatch = rawLine.match(bulletRegex);
    if (bulletMatch) {
      flushParagraph();
      if (currentListType !== 'ul') {
        flushList();
        result.push('<ul class="list-disc pl-6 space-y-2 my-4 text-slate-700 text-base sm:text-lg">');
        currentListType = 'ul';
      }
      result.push(`<li class="leading-relaxed">${formatInline(bulletMatch[1])}</li>`);
      continue;
    }

    // Numbered List item
    const numberedMatch = rawLine.match(numberedRegex);
    if (numberedMatch) {
      flushParagraph();
      if (currentListType !== 'ol') {
        flushList();
        result.push('<ol class="list-decimal pl-6 space-y-2 my-4 text-slate-700 text-base sm:text-lg">');
        currentListType = 'ol';
      }
      result.push(`<li class="leading-relaxed">${formatInline(numberedMatch[1])}</li>`);
      continue;
    }

    // Regular line -> close list if any, accumulate in paragraph
    flushList();
    currentParagraphLines.push(formatInline(rawLine));
  }

  flushParagraph();
  flushList();

  return result.join('\n');
}

/**
 * Formats inline text (bold, italic, links, standalone URLs).
 */
function formatInline(str: string): string {
  if (!str) return '';

  let out = str;

  // 1. Markdown bold **text** or __text__
  out = out.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
  out = out.replace(/__(.*?)__/g, '<strong class="font-bold text-slate-900">$1</strong>');

  // 2. Markdown italic *text* or _text_
  out = out.replace(/(^|\s)\*([^\s*][^*]*[^\s*])\*(\s|$)/g, '$1<em class="italic text-slate-800">$2</em>$3');
  out = out.replace(/(^|\s)_([^\s_][^_]*[^\s_])_(\s|$)/g, '$1<em class="italic text-slate-800">$2</em>$3');

  // 3. Markdown links [text](url) -> vibrant blue underlined link
  out = out.replace(
    /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|www\.[^\s)]+)\)/gi,
    (match, title, rawUrl) => {
      const href = rawUrl.startsWith('www.') ? `https://${rawUrl}` : rawUrl;
      const isEmail = href.startsWith('mailto:');
      const targetAttr = isEmail ? '' : ' target="_blank" rel="noopener noreferrer"';
      return `<a href="${href}"${targetAttr} class="text-blue-600 underline font-semibold hover:text-blue-800 decoration-blue-500/80 underline-offset-2 transition-colors">${title}</a>`;
    }
  );

  // 4. Standalone raw URLs
  out = out.replace(
    /(^|\s)(https?:\/\/[^\s<"']+|www\.[^\s<"']+)(\s|$)/gi,
    (m, lead, url, trail) => {
      const href = url.startsWith('www.') ? `https://${url}` : url;
      return `${lead}<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline font-semibold hover:text-blue-800 decoration-blue-500/80 underline-offset-2 transition-colors">${url}</a>${trail}`;
    }
  );

  return out;
}

/**
 * Master formatter:
 * - If HTML is provided, standardizes all links, bold, italics, spacing, and detects bullet/numbered patterns.
 * - If plain text is provided, converts it cleanly into structured HTML with bullets, lists, headings, and links.
 */
export function formatContentWithHyperlinks(content: string): string {
  if (!content) return '';

  const trimmed = content.trim();

  // Check if content already contains HTML block elements
  const isHtml = /<(?:p|h[1-6]|div|ul|ol|li|blockquote|table|pre|hr|img|section|article)\b[^>]*>/i.test(trimmed);

  if (isHtml) {
    let processed = trimmed;

    // 1. Convert markdown bold/italic/links that might be inside HTML text
    processed = processed.replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold text-slate-900">$1</strong>');
    processed = processed.replace(/__(.*?)__/g, '<strong class="font-bold text-slate-900">$1</strong>');
    processed = processed.replace(/(^|\s)\*([^\s*][^*]*[^\s*])\*(\s|$)/g, '$1<em class="italic text-slate-800">$2</em>$3');
    processed = processed.replace(/(^|\s)_([^\s_][^_]*[^\s_])_(\s|$)/g, '$1<em class="italic text-slate-800">$2</em>$3');
    processed = processed.replace(
      /\[([^\]]+)\]\((https?:\/\/[^\s)]+|mailto:[^\s)]+|www\.[^\s)]+)\)/gi,
      (match, title, rawUrl) => {
        const href = rawUrl.startsWith('www.') ? `https://${rawUrl}` : rawUrl;
        const isEmail = href.startsWith('mailto:');
        const targetAttr = isEmail ? '' : ' target="_blank" rel="noopener noreferrer"';
        return `<a href="${href}"${targetAttr} class="text-blue-600 underline font-semibold hover:text-blue-800 decoration-blue-500/80 underline-offset-2 transition-colors">${title}</a>`;
      }
    );

    // 2. Standardize existing <a> tags so they have the exact blue underlined styling
    processed = processed.replace(
      /<a\s+([^>]*?)href=(["'])(.*?)\2([^>]*)>(.*?)<\/a>/gi,
      (match, beforeHref, quote, href, afterHref, innerText) => {
        const cleanInnerText = innerText.replace(/<\/?a[^>]*>/gi, '');
        const isEmail = href.startsWith('mailto:') || href.includes('@');
        const finalHref = (isEmail && !href.startsWith('mailto:') && !href.startsWith('http'))
          ? `mailto:${href}`
          : (href.startsWith('www.') ? `https://${href}` : href);

        const target = isEmail ? '' : ' target="_blank" rel="noopener noreferrer"';
        return `<a href="${finalHref}"${target} class="text-blue-600 underline font-semibold hover:text-blue-800 decoration-blue-500/80 underline-offset-2 transition-colors">${cleanInnerText}</a>`;
      }
    );

    // 3. Convert standalone raw URLs inside text nodes (not inside tags or href)
    const parts = processed.split(/(<[^>]+>)/g);
    for (let i = 0; i < parts.length; i += 2) {
      if (parts[i]) {
        parts[i] = parts[i].replace(
          /(^|\s)(https?:\/\/[^\s<"']+|www\.[^\s<"']+)(\s|$)/gi,
          (m, lead, url, trail) => {
            const href = url.startsWith('www.') ? `https://${url}` : url;
            return `${lead}<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-blue-600 underline font-semibold hover:text-blue-800 decoration-blue-500/80 underline-offset-2 transition-colors">${url}</a>${trail}`;
          }
        );
      }
    }
    processed = parts.join('');

    return processed;
  }

  // Plain text fallback -> Full structured parser with bullet, number, symbol & spacing detection
  return convertTextToStructuredHtml(trimmed);
}

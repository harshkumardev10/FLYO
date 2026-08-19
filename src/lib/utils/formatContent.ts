/**
 * Formats plain text or HTML content into safe HTML with automatic hyperlink detection.
 * Converts any URL (http/https/www) or markdown link [text](url) into working clickable <a> tags.
 */
export function formatContentWithHyperlinks(content: string): string {
  if (!content) return '';

  // If content contains existing HTML tags, convert plain URLs within text node chunks
  let processed = content;

  // 1. Convert markdown links [text](url)
  const mdLinkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+|www\.[^\s)]+)\)/gi;
  processed = processed.replace(mdLinkRegex, (match, title, url) => {
    const href = url.startsWith('www.') ? `https://${url}` : url;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-indigo-600 underline font-semibold hover:text-indigo-800 transition-colors">${title}</a>`;
  });

  // 2. Convert raw URLs (http://, https://, www.) into working links if not already in an href
  const rawUrlRegex = /(?<!href=["'])(https?:\/\/[^\s<"']+|www\.[^\s<"']+)/gi;
  processed = processed.replace(rawUrlRegex, (url) => {
    const href = url.startsWith('www.') ? `https://${url}` : url;
    return `<a href="${href}" target="_blank" rel="noopener noreferrer" class="text-indigo-600 underline font-semibold hover:text-indigo-800 transition-colors">${url}</a>`;
  });

  // 3. If content has no HTML structure tags (h1, h2, p, div, ul), wrap line blocks in <p>
  if (!/<(h[1-6]|p|div|ul|ol|blockquote)\b[^>]*>/i.test(content)) {
    const paragraphs = processed
      .split(/\n\s*\n/)
      .map((p) => p.trim())
      .filter(Boolean)
      .map((p) => `<p class="mb-4 leading-relaxed text-slate-700 text-sm sm:text-base">${p.replace(/\n/g, '<br />')}</p>`);
    return paragraphs.join('\n');
  }

  return processed;
}

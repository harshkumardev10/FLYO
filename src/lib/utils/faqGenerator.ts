/**
 * Intelligent FAQ Generator from Article Content
 * Automatically analyzes article titles, summaries, headings (h1, h2, h3),
 * and content paragraphs to extract high-value Q&As for SEO and reader engagement.
 */

export interface FAQItem {
  question: string;
  answer: string;
}

/**
 * Clean HTML string into clean plain text
 */
function cleanText(htmlOrText: string): string {
  return htmlOrText
    .replace(/<[^>]*>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Convert a heading or topic phrase into a natural question
 */
function headingToQuestion(heading: string, fallbackTitle: string): string {
  let clean = heading.replace(/^[\d\.\-\)\s]+/, '').trim(); // Remove leading numbers "1. ", "2) "

  // If already ends with ?, clean and return
  if (clean.endsWith('?')) return clean;

  const lower = clean.toLowerCase();

  if (
    lower.startsWith('why') ||
    lower.startsWith('how') ||
    lower.startsWith('what') ||
    lower.startsWith('when') ||
    lower.startsWith('where') ||
    lower.startsWith('who') ||
    lower.startsWith('which') ||
    lower.startsWith('can') ||
    lower.startsWith('is') ||
    lower.startsWith('should')
  ) {
    return `${clean}?`;
  }

  // If it starts with "Don't" or "Do not" or "Avoid"
  if (lower.startsWith("don't") || lower.startsWith('avoid') || lower.startsWith('do not')) {
    return `Why should businesses avoid ${clean.replace(/^(don't|avoid|do not)\s+/i, '')}?`;
  }

  // If it starts with action verbs like "Focus on", "Make sure", "Keep"
  if (lower.startsWith('focus on') || lower.startsWith('use ') || lower.startsWith('create ')) {
    return `Why is it important to ${clean.charAt(0).toLowerCase() + clean.slice(1)}?`;
  }

  // Default natural question conversion
  return `How does ${clean.charAt(0).toLowerCase() + clean.slice(1)} benefit your business?`;
}

/**
 * Generate 3 to 5 structured FAQ items from article title, summary, and HTML/text content
 */
export function generateFaqsFromContent(
  title: string,
  summary: string,
  contentHtml: string
): FAQItem[] {
  const faqs: FAQItem[] = [];
  const cleanTitle = cleanText(title) || 'this topic';
  const cleanSummary = cleanText(summary);

  // 1. Try parsing HTML headings and their following paragraph content
  if (contentHtml && /<h[1-4]/i.test(contentHtml)) {
    // Regex match <h[1-4]>...</h[1-4]> followed by sibling content
    const headingBlockRegex = /<h([1-4])[^>]*>([\s\S]*?)<\/h\1>([\s\S]*?)(?=(?:<h[1-4]|$))/gi;
    let match;

    while ((match = headingBlockRegex.exec(contentHtml)) !== null) {
      const rawHeading = cleanText(match[2]);
      const rawBody = cleanText(match[3]);

      if (rawHeading.length >= 4 && rawBody.length >= 20) {
        const question = headingToQuestion(rawHeading, cleanTitle);
        // Take first 1-2 sentences of body
        const sentences = rawBody.split(/(?<=[.!?])\s+/);
        const answer = sentences.slice(0, 2).join(' ').trim();

        if (question && answer && !faqs.some((f) => f.question.toLowerCase() === question.toLowerCase())) {
          faqs.push({ question, answer });
        }
      }
      if (faqs.length >= 4) break;
    }
  }

  // 2. If no HTML headings found, try markdown/plain text headings (e.g. ## Heading or 1. Heading)
  if (faqs.length < 2 && contentHtml) {
    const plain = cleanText(contentHtml);
    const lines = contentHtml.split(/\n+/).map((l) => l.trim()).filter(Boolean);

    for (let i = 0; i < lines.length - 1; i++) {
      const line = cleanText(lines[i]);
      const nextLine = cleanText(lines[i + 1]);

      if (
        (line.startsWith('#') || /^[\d]+[\.\)]\s+/.test(line)) &&
        line.length > 5 &&
        nextLine.length > 25
      ) {
        const question = headingToQuestion(line.replace(/^#+\s*/, ''), cleanTitle);
        const answer = nextLine.split(/(?<=[.!?])\s+/).slice(0, 2).join(' ').trim();
        if (question && answer && !faqs.some((f) => f.question.toLowerCase() === question.toLowerCase())) {
          faqs.push({ question, answer });
        }
      }
      if (faqs.length >= 4) break;
    }
  }

  // 3. Add core synthesized FAQ based on Title & Summary if needed
  if (cleanSummary && cleanSummary.length > 20 && !faqs.some((f) => f.question.includes('What is the main takeaway'))) {
    faqs.unshift({
      question: `What is the main key takeaway of "${cleanTitle}"?`,
      answer: cleanSummary.endsWith('.') ? cleanSummary : `${cleanSummary}.`,
    });
  }

  // 4. If we still have fewer than 3 FAQs, add contextual value FAQs
  if (faqs.length < 2) {
    faqs.push({
      question: `Why is this topic important for modern businesses?`,
      answer: `Implementing these strategies helps local brands build trust with potential customers, increase digital visibility, and create a seamless user experience that drives real results.`,
    });
  }

  if (faqs.length < 3) {
    faqs.push({
      question: `How quickly can businesses expect to see results?`,
      answer: `Most businesses notice improved customer engagement and search visibility within a few weeks of consistently applying these best practices.`,
    });
  }

  return faqs.slice(0, 5);
}

/**
 * Fallback helper ensuring any article rendering on the public site always gets smart FAQs
 */
export function getOrGenerateArticleFaqs(
  article: {
    title: string;
    summary: string;
    contentHtml: string;
    faqs?: Array<{ question: string; answer: string }>;
  }
): FAQItem[] {
  if (article.faqs && Array.isArray(article.faqs) && article.faqs.length > 0) {
    return article.faqs;
  }
  return generateFaqsFromContent(article.title, article.summary, article.contentHtml);
}

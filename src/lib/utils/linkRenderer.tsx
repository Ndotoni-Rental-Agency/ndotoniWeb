import React from 'react';
import Link from 'next/link';

/**
 * Renders text with clickable links
 * Supports both full URLs and relative property links
 */
export function renderTextWithLinks(text: string): React.ReactNode {
  if (!text) return text;

  // Regex patterns for different types of links
  const patterns = [
    // Full URLs (http/https) - more comprehensive pattern
    {
      regex: /(https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?)/g,
      type: 'external' as const,
    },
    // Relative property links (/property/id)
    {
      regex: /(\/property\/[a-zA-Z0-9-]+)/g,
      type: 'internal' as const,
    },
  ];

  let parts: Array<{ text: string; isLink: boolean; type?: 'external' | 'internal'; url?: string }> = [
    { text, isLink: false }
  ];

  // Process each pattern
  patterns.forEach(({ regex, type }) => {
    const newParts: typeof parts = [];
    
    parts.forEach(part => {
      if (part.isLink) {
        // Already a link, don't process further
        newParts.push(part);
        return;
      }

      const matches = Array.from(part.text.matchAll(regex));
      if (matches.length === 0) {
        newParts.push(part);
        return;
      }

      let lastIndex = 0;
      matches.forEach(match => {
        const matchStart = match.index!;
        const matchEnd = matchStart + match[0].length;

        // Add text before the match
        if (matchStart > lastIndex) {
          newParts.push({
            text: part.text.slice(lastIndex, matchStart),
            isLink: false,
          });
        }

        // Add the link
        newParts.push({
          text: match[0],
          isLink: true,
          type,
          url: match[0],
        });

        lastIndex = matchEnd;
      });

      // Add remaining text after the last match
      if (lastIndex < part.text.length) {
        newParts.push({
          text: part.text.slice(lastIndex),
          isLink: false,
        });
      }
    });

    parts = newParts;
  });

  // Convert parts to React elements
  return parts.map((part, index) => {
    if (!part.isLink) {
      return <span key={index}>{part.text}</span>;
    }

    const linkClasses = "text-blue-300 hover:text-blue-200 dark:text-blue-400 dark:hover:text-blue-300 underline decoration-blue-300 dark:decoration-blue-400 underline-offset-2 transition-colors font-medium";

    if (part.type === 'internal') {
      // Internal Next.js link - opens in new tab for property links
      return (
        <Link
          key={index}
          href={part.url!}
          className={linkClasses}
          target="_blank"
          rel="noopener noreferrer"
          title="View property details"
        >
          {part.text}
        </Link>
      );
    } else {
      // External link - show domain for security
      const domain = extractDomain(part.url!);
      return (
        <a
          key={index}
          href={part.url!}
          className={linkClasses}
          target="_blank"
          rel="noopener noreferrer"
          title={`Open ${domain} in new tab`}
        >
          {part.text}
          <svg className="inline w-3 h-3 ml-1 opacity-70" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
          </svg>
        </a>
      );
    }
  });
}

/**
 * Extract domain from URL for display purposes
 */
function extractDomain(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname;
  } catch {
    return 'external site';
  }
}

/**
 * Check if text contains any links
 */
export function hasLinks(text: string): boolean {
  const linkRegex = /(https?:\/\/(?:[-\w.])+(?:\:[0-9]+)?(?:\/(?:[\w\/_.])*(?:\?(?:[\w&=%.])*)?(?:\#(?:[\w.])*)?)?|\/property\/[a-zA-Z0-9-]+)/g;
  return linkRegex.test(text);
}

/**
 * Truncate long URLs for better display
 */
export function truncateUrl(url: string, maxLength: number = 50): string {
  if (url.length <= maxLength) return url;
  
  const start = url.substring(0, maxLength / 2);
  const end = url.substring(url.length - maxLength / 2);
  return `${start}...${end}`;
}
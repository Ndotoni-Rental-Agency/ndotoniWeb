import React from 'react';
import Link from 'next/link';

const NDOTONI_DOMAIN = 'ndotoni.com';

/**
 * Renders text with clickable links
 * - Supports:
 *   /property/:id
 *   https://www.ndotoni.com/property/:id  → treated as internal
 *   Any other https:// link → external
 */
export function renderTextWithLinks(text: string): React.ReactNode {
  if (!text) return text;

  const parts: Array<{
    text: string;
    isLink: boolean;
    type?: 'internal' | 'external';
    url?: string;
  }> = [];

  // Match:
  // 1. Full ndotoni property URLs
  // 2. Relative property URLs
  // 3. Any other http/https URL
  const LINK_REGEX =
    /(https?:\/\/[^\s]+|\/property\/[a-zA-Z0-9-]+)/g;

  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = LINK_REGEX.exec(text)) !== null) {
    const start = match.index;
    const rawUrl = match[0];

    if (start > lastIndex) {
      parts.push({
        text: text.slice(lastIndex, start),
        isLink: false,
      });
    }

    // Normalize property links
    const internalPropertyMatch =
      rawUrl.match(/\/property\/[a-zA-Z0-9-]+$/);

    if (
      internalPropertyMatch &&
      (rawUrl.startsWith('/property') ||
        rawUrl.includes(NDOTONI_DOMAIN))
    ) {
      parts.push({
        text: rawUrl,
        isLink: true,
        type: 'internal',
        url: internalPropertyMatch[0], // normalize to /property/:id
      });
    } else {
      parts.push({
        text: rawUrl,
        isLink: true,
        type: 'external',
        url: rawUrl,
      });
    }

    lastIndex = start + rawUrl.length;
  }

  if (lastIndex < text.length) {
    parts.push({
      text: text.slice(lastIndex),
      isLink: false,
    });
  }

  const linkClasses =
    'text-blue-300 hover:text-blue-200 dark:text-blue-400 dark:hover:text-blue-300 underline underline-offset-2 transition-colors font-medium';

  return parts.map((part, index) => {
    if (!part.isLink) {
      return <span key={index}>{part.text}</span>;
    }

    if (part.type === 'internal') {
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
    }

    return (
      <a
        key={index}
        href={part.url!}
        className={linkClasses}
        target="_blank"
        rel="noopener noreferrer"
        title={`Open ${extractDomain(part.url!)} in new tab`}
      >
        {part.text}
        <svg
          className="inline w-3 h-3 ml-1 opacity-70"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
          />
        </svg>
      </a>
    );
  });
}

function extractDomain(url: string): string {
  try {
    return new URL(url).hostname;
  } catch {
    return 'external site';
  }
}

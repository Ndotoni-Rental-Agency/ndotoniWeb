import { useRef } from 'react';

interface UseFadeInOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

/**
 * Previously faded sections in on scroll. Content started invisible until JavaScript ran,
 * which left pages blank for seconds on slow phones, so sections now render visible
 * immediately. The hook keeps its shape so existing callers need no changes.
 */
export function useFadeIn<T extends HTMLElement = HTMLDivElement>(_options: UseFadeInOptions = {}) {
  const ref = useRef<T>(null);
  return { ref, isVisible: true };
}

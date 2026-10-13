import { useRef } from 'react';

interface UseFadeInOptions {
  threshold?: number;
  rootMargin?: string;
  delay?: number;
}

/**
 * Previously hid content (opacity-0) until an IntersectionObserver fired,
 * which left whole sections blank when the observer was slow or never ran
 * (background tabs, slow phones, link previews). Content now renders visible
 * immediately; the API is kept so existing callers need no changes.
 */
export function useFadeIn<T extends HTMLElement = HTMLDivElement>(
  _options: UseFadeInOptions = {},
) {
  const elementRef = useRef<T>(null);

  return {
    ref: elementRef,
    isVisible: true,
  };
}

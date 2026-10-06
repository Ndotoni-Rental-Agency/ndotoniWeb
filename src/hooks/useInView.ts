import { useEffect, useRef, useState } from 'react';

interface UseInViewOptions {
  /** 0..1 — how much of the element must be visible to trigger. */
  threshold?: number;
  /** Margin around the root, e.g. '0px 0px -10% 0px' to trigger slightly early. */
  rootMargin?: string;
  /** Stop observing after the first time it enters view (default true). */
  once?: boolean;
  /**
   * Failsafe: force "in view" after this many ms even if the observer never
   * fires (background tabs, slow devices, link previews). Prevents the old
   * blank-section bug. Set to 0 to disable. Default 1200ms.
   */
  failsafeMs?: number;
}

/**
 * Reveal-on-scroll detector that is deliberately conservative about hiding
 * content: callers should treat `inView` as "safe to show the entrance", and
 * ALWAYS render content visible when the observer is unavailable.
 */
export function useInView<T extends HTMLElement = HTMLDivElement>(
  options: UseInViewOptions = {},
) {
  const {
    threshold = 0.12,
    rootMargin = '0px 0px -8% 0px',
    once = true,
    failsafeMs = 1200,
  } = options;

  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // No observer support → reveal immediately, never leave content hidden.
    if (typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }

    let settled = false;
    const reveal = () => {
      if (settled) return;
      settled = true;
      setInView(true);
    };

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            reveal();
            if (once) observer.disconnect();
          } else if (!once) {
            setInView(false);
          }
        }
      },
      { threshold, rootMargin },
    );

    observer.observe(node);

    const timer =
      failsafeMs > 0
        ? window.setTimeout(() => {
            reveal();
            if (once) observer.disconnect();
          }, failsafeMs)
        : undefined;

    return () => {
      observer.disconnect();
      if (timer) window.clearTimeout(timer);
    };
  }, [threshold, rootMargin, once, failsafeMs]);

  return { ref, inView };
}

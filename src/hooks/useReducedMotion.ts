import { useEffect, useState } from 'react';

/**
 * Single source of truth for the user's motion preference.
 *
 * SSR-safe: returns `false` (motion allowed) on the server and on first client
 * render, then updates after mount. Live-updates if the OS setting changes.
 */
export function useReducedMotion(): boolean {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || !window.matchMedia) return;
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(query.matches);
    update();
    // Safari <14 uses addListener/removeListener
    if (query.addEventListener) {
      query.addEventListener('change', update);
      return () => query.removeEventListener('change', update);
    }
    query.addListener(update);
    return () => query.removeListener(update);
  }, []);

  return reduced;
}

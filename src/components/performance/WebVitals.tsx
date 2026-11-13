'use client';

import { useEffect } from 'react';

export function WebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only load web-vitals in production
    if (process.env.NODE_ENV === 'production') {
      import('web-vitals').then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
        const report = () => {
          /* Vitals collected when Sentry performance is enabled; errors-only plan keeps tracesSampleRate 0. */
        };
        onCLS(report);
        onINP(report);
        onFCP(report);
        onLCP(report);
        onTTFB(report);
      }).catch(() => {
        // Silently fail if web-vitals is not available
      });
    }
  }, []);

  return null;
}
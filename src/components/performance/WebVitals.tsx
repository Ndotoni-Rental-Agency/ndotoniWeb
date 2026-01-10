'use client';

import { useEffect } from 'react';

export function WebVitals() {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Only load web-vitals in production
    if (process.env.NODE_ENV === 'production') {
      import('web-vitals').then(({ onCLS, onFID, onFCP, onLCP, onTTFB }) => {
        onCLS(console.log);
        onFID(console.log);
        onFCP(console.log);
        onLCP(console.log);
        onTTFB(console.log);
      }).catch(() => {
        // Silently fail if web-vitals is not available
      });
    }
  }, []);

  return null;
}
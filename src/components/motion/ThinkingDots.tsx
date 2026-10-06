'use client';

import React from 'react';
import { cn } from '@/lib/utils/common';

/**
 * Three bouncing dots that signal "the system is working" — used for the AI
 * search interpreting state. Decorative, so hidden from assistive tech (the
 * surrounding control already announces the busy state via aria-live/label).
 */
export function ThinkingDots({ className }: { className?: string }) {
  return (
    <span
      aria-hidden="true"
      className={cn('inline-flex items-center gap-1', className)}
    >
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="thinking-dot h-1.5 w-1.5 rounded-full bg-current"
          style={{ animationDelay: `${i * 160}ms` }}
        />
      ))}
    </span>
  );
}

export default ThinkingDots;

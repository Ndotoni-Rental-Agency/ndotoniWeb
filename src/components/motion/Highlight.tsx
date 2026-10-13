'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { cn } from '@/lib/utils/common';

type HighlightVariant = 'ring' | 'flash';

interface HighlightProps {
  /**
   * Change this value to re-trigger the attention cue. Any new value (that is
   * not null/undefined) fires one pulse. Great for "the AI needs you to decide"
   * or "this field needs attention" moments.
   */
  trigger?: unknown;
  /** 'ring' = one-shot pulsing outline (act here). 'flash' = soft bg sweep (value changed). */
  variant?: HighlightVariant;
  /**
   * Fire the cue as soon as the component mounts (use when the element is
   * conditionally rendered the moment attention is needed, e.g. a panel that
   * only appears when the user must decide). Defaults to false, where the cue
   * fires only on a subsequent change of `trigger`.
   */
  fireOnMount?: boolean;
  as?: React.ElementType;
  className?: string;
  children: React.ReactNode;
}

/**
 * Guided-interaction affordance: draws the eye to something the user should
 * act on, then settles. One-shot by design — infinite pulsing reads as an
 * error. Fully inert under prefers-reduced-motion.
 */
export function Highlight({
  trigger,
  variant = 'ring',
  fireOnMount = false,
  as,
  className,
  children,
}: HighlightProps) {
  const Tag = (as || 'div') as React.ElementType;
  const reducedMotion = useReducedMotion();
  const [active, setActive] = useState(false);
  const firstRun = useRef(true);

  useEffect(() => {
    if (reducedMotion) return;
    // By default this cue fires on a *change* of trigger, never on first
    // render (so a page load doesn't flash). Opt into mount-time firing for
    // elements that appear exactly when attention is needed.
    if (firstRun.current) {
      firstRun.current = false;
      if (!fireOnMount) return;
    }
    if (trigger === undefined || trigger === null) return;

    setActive(false);
    // Next frame so re-assigning the same animation class restarts it.
    const raf = requestAnimationFrame(() => setActive(true));
    const done = window.setTimeout(() => setActive(false), 2000);
    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(done);
    };
  }, [trigger, reducedMotion, fireOnMount]);

  return (
    <Tag
      className={cn(
        className,
        active && (variant === 'ring' ? 'animate-attention' : 'animate-highlight'),
      )}
    >
      {children}
    </Tag>
  );
}

export default Highlight;

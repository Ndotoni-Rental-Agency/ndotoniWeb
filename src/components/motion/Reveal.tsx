'use client';

import React from 'react';
import { useInView } from '@/hooks/useInView';
import { useReducedMotion } from '@/hooks/useReducedMotion';

type RevealProps<T extends React.ElementType> = {
  /** Element/component to render as. Defaults to a div. */
  as?: T;
  /** Stagger delay in ms (nice for lists / sequential sections). */
  delay?: number;
  /** How far the element travels while rising, in px. Default 16. */
  threshold?: number;
  rootMargin?: string;
  children: React.ReactNode;
  className?: string;
};

/**
 * Entrance animation on scroll-into-view: a calm rise + fade.
 *
 * Safety: content renders VISIBLE unless we can both (a) run motion
 * (prefers-reduced-motion off) and (b) rely on an observer that will reveal it.
 * The hidden state is only ever applied while we are confident a reveal will
 * follow, so content is never stranded invisible.
 */
export function Reveal<T extends React.ElementType = 'div'>({
  as,
  delay = 0,
  threshold,
  rootMargin,
  className,
  children,
  ...rest
}: RevealProps<T> &
  Omit<React.ComponentPropsWithoutRef<T>, keyof RevealProps<T>>) {
  const Tag = (as || 'div') as React.ElementType;
  const reducedMotion = useReducedMotion();
  const { ref, inView } = useInView<HTMLElement>({ threshold, rootMargin });

  // When motion is disabled we never set the hidden state → always visible.
  const animate = !reducedMotion;
  const state = !animate ? undefined : inView ? 'shown' : 'hidden';

  return (
    <Tag
      ref={ref}
      data-reveal={state}
      className={className}
      style={
        animate && delay && inView
          ? { transitionDelay: `${delay}ms` }
          : undefined
      }
      {...rest}
    >
      {children}
    </Tag>
  );
}

export default Reveal;

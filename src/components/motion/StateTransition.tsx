'use client';

import React, { useEffect, useRef, useState } from 'react';
import { useReducedMotion } from '@/hooks/useReducedMotion';

interface StateTransitionProps {
  /**
   * A key identifying the current state (e.g. 'loading' | 'content' | 'empty'
   * | 'error'). When it changes, the outgoing content fades out and the new
   * content fades in — closing the abrupt-swap seam between states.
   */
  transitionKey: string | number;
  className?: string;
  children: React.ReactNode;
}

/**
 * Soft crossfade between discrete UI states. Keeps layout simple: it fades the
 * subtree out, swaps children, and fades back in. Under reduced motion it just
 * swaps instantly.
 */
export function StateTransition({
  transitionKey,
  className,
  children,
}: StateTransitionProps) {
  const reducedMotion = useReducedMotion();
  const [rendered, setRendered] = useState(children);
  const [visible, setVisible] = useState(true);
  const keyRef = useRef(transitionKey);

  useEffect(() => {
    if (keyRef.current === transitionKey) {
      // Same state, just newer children (e.g. more items streamed in).
      setRendered(children);
      return;
    }
    keyRef.current = transitionKey;

    if (reducedMotion) {
      setRendered(children);
      setVisible(true);
      return;
    }

    setVisible(false);
    const swap = window.setTimeout(() => {
      setRendered(children);
      setVisible(true);
    }, 160);
    return () => window.clearTimeout(swap);
  }, [transitionKey, children, reducedMotion]);

  return (
    <div
      className={className}
      style={
        reducedMotion
          ? undefined
          : {
              opacity: visible ? 1 : 0,
              transition: 'opacity 0.18s ease-out',
            }
      }
    >
      {rendered}
    </div>
  );
}

export default StateTransition;

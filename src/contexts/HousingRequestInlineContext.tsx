'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

interface HousingRequestInlineContextValue {
  hasInlineCTA: boolean;
  registerInlineCTA: () => () => void;
}

const HousingRequestInlineContext = createContext<HousingRequestInlineContextValue>({
  hasInlineCTA: false,
  registerInlineCTA: () => () => {},
});

export function HousingRequestInlineProvider({ children }: { children: React.ReactNode }) {
  const countRef = useRef(0);
  const [hasInlineCTA, setHasInlineCTA] = useState(false);

  const registerInlineCTA = useCallback(() => {
    countRef.current += 1;
    setHasInlineCTA(true);

    return () => {
      countRef.current -= 1;
      if (countRef.current <= 0) {
        countRef.current = 0;
        setHasInlineCTA(false);
      }
    };
  }, []);

  const value = useMemo(
    () => ({ hasInlineCTA, registerInlineCTA }),
    [hasInlineCTA, registerInlineCTA],
  );

  return (
    <HousingRequestInlineContext.Provider value={value}>
      {children}
    </HousingRequestInlineContext.Provider>
  );
}

export function useHousingRequestInline() {
  return useContext(HousingRequestInlineContext);
}

/** Call from inline housing CTAs (form, banner) to hide the floating FAB. */
export function useRegisterInlineHousingRequestCTA(active = true) {
  const { registerInlineCTA } = useHousingRequestInline();

  useEffect(() => {
    if (!active) return;
    return registerInlineCTA();
  }, [active, registerInlineCTA]);
}

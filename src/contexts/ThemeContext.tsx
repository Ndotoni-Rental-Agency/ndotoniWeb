'use client';

import React, { createContext, useContext, useEffect, ReactNode } from 'react';

type Theme = 'light';

interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
  setTheme: (theme: Theme) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: ReactNode }) {
  // Always light — remove any previously saved dark preference
  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('dark');
    root.classList.add('light');
    localStorage.removeItem('theme');
  }, []);

  const noop = () => {};

  return (
    <ThemeContext.Provider value={{ theme: 'light', toggleTheme: noop, setTheme: noop }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
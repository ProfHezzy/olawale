'use client';

import { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
  resolvedTheme: 'light' | 'dark';
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children, defaultTheme = 'system' }: { children: ReactNode; defaultTheme?: Theme }) {
  const [theme, setTheme] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');
  const isInitialized = useRef(false);

  // Initialize theme on mount
  useEffect(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const stored = localStorage.getItem('theme') as Theme | null;
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    let initial: Theme;
    if (stored) {
      initial = stored;
    } else {
      initial = defaultTheme;
    }

    const resolved = initial === 'system' ? (prefersDark ? 'dark' : 'light') : initial;
    setResolvedTheme(resolved);
    setTheme(initial);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  }, [defaultTheme]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = (e: MediaQueryListEvent) => {
      const stored = localStorage.getItem('theme');
      if (!stored || stored === 'system') {
        const newResolved = e.matches ? 'dark' : 'light';
        setResolvedTheme(newResolved);
        document.documentElement.classList.toggle('dark', newResolved === 'dark');
      }
    };
    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const setThemeValue = (newTheme: Theme) => {
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const resolved = newTheme === 'system' ? (prefersDark ? 'dark' : 'light') : newTheme;
    setResolvedTheme(resolved);
    document.documentElement.classList.toggle('dark', resolved === 'dark');
  };

  const toggleTheme = () => {
    const newResolved = resolvedTheme === 'dark' ? 'light' : 'dark';
    setThemeValue(newResolved);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme: setThemeValue, toggleTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
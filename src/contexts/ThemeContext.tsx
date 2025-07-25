import React, { createContext, useContext, useEffect, useState } from 'react';

type Theme = 'light' | 'dark' | 'system';

interface ThemeContextType {
  theme: Theme;
  resolvedTheme: 'light' | 'dark';
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}

interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [theme, setThemeState] = useState<Theme>('system');
  const [resolvedTheme, setResolvedTheme] = useState<'light' | 'dark'>('light');

  // Get system theme preference
  const getSystemTheme = (): 'light' | 'dark' => {
    if (typeof window !== 'undefined') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  };

  // Resolve the actual theme to apply
  const resolveTheme = (currentTheme: Theme): 'light' | 'dark' => {
    if (currentTheme === 'system') {
      return getSystemTheme();
    }
    return currentTheme;
  };

  // Update theme
  const setTheme = (newTheme: Theme) => {
    setThemeState(newTheme);
    localStorage.setItem('gideon-theme', newTheme);
    
    const resolved = resolveTheme(newTheme);
    setResolvedTheme(resolved);
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
  };

  // Toggle between light and dark (skips system)
  const toggleTheme = () => {
    const currentResolved = resolveTheme(theme);
    const newTheme = currentResolved === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
  };

  // Initialize theme on mount
  useEffect(() => {
    // Get saved theme or default to system
    const savedTheme = localStorage.getItem('gideon-theme') as Theme;
    const initialTheme = savedTheme || 'system';
    
    const resolved = resolveTheme(initialTheme);
    
    setThemeState(initialTheme);
    setResolvedTheme(resolved);
    
    // Apply theme immediately to prevent flash
    document.documentElement.setAttribute('data-theme', resolved);
    document.documentElement.classList.remove('light', 'dark');
    document.documentElement.classList.add(resolved);
  }, []);

  // Listen for system theme changes
  useEffect(() => {
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      
      const handleChange = () => {
        const resolved = getSystemTheme();
        setResolvedTheme(resolved);
        document.documentElement.setAttribute('data-theme', resolved);
        document.documentElement.classList.remove('light', 'dark');
        document.documentElement.classList.add(resolved);
      };

      mediaQuery.addEventListener('change', handleChange);
      return () => mediaQuery.removeEventListener('change', handleChange);
    }
  }, [theme]);

  const value = {
    theme,
    resolvedTheme,
    setTheme,
    toggleTheme,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
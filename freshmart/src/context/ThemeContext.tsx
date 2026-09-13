import React, { createContext, useContext, useState, useEffect } from 'react';

export type AppTheme = 'indigo' | 'sapphire' | 'teal' | 'emerald' | 'amber' | 'rose';

export interface ThemeOption {
  id: AppTheme;
  name: string;
  subtitle: string;
  primaryColor: string;
  previewGradient: string;
  badgeBg: string;
  badgeText: string;
}

export const THEME_OPTIONS: ThemeOption[] = [
  {
    id: 'indigo',
    name: 'Modern Indigo',
    subtitle: 'Tím Chàm Công Nghệ (Stripe & Linear)',
    primaryColor: '#4f46e5',
    previewGradient: 'from-indigo-600 to-violet-600',
    badgeBg: 'bg-indigo-50',
    badgeText: 'text-indigo-700'
  },
  {
    id: 'sapphire',
    name: 'Oceanic Sapphire',
    subtitle: 'Xanh Biển Sapphire Sang Trọng',
    primaryColor: '#2563eb',
    previewGradient: 'from-blue-600 to-cyan-600',
    badgeBg: 'bg-blue-50',
    badgeText: 'text-blue-700'
  },
  {
    id: 'teal',
    name: 'Nordic Teal',
    subtitle: 'Xanh Mòng Két Bắc Âu Tươi Trẻ',
    primaryColor: '#0d9488',
    previewGradient: 'from-teal-600 to-emerald-600',
    badgeBg: 'bg-teal-50',
    badgeText: 'text-teal-700'
  },
  {
    id: 'emerald',
    name: 'Forest Mint',
    subtitle: 'Xanh Ngọc Hữu Cơ & Thảo Dược',
    primaryColor: '#059669',
    previewGradient: 'from-emerald-600 to-green-600',
    badgeBg: 'bg-emerald-50',
    badgeText: 'text-emerald-700'
  },
  {
    id: 'amber',
    name: 'Warm Caramel',
    subtitle: 'Cam Hổ Phách Cafe & Bakery',
    primaryColor: '#d97706',
    previewGradient: 'from-amber-600 to-orange-600',
    badgeBg: 'bg-amber-50',
    badgeText: 'text-amber-700'
  },
  {
    id: 'rose',
    name: 'Ruby Rose',
    subtitle: 'Hồng Ruby Thời Thượng & Quý Phái',
    primaryColor: '#e11d48',
    previewGradient: 'from-rose-600 to-pink-600',
    badgeBg: 'bg-rose-50',
    badgeText: 'text-rose-700'
  }
];

interface ThemeContextType {
  currentTheme: AppTheme;
  setTheme: (theme: AppTheme) => void;
  availableThemes: ThemeOption[];
}

const ThemeContext = createContext<ThemeContextType>({
  currentTheme: 'indigo',
  setTheme: () => {},
  availableThemes: THEME_OPTIONS
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentTheme, setCurrentThemeState] = useState<AppTheme>(() => {
    const saved = localStorage.getItem('freshmart_theme') as AppTheme;
    return saved && THEME_OPTIONS.some(t => t.id === saved) ? saved : 'indigo';
  });

  const setTheme = (theme: AppTheme) => {
    setCurrentThemeState(theme);
    localStorage.setItem('freshmart_theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  };

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', currentTheme);
  }, [currentTheme]);

  return (
    <ThemeContext.Provider value={{ currentTheme, setTheme, availableThemes: THEME_OPTIONS }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);

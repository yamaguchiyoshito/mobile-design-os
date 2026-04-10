import { createContext, useContext, useEffect, type ReactNode } from 'react';

import { useColorScheme } from '../../hooks/useColorScheme';
import { getThemePalette, type ResolvedColorScheme, type ThemePalette } from '../../lib/theme';
import { selectThemePreference, themeStore, useThemeStore } from '../../stores/themeStore';

type ThemeContextValue = {
  colorScheme: ResolvedColorScheme;
  preference: 'light' | 'dark' | 'system';
  palette: ThemePalette;
  setPreference: (nextPreference: 'light' | 'dark' | 'system') => void;
};

const fallbackColorScheme: ResolvedColorScheme = 'light';
const fallbackPalette = getThemePalette(fallbackColorScheme);

const ThemeContext = createContext<ThemeContextValue>({
  colorScheme: fallbackColorScheme,
  preference: 'system',
  palette: fallbackPalette,
  setPreference: (nextPreference) => {
    themeStore.getState().setColorScheme(nextPreference);
  },
});

export type ThemeProviderProps = {
  children: ReactNode;
};

export function ThemeProvider({ children }: ThemeProviderProps) {
  const colorScheme = useColorScheme();
  const preference = useThemeStore(selectThemePreference);
  const palette = getThemePalette(colorScheme);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    document.documentElement.style.colorScheme = colorScheme;
    document.documentElement.setAttribute('data-color-scheme', colorScheme);
    document.body.style.backgroundColor = palette.appBackground;
    document.body.style.color = palette.contentPrimary;
  }, [colorScheme, palette.appBackground, palette.contentPrimary]);

  return (
    <ThemeContext.Provider
      value={{
        colorScheme,
        preference,
        palette,
        setPreference: (nextPreference) => {
          themeStore.getState().setColorScheme(nextPreference);
        },
      }}
    >
      <div
        data-color-scheme={colorScheme}
        style={{
          minHeight: '100vh',
          backgroundColor: palette.appBackground,
          color: palette.contentPrimary,
        }}
      >
        {children}
      </div>
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeContext);
}

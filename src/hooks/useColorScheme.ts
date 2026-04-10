import { useSyncExternalStore } from 'react';

import type { ResolvedColorScheme } from '../lib/theme';
import { selectThemePreference, useThemeStore } from '../stores/themeStore';

const DARK_MEDIA_QUERY = '(prefers-color-scheme: dark)';

function getSystemColorSchemeSnapshot(): ResolvedColorScheme {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return 'light';
  }

  return window.matchMedia(DARK_MEDIA_QUERY).matches ? 'dark' : 'light';
}

function subscribeSystemColorScheme(listener: () => void) {
  if (typeof window === 'undefined' || typeof window.matchMedia !== 'function') {
    return () => undefined;
  }

  const mediaQuery = window.matchMedia(DARK_MEDIA_QUERY);
  const handleChange = () => {
    listener();
  };

  if (typeof mediaQuery.addEventListener === 'function') {
    mediaQuery.addEventListener('change', handleChange);
    return () => {
      mediaQuery.removeEventListener('change', handleChange);
    };
  }

  mediaQuery.addListener(handleChange);
  return () => {
    mediaQuery.removeListener(handleChange);
  };
}

export function useSystemColorScheme() {
  return useSyncExternalStore(
    subscribeSystemColorScheme,
    getSystemColorSchemeSnapshot,
    getSystemColorSchemeSnapshot,
  );
}

export function useColorScheme(): ResolvedColorScheme {
  const themePreference = useThemeStore(selectThemePreference);
  const systemColorScheme = useSystemColorScheme();

  return themePreference === 'system' ? systemColorScheme : themePreference;
}

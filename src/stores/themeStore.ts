import { useSyncExternalStore } from 'react';

import type { ThemePreference } from '../lib/theme';

export const THEME_STORAGE_KEY = 'theme-preference';

export type ThemeState = {
  colorScheme: ThemePreference;
};

type ThemeMethods = {
  setColorScheme: (nextColorScheme: ThemePreference) => void;
  hydrate: () => void;
  reset: () => void;
};

export type ThemeSnapshot = ThemeState & ThemeMethods;
type Listener = () => void;

function createState(colorScheme: ThemePreference = 'system'): ThemeState {
  return { colorScheme };
}

function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

function readStorage(): ThemeState {
  if (typeof window === 'undefined') {
    return createState();
  }

  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);

    if (!raw) {
      return createState();
    }

    const parsed = JSON.parse(raw) as { colorScheme?: unknown };

    return createState(isThemePreference(parsed.colorScheme) ? parsed.colorScheme : 'system');
  } catch {
    return createState();
  }
}

function writeStorage(next: ThemeState) {
  if (typeof window === 'undefined') {
    return;
  }

  try {
    if (next.colorScheme === 'system') {
      window.localStorage.removeItem(THEME_STORAGE_KEY);
      return;
    }

    window.localStorage.setItem(THEME_STORAGE_KEY, JSON.stringify(next));
  } catch {
    // Keep in-memory state even when persistence fails.
  }
}

let state = readStorage();
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(next: ThemeState) {
  state = next;
  writeStorage(next);
  emit();
}

const methods: ThemeMethods = {
  setColorScheme(nextColorScheme) {
    setState(createState(nextColorScheme));
  },

  hydrate() {
    setState(readStorage());
  },

  reset() {
    setState(createState());
  },
};

export const themeStore = {
  getState(): ThemeSnapshot {
    return {
      ...state,
      ...methods,
    };
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useThemeStore<T>(selector: (snapshot: ThemeSnapshot) => T) {
  return useSyncExternalStore(
    themeStore.subscribe,
    () => selector(themeStore.getState()),
    () => selector(themeStore.getState()),
  );
}

export const selectThemePreference = (snapshot: ThemeSnapshot) => snapshot.colorScheme;

import { describe, expect, test } from 'vitest';

import { THEME_STORAGE_KEY, themeStore } from './themeStore';

describe('themeStore', () => {
  test('theme preference を永続化する', () => {
    themeStore.getState().setColorScheme('dark');

    expect(themeStore.getState().colorScheme).toBe('dark');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBe(JSON.stringify({ colorScheme: 'dark' }));

    themeStore.getState().reset();
  });

  test('system 選択時は localStorage を削除する', () => {
    themeStore.getState().setColorScheme('light');
    themeStore.getState().setColorScheme('system');

    expect(themeStore.getState().colorScheme).toBe('system');
    expect(window.localStorage.getItem(THEME_STORAGE_KEY)).toBeNull();
  });
});

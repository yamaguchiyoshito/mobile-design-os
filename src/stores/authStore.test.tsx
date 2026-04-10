import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';

import {
  AUTH_STORAGE_KEY,
  authStore,
  selectIsAuthenticated,
  useAuthStore,
} from './authStore';

describe('authStore', () => {
  afterEach(() => {
    window.localStorage.clear();
    authStore.getState().reset();
  });

  test('setAuth で認証状態を保存する', () => {
    authStore.getState().setAuth('user-1', 'token-1');

    expect(authStore.getState().userId).toBe('user-1');
    expect(authStore.getState().token).toBe('token-1');
    expect(authStore.getState().isAuthenticated).toBe(true);
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toContain('user-1');
  });

  test('useAuthStore selector で状態変化を購読できる', () => {
    function Probe() {
      const isAuthenticated = useAuthStore(selectIsAuthenticated);
      return <span>{isAuthenticated ? 'authenticated' : 'guest'}</span>;
    }

    const { getByText } = render(<Probe />);

    expect(getByText('guest')).toBeInTheDocument();

    act(() => {
      authStore.getState().login('user-2');
    });

    expect(getByText('authenticated')).toBeInTheDocument();
  });

  test('clearAuth で永続化データを除去する', () => {
    authStore.getState().setAuth('user-1', 'token-1');

    authStore.getState().clearAuth();

    expect(authStore.getState().isLoggedIn).toBe(false);
    expect(window.localStorage.getItem(AUTH_STORAGE_KEY)).toBeNull();
  });
});

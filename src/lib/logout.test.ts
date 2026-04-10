import { afterEach, describe, expect, test, vi } from 'vitest';

import { authStore } from '../stores/authStore';
import * as webViewCacheManager from './webViewCacheManager';
import { logoutWithCleanup } from './logout';

describe('logoutWithCleanup', () => {
  afterEach(() => {
    authStore.getState().reset();
    vi.restoreAllMocks();
  });

  test('WebView キャッシュを消して認証状態をクリアする', async () => {
    const clearSpy = vi.spyOn(webViewCacheManager, 'clearWebViewCache').mockResolvedValue();
    authStore.getState().login('user-1', 'token-1');

    await logoutWithCleanup();

    expect(clearSpy).toHaveBeenCalledTimes(1);
    expect(authStore.getState().isLoggedIn).toBe(false);
  });

  test('キャッシュクリアが失敗しても認証状態はクリアする', async () => {
    vi.spyOn(webViewCacheManager, 'clearWebViewCache').mockRejectedValue(new Error('failed'));
    authStore.getState().login('user-1', 'token-1');

    await expect(logoutWithCleanup()).rejects.toThrow('failed');
    expect(authStore.getState().isLoggedIn).toBe(false);
  });
});

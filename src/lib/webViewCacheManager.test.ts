import { afterEach, describe, expect, test, vi } from 'vitest';

import { clearWebViewCache, registerWebViewCacheResetStrategy } from './webViewCacheManager';

describe('webViewCacheManager', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('Cache Storage と登録済み strategy をクリアする', async () => {
    const keys = vi.fn().mockResolvedValue(['wv-a', 'wv-b']);
    const del = vi.fn().mockResolvedValue(true);
    const originalCaches = window.caches;

    Object.defineProperty(window, 'caches', {
      configurable: true,
      value: { keys, delete: del },
    });

    const strategy = vi.fn();
    const unregister = registerWebViewCacheResetStrategy(strategy);

    await clearWebViewCache();

    expect(keys).toHaveBeenCalledTimes(1);
    expect(del).toHaveBeenCalledWith('wv-a');
    expect(del).toHaveBeenCalledWith('wv-b');
    expect(strategy).toHaveBeenCalledTimes(1);

    unregister();
    Object.defineProperty(window, 'caches', {
      configurable: true,
      value: originalCaches,
    });
  });
});

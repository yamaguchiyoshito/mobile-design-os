import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { authStore } from '../stores/authStore';
import {
  PENDING_DEEP_LINK_KEY,
  configureDeepLinkResolver,
  consumePendingDeepLink,
  navigate,
  resetDeepLinkResolverConfig,
} from './deepLinkResolver';

describe('deepLinkResolver', () => {
  const push = vi.fn();
  const replace = vi.fn();
  const openExternalUrl = vi.fn();

  beforeEach(() => {
    push.mockReset();
    replace.mockReset();
    openExternalUrl.mockReset();
    window.localStorage.clear();
    authStore.getState().reset();
    configureDeepLinkResolver({
      router: { push, replace },
      openExternalUrl,
    });
  });

  afterEach(() => {
    resetDeepLinkResolverConfig();
  });

  test.each([
    ['myapp://order/order-001', '/(main)/orders/order-001'],
    ['https://example.com/order/order-001', '/(main)/orders/order-001'],
    ['myapp://orders/order-001', '/(main)/orders/order-001'],
    ['myapp://orders', '/(main)/orders'],
    ['myapp://orders?filter=action-required', '/(main)/orders?filter=action-required'],
    [
      'myapp://orders?tab=refund&q=%E3%83%AF%E3%82%A4%E3%83%A4%E3%83%AC%E3%82%B9&sort=amount-desc',
      '/(main)/orders?tab=refund&q=%E3%83%AF%E3%82%A4%E3%83%A4%E3%83%AC%E3%82%B9&sort=amount-desc',
    ],
    ['myapp://search?q=coffee', '/(main)/search?q=coffee'],
    ['myapp://profile', '/(main)/profile'],
    ['myapp://profile/settings', '/(main)/profile/settings'],
    ['myapp://notifications', '/(main)/notifications'],
    ['myapp://campaign/camp-001', '/(main)/campaign/camp-001'],
    ['myapp://auth/verify?token=abc', '/(auth)/verify?token=abc'],
  ])('%s を %s に解決する', async (url, expectedPath) => {
    authStore.getState().login('user-1');

    await navigate(url);

    expect(push).toHaveBeenCalledWith(expectedPath);
  });

  test('未定義の https URL は外部ブラウザに委譲する', async () => {
    const result = await navigate('https://unknown.example.com/page');

    expect(result).toBe(true);
    expect(openExternalUrl).toHaveBeenCalledWith('https://unknown.example.com/page');
  });

  test('未ログイン時の認証必須ルートはログイン画面へ送って保留する', async () => {
    const result = await navigate('myapp://order/order-001');

    expect(result).toBe(true);
    expect(replace).toHaveBeenCalledWith('/(auth)/login');
    expect(window.localStorage.getItem(PENDING_DEEP_LINK_KEY)).toBe('myapp://order/order-001');
  });

  test('consumePendingDeepLink は保留 URL を再生してクリアする', async () => {
    authStore.getState().login('user-1');
    window.localStorage.setItem(PENDING_DEEP_LINK_KEY, 'myapp://profile');

    await consumePendingDeepLink();

    expect(window.localStorage.getItem(PENDING_DEEP_LINK_KEY)).toBeNull();
    expect(push).toHaveBeenCalledWith('/(main)/profile');
  });

  test('外部ホストが内部ルートを装う URL は拒否する', async () => {
    const result = await navigate('https://evil.example.com/order/1');

    expect(result).toBe(false);
    expect(push).not.toHaveBeenCalled();
    expect(openExternalUrl).not.toHaveBeenCalled();
  });
});

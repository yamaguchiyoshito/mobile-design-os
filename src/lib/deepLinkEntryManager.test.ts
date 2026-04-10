import { describe, expect, test, vi } from 'vitest';

import { createDeepLinkEntryManager } from './deepLinkEntryManager';

describe('deepLinkEntryManager', () => {
  test('初期 URL は一度だけ処理する', async () => {
    const navigate = vi.fn().mockResolvedValue(true);
    const manager = createDeepLinkEntryManager({ navigate });

    expect(await manager.handleInitialUrl('myapp://profile')).toBe(true);
    expect(await manager.handleInitialUrl('myapp://profile')).toBe(false);
    expect(navigate).toHaveBeenCalledTimes(1);
  });

  test('Linking event を deepLinkResolver に委譲する', async () => {
    const navigate = vi.fn().mockResolvedValue(true);
    const manager = createDeepLinkEntryManager({ navigate });

    await manager.handleUrlEvent({ url: 'myapp://orders' });

    expect(navigate).toHaveBeenCalledWith('myapp://orders');
  });

  test('通知レスポンスを handler に委譲する', async () => {
    const handleNotificationResponse = vi.fn().mockResolvedValue(true);
    const manager = createDeepLinkEntryManager({ handleNotificationResponse });

    await manager.handleNotificationResponse({
      notification: { request: { content: { data: { category: 'message' } } } },
    });

    expect(handleNotificationResponse).toHaveBeenCalledTimes(1);
  });

  test('ログイン完了時だけ保留 deep link を再生する', async () => {
    const consumePendingDeepLink = vi.fn().mockResolvedValue(undefined);
    const manager = createDeepLinkEntryManager({ consumePendingDeepLink });

    await manager.handleLoginStateChange(false);
    await manager.handleLoginStateChange(true);

    expect(consumePendingDeepLink).toHaveBeenCalledTimes(1);
  });
});

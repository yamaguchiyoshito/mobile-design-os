import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';

import { authStore } from '../stores/authStore';
import { configureDeepLinkResolver, resetDeepLinkResolverConfig } from './deepLinkResolver';
import {
  extractNotificationData,
  handleNotificationResponse,
  handleNotificationTap,
  parseNotificationData,
} from './notificationDeepLink';

describe('notificationDeepLink', () => {
  const push = vi.fn();

  beforeEach(() => {
    push.mockReset();
    authStore.getState().reset();
    configureDeepLinkResolver({
      router: {
        push,
        replace: vi.fn(),
      },
    });
  });

  afterEach(() => {
    resetDeepLinkResolverConfig();
  });

  test('通知 payload を検証する', () => {
    expect(
      parseNotificationData({
        category: 'order_status',
        deepLink: 'myapp://order/order-001',
      }),
    ).toEqual({
      category: 'order_status',
      deepLink: 'myapp://order/order-001',
    });
  });

  test('通知タップを deepLinkResolver に委譲する', async () => {
    const handled = await handleNotificationTap({
      category: 'promotion',
      deepLink: 'myapp://campaign/camp-001',
    });

    expect(handled).toBe(true);
    expect(push).toHaveBeenCalledWith('/(main)/campaign/camp-001');
  });

  test('レスポンスから data を抽出して処理する', async () => {
    authStore.getState().login('user-1');

    const response = {
      notification: {
        request: {
          content: {
            data: {
              category: 'message',
              deepLink: 'myapp://profile',
            },
          },
        },
      },
    };

    expect(extractNotificationData(response)).toEqual({
      category: 'message',
      deepLink: 'myapp://profile',
    });

    expect(await handleNotificationResponse(response)).toBe(true);
    expect(push).toHaveBeenCalledWith('/(main)/profile');
  });

  test('deepLink がない通知は無視する', async () => {
    expect(await handleNotificationTap({ category: 'critical' })).toBe(false);
    expect(push).not.toHaveBeenCalled();
  });
});

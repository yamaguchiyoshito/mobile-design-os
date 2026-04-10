import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import type { NotificationResponseLike } from '../types/notification';
import { useDeepLinkEntrypoints } from './useDeepLinkEntrypoints';

function TestComponent(props: Parameters<typeof useDeepLinkEntrypoints>[0]) {
  useDeepLinkEntrypoints(props);
  return null;
}

describe('useDeepLinkEntrypoints', () => {
  test('初期 URL とコールドスタート通知を処理する', async () => {
    const manager = {
      handleInitialUrl: vi.fn().mockResolvedValue(true),
      handleUrlEvent: vi.fn().mockResolvedValue(true),
      handleNotificationResponse: vi.fn().mockResolvedValue(true),
      handleLastNotificationResponse: vi.fn().mockResolvedValue(true),
      handleLoginStateChange: vi.fn().mockResolvedValue(undefined),
      resetInitialUrlGuard: vi.fn(),
    };

    render(
      <TestComponent
        manager={manager}
        getInitialUrl={async () => 'myapp://profile'}
        getLastNotificationResponse={async () => ({
          notification: { request: { content: { data: { category: 'message' } } } },
        })}
      />,
    );

    await vi.waitFor(() => {
      expect(manager.handleInitialUrl).toHaveBeenCalledWith('myapp://profile');
      expect(manager.handleLastNotificationResponse).toHaveBeenCalledTimes(1);
    });
  });

  test('url event と通知 subscribe を登録する', async () => {
    const manager = {
      handleInitialUrl: vi.fn().mockResolvedValue(true),
      handleUrlEvent: vi.fn().mockResolvedValue(true),
      handleNotificationResponse: vi.fn().mockResolvedValue(true),
      handleLastNotificationResponse: vi.fn().mockResolvedValue(true),
      handleLoginStateChange: vi.fn().mockResolvedValue(undefined),
      resetInitialUrlGuard: vi.fn(),
    };

    let emitUrl: ((event: { url: string }) => void) | null = null;
    let emitNotification: ((response: NotificationResponseLike) => void) | null = null;

    render(
      <TestComponent
        manager={manager}
        subscribeUrlEvents={(handler) => {
          emitUrl = handler;
          return () => undefined;
        }}
        subscribeNotificationResponses={(handler) => {
          emitNotification = handler;
          return () => undefined;
        }}
      />,
    );

    if (!emitUrl || !emitNotification) {
      throw new Error('subscribers were not registered');
    }

    const urlHandler = emitUrl as (event: { url: string }) => void;
    const notificationHandler = emitNotification as (
      response: NotificationResponseLike,
    ) => void;

    urlHandler({ url: 'myapp://orders' });
    notificationHandler({ notification: { request: { content: { data: {} } } } });

    await vi.waitFor(() => {
      expect(manager.handleUrlEvent).toHaveBeenCalledWith({ url: 'myapp://orders' });
      expect(manager.handleNotificationResponse).toHaveBeenCalledTimes(1);
    });
  });

  test('ログイン状態の変化を manager に通知する', async () => {
    const manager = {
      handleInitialUrl: vi.fn().mockResolvedValue(true),
      handleUrlEvent: vi.fn().mockResolvedValue(true),
      handleNotificationResponse: vi.fn().mockResolvedValue(true),
      handleLastNotificationResponse: vi.fn().mockResolvedValue(true),
      handleLoginStateChange: vi.fn().mockResolvedValue(undefined),
      resetInitialUrlGuard: vi.fn(),
    };

    const { rerender } = render(<TestComponent manager={manager} isLoggedIn={false} />);

    rerender(<TestComponent manager={manager} isLoggedIn={true} />);

    await vi.waitFor(() => {
      expect(manager.handleLoginStateChange).toHaveBeenCalledWith(false);
      expect(manager.handleLoginStateChange).toHaveBeenCalledWith(true);
    });
  });
});

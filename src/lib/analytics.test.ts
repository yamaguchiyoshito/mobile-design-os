import { afterEach, describe, expect, test, vi } from 'vitest';

import {
  analyticsService,
  configureAnalyticsAdapter,
  resetAnalyticsAdapter,
  sanitizeParams,
} from './analytics';

describe('analyticsService', () => {
  afterEach(() => {
    resetAnalyticsAdapter();
  });

  test('PII と object 値をフィルタリングする', () => {
    expect(
      sanitizeParams({
        method: 'email',
        email: 'test@example.com',
        value: 1200,
        meta: { nested: true },
      }),
    ).toEqual({
      method: 'email',
      value: 1200,
    });
  });

  test('purchase イベントを送信する', async () => {
    const logEvent = vi.fn().mockResolvedValue(undefined);
    configureAnalyticsAdapter({
      setUserId: vi.fn(),
      setUserProperty: vi.fn(),
      logEvent,
      logScreenView: vi.fn(),
      setEnabled: vi.fn(),
    });

    await analyticsService.logEvent('purchase', {
      transaction_id: 'txn-001',
      value: 1500,
      currency: 'JPY',
    });

    expect(logEvent).toHaveBeenCalledWith(
      'purchase',
      expect.objectContaining({ transaction_id: 'txn-001', value: 1500 }),
    );
  });
});

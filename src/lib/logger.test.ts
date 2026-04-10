import { afterEach, describe, expect, test, vi } from 'vitest';

import { logger } from './logger';
import { configureSentryAdapter, resetSentryAdapter } from './sentry';

describe('logger', () => {
  afterEach(() => {
    resetSentryAdapter();
  });

  test('error は breadcrumb と message を送る', async () => {
    const addBreadcrumb = vi.fn().mockResolvedValue(undefined);
    const captureMessage = vi.fn().mockResolvedValue(undefined);

    configureSentryAdapter({
      addBreadcrumb,
      captureMessage,
      captureException: vi.fn(),
      setUser: vi.fn(),
      setTag: vi.fn(),
    });

    logger.error('checkout failed', { orderId: 'order-1', email: 'private@example.com' });

    await vi.waitFor(() => {
      expect(addBreadcrumb).toHaveBeenCalledWith(
        expect.objectContaining({
          level: 'error',
          message: 'checkout failed',
        }),
      );
      expect(captureMessage).toHaveBeenCalledWith(
        'checkout failed',
        expect.objectContaining({
          level: 'error',
          extra: expect.objectContaining({ email: '[Filtered]' }),
        }),
      );
    });
  });

  test('capture は exception を送る', async () => {
    const captureException = vi.fn().mockResolvedValue(undefined);

    configureSentryAdapter({
      addBreadcrumb: vi.fn(),
      captureMessage: vi.fn(),
      captureException,
      setUser: vi.fn(),
      setTag: vi.fn(),
    });

    logger.capture(new Error('boom'), { token: 'secret' });

    await vi.waitFor(() => {
      expect(captureException).toHaveBeenCalledWith(
        expect.any(Error),
        expect.objectContaining({
          extra: expect.objectContaining({ token: '[Filtered]' }),
        }),
      );
    });
  });
});

import { afterEach, describe, expect, test, vi } from 'vitest';

import {
  configureSentryAdapter,
  resetSentryAdapter,
  sanitizeContext,
  sentryService,
} from './sentry';

describe('sentryService', () => {
  afterEach(() => {
    resetSentryAdapter();
  });

  test('PII をサニタイズする', () => {
    expect(
      sanitizeContext({
        email: 'user@example.com',
        token: 'secret-token',
        nested: {
          authorization: 'Bearer abc',
          safe: 'ok',
        },
      }),
    ).toEqual({
      email: '[Filtered]',
      token: '[Filtered]',
      nested: {
        authorization: '[Filtered]',
        safe: 'ok',
      },
    });
  });

  test('setUserId は匿名 ID のみを送る', async () => {
    const setUser = vi.fn().mockResolvedValue(undefined);

    configureSentryAdapter({
      addBreadcrumb: vi.fn(),
      captureMessage: vi.fn(),
      captureException: vi.fn(),
      setUser,
      setTag: vi.fn(),
    });

    await sentryService.setUserId('user-100');
    await sentryService.setUserId(null);

    expect(setUser).toHaveBeenNthCalledWith(1, { id: 'user-100' });
    expect(setUser).toHaveBeenNthCalledWith(2, null);
  });
});

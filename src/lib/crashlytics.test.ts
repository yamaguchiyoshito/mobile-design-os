import { afterEach, describe, expect, test, vi } from 'vitest';

import {
  configureCrashlyticsAdapter,
  crashlyticsService,
  getCrashlyticsDefaultAttributes,
  resetCrashlyticsAdapter,
} from './crashlytics';

describe('crashlyticsService', () => {
  afterEach(() => {
    resetCrashlyticsAdapter();
  });

  test('recordError で context をログに流す', async () => {
    const recordError = vi.fn().mockResolvedValue(undefined);
    const log = vi.fn().mockResolvedValue(undefined);

    configureCrashlyticsAdapter({
      setUserId: vi.fn(),
      setAttributes: vi.fn(),
      recordError,
      log,
      setCrashlyticsEnabled: vi.fn(),
    });

    await crashlyticsService.recordError(new Error('boom'), 'stack trace');

    expect(recordError).toHaveBeenCalled();
    expect(log).toHaveBeenCalledWith('Context: stack trace');
  });

  test('default attributes に env を含める', () => {
    expect(getCrashlyticsDefaultAttributes()).toEqual({
      app_env: expect.any(String),
      app_version: expect.any(String),
    });
  });
});

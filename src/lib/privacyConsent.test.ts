import { afterEach, describe, expect, test, vi } from 'vitest';

import * as analyticsModule from './analytics';
import * as crashlyticsModule from './crashlytics';
import {
  CONSENT_STORAGE_KEY,
  getConsentStatus,
  readConsentStatus,
  resetConsent,
  setConsent,
} from './privacyConsent';

describe('privacyConsent', () => {
  afterEach(async () => {
    window.localStorage.removeItem(CONSENT_STORAGE_KEY);
    await resetConsent();
    vi.restoreAllMocks();
  });

  test('未保存時は undetermined を返す', async () => {
    expect(readConsentStatus()).toBe('undetermined');
    await expect(getConsentStatus()).resolves.toBe('undetermined');
  });

  test('grant 時に analytics / crashlytics を有効化する', async () => {
    const setEnabled = vi
      .spyOn(analyticsModule.analyticsService, 'setEnabled')
      .mockResolvedValue(undefined);
    const setCrashlyticsEnabled = vi
      .spyOn(crashlyticsModule.crashlyticsService, 'setCrashlyticsEnabled')
      .mockResolvedValue(undefined);

    await setConsent('granted');

    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe('granted');
    expect(setEnabled).toHaveBeenCalledWith(true);
    expect(setCrashlyticsEnabled).toHaveBeenCalledWith(true);
  });

  test('deny 時に収集を停止する', async () => {
    const setEnabled = vi
      .spyOn(analyticsModule.analyticsService, 'setEnabled')
      .mockResolvedValue(undefined);
    const setCrashlyticsEnabled = vi
      .spyOn(crashlyticsModule.crashlyticsService, 'setCrashlyticsEnabled')
      .mockResolvedValue(undefined);

    await setConsent('denied');

    expect(window.localStorage.getItem(CONSENT_STORAGE_KEY)).toBe('denied');
    expect(setEnabled).toHaveBeenCalledWith(false);
    expect(setCrashlyticsEnabled).toHaveBeenCalledWith(false);
  });
});

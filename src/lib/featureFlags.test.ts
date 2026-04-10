import { describe, expect, test } from 'vitest';

import { getFeatureFlagMeta, isFeatureEnabled, listFeatureFlags } from './featureFlags';

describe('featureFlags', () => {
  test('フラグメタデータを返す', () => {
    expect(getFeatureFlagMeta('newCheckout')).toEqual(
      expect.objectContaining({
        owner: 'checkout-team',
        removeBy: '2026-09',
      }),
    );
  });

  test('フラグ一覧を返す', () => {
    expect(Object.keys(listFeatureFlags())).toEqual(
      expect.arrayContaining(['newCheckout', 'recommendations']),
    );
  });

  test('未設定時のデフォルトは false', () => {
    expect(isFeatureEnabled('newCheckout')).toBe(false);
    expect(isFeatureEnabled('recommendations')).toBe(false);
  });
});

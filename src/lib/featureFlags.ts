import { env } from './env';

const FLAGS = {
  newCheckout: {
    value: env.EXPO_PUBLIC_FEATURE_NEW_CHECKOUT === 'true',
    owner: 'checkout-team',
    removeBy: '2026-09',
    deprecated: false,
    description: '新チェックアウトフロー',
  },
  recommendations: {
    value: env.EXPO_PUBLIC_FEATURE_RECOMMENDATIONS === 'true',
    owner: 'discovery-team',
    removeBy: null,
    deprecated: false,
    description: 'レコメンデーション表示',
  },
} as const;

export type FeatureFlagKey = keyof typeof FLAGS;
export type FeatureFlagMeta = (typeof FLAGS)[FeatureFlagKey];
export type FeatureFlagOverrides = Partial<Record<FeatureFlagKey, boolean>>;

export function isFeatureEnabled(flag: FeatureFlagKey) {
  return FLAGS[flag].value;
}

export function getFeatureFlagMeta(flag: FeatureFlagKey) {
  return FLAGS[flag];
}

export function listFeatureFlags() {
  return FLAGS;
}

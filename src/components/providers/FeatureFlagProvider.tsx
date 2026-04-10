import { createContext, useContext, type ReactNode } from 'react';

import {
  type FeatureFlagKey,
  type FeatureFlagOverrides,
  isFeatureEnabled,
} from '../../lib/featureFlags';

const FeatureFlagContext = createContext<FeatureFlagOverrides>({});

export type FeatureFlagProviderProps = {
  overrides?: FeatureFlagOverrides;
  children: ReactNode;
};

export function FeatureFlagProvider({
  overrides = {},
  children,
}: FeatureFlagProviderProps) {
  return (
    <FeatureFlagContext.Provider value={overrides}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export function useFeatureFlag(flag: FeatureFlagKey) {
  const overrides = useContext(FeatureFlagContext);
  return overrides[flag] ?? isFeatureEnabled(flag);
}

export type FeatureGateProps = {
  flag: FeatureFlagKey;
  children: ReactNode;
  fallback?: ReactNode;
};

export function FeatureGate({ flag, children, fallback = null }: FeatureGateProps) {
  return useFeatureFlag(flag) ? <>{children}</> : <>{fallback}</>;
}

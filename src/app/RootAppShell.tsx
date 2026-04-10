import { useEffect, type ReactNode } from 'react';

import {
  AppErrorBoundary,
  FeatureFlagProvider,
  NotifyProvider,
  PrivacyConsentProvider,
  ThemeProvider,
} from '../components/providers';
import { useDeepLinkEntrypoints, type UseDeepLinkEntrypointsOptions } from '../hooks/useDeepLinkEntrypoints';
import { analyticsService } from '../lib/analytics';
import { crashlyticsService, getCrashlyticsDefaultAttributes } from '../lib/crashlytics';
import { env } from '../lib/env';
import type { FeatureFlagOverrides } from '../lib/featureFlags';
import { listFeatureFlags } from '../lib/featureFlags';
import { useNotifyDismissOnNavigate } from '../hooks/useNotifyDismissOnNavigate';
import { sentryService } from '../lib/sentry';
import { selectIsLoggedIn, selectUserId, useAuthStore } from '../stores/authStore';

export type RootAppShellProps = UseDeepLinkEntrypointsOptions & {
  children: ReactNode;
  pathname?: string;
  topBanner?: ReactNode;
  featureFlagOverrides?: FeatureFlagOverrides;
  analyticsScreenName?: string;
};

export function RootAppShell({
  children,
  pathname,
  topBanner,
  featureFlagOverrides,
  analyticsScreenName,
  ...entrypointOptions
}: RootAppShellProps) {
  const userId = useAuthStore(selectUserId);
  const isLoggedIn = useAuthStore(selectIsLoggedIn);
  useDeepLinkEntrypoints(entrypointOptions);
  useNotifyDismissOnNavigate(pathname);

  useEffect(() => {
    const screenName = analyticsScreenName ?? pathname;

    if (!screenName) {
      return;
    }

    void analyticsService.logScreenView(screenName);
  }, [analyticsScreenName, pathname]);

  useEffect(() => {
    void analyticsService.setUserId(userId);
    void sentryService.setUserId(userId);
  }, [userId]);

  useEffect(() => {
    if (isLoggedIn && userId) {
      void crashlyticsService.setUserId(userId);
      void crashlyticsService.setAttributes(getCrashlyticsDefaultAttributes());
      return;
    }

    void crashlyticsService.setUserId('');
  }, [isLoggedIn, userId]);

  useEffect(() => {
    if (!pathname) {
      return;
    }

    void sentryService.setTag('pathname', pathname);
  }, [pathname]);

  useEffect(() => {
    void sentryService.setTag('app_env', env.EXPO_PUBLIC_APP_ENV ?? 'development');
    void sentryService.setTag('app_version', env.EXPO_PUBLIC_APP_VERSION ?? 'unknown');

    const flags = listFeatureFlags();

    Object.entries(flags).forEach(([key, meta]) => {
      void sentryService.setTag(`flag_${key}`, meta.value ? 'on' : 'off');
    });
  }, []);

  return (
    <ThemeProvider>
      <AppErrorBoundary>
        <FeatureFlagProvider overrides={featureFlagOverrides}>
          <PrivacyConsentProvider>
            <NotifyProvider>
              <div style={{ minHeight: '100vh', display: 'grid', gridTemplateRows: 'auto 1fr' }}>
                {topBanner ? <div>{topBanner}</div> : null}
                <div>{children}</div>
              </div>
            </NotifyProvider>
          </PrivacyConsentProvider>
        </FeatureFlagProvider>
      </AppErrorBoundary>
    </ThemeProvider>
  );
}

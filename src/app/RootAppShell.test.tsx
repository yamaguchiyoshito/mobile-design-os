import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { authStore } from '../stores/authStore';
import * as analyticsModule from '../lib/analytics';
import * as crashlyticsModule from '../lib/crashlytics';
import * as sentryModule from '../lib/sentry';
import { themeStore } from '../stores/themeStore';
import { RootAppShell } from './RootAppShell';

describe('RootAppShell', () => {
  test('children と banner を描画し、entrypoint manager を起動する', async () => {
    const manager = {
      handleInitialUrl: vi.fn().mockResolvedValue(true),
      handleUrlEvent: vi.fn().mockResolvedValue(true),
      handleNotificationResponse: vi.fn().mockResolvedValue(true),
      handleLastNotificationResponse: vi.fn().mockResolvedValue(true),
      handleLoginStateChange: vi.fn().mockResolvedValue(undefined),
      resetInitialUrlGuard: vi.fn(),
    };

    const { getByText } = render(
      <RootAppShell
        manager={manager}
        pathname="/orders"
        topBanner={<div>banner</div>}
        getInitialUrl={async () => 'myapp://orders'}
      >
        <div>content</div>
      </RootAppShell>,
    );

    expect(getByText('banner')).toBeInTheDocument();
    expect(getByText('content')).toBeInTheDocument();

    await vi.waitFor(() => {
      expect(manager.handleInitialUrl).toHaveBeenCalledWith('myapp://orders');
    });
  });

  test('pathname と userId を analytics / crashlytics に流す', async () => {
    const logScreenView = vi
      .spyOn(analyticsModule.analyticsService, 'logScreenView')
      .mockResolvedValue(undefined);
    const setUserId = vi
      .spyOn(analyticsModule.analyticsService, 'setUserId')
      .mockResolvedValue(undefined);
    const setCrashlyticsUserId = vi
      .spyOn(crashlyticsModule.crashlyticsService, 'setUserId')
      .mockResolvedValue(undefined);
    const setCrashlyticsAttributes = vi
      .spyOn(crashlyticsModule.crashlyticsService, 'setAttributes')
      .mockResolvedValue(undefined);
    const setSentryUserId = vi
      .spyOn(sentryModule.sentryService, 'setUserId')
      .mockResolvedValue(undefined);
    const setSentryTag = vi
      .spyOn(sentryModule.sentryService, 'setTag')
      .mockResolvedValue(undefined);

    authStore.getState().login('user-101');
    themeStore.getState().setColorScheme('dark');

    const { container } = render(
      <RootAppShell pathname="/payment/result">
        <div>content</div>
      </RootAppShell>,
    );

    await vi.waitFor(() => {
      expect(logScreenView).toHaveBeenCalledWith('/payment/result');
      expect(setUserId).toHaveBeenCalledWith('user-101');
      expect(setCrashlyticsUserId).toHaveBeenCalledWith('user-101');
      expect(setCrashlyticsAttributes).toHaveBeenCalled();
      expect(setSentryUserId).toHaveBeenCalledWith('user-101');
      expect(setSentryTag).toHaveBeenCalledWith('pathname', '/payment/result');
      expect(setSentryTag).toHaveBeenCalledWith('app_env', expect.any(String));
      expect(setSentryTag).toHaveBeenCalledWith('app_version', expect.any(String));
      expect(setSentryTag).toHaveBeenCalledWith('flag_newCheckout', expect.any(String));
      expect(setSentryTag).toHaveBeenCalledWith('flag_recommendations', expect.any(String));
    });

    authStore.getState().reset();
    themeStore.getState().reset();

    expect(container.firstChild).toHaveAttribute('data-color-scheme', 'dark');
  });
});

import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { PrivacyConsentProvider, ThemeProvider } from '../../../components/providers';
import * as privacyConsentModule from '../../../lib/privacyConsent';
import { themeStore } from '../../../stores/themeStore';
import { AppPreferencesScreen } from './AppPreferencesScreen';

describe('AppPreferencesScreen', () => {
  afterEach(async () => {
    themeStore.getState().reset();
    await privacyConsentModule.resetConsent();
    vi.restoreAllMocks();
  });

  test('テーマ選択を store に反映する', () => {
    const onThemeChange = vi.fn();

    const { getByRole } = render(
      <ThemeProvider>
        <PrivacyConsentProvider>
          <AppPreferencesScreen onThemeChange={onThemeChange} />
        </PrivacyConsentProvider>
      </ThemeProvider>,
    );

    fireEvent.change(getByRole('combobox', { name: 'テーマを選択' }), {
      target: { value: 'dark' },
    });

    expect(themeStore.getState().colorScheme).toBe('dark');
    expect(onThemeChange).toHaveBeenCalledWith('dark');
  });

  test('同意トグルで denied に変更できる', async () => {
    await privacyConsentModule.setConsent('granted');
    const onConsentChange = vi.fn();

    const { getByRole } = render(
      <ThemeProvider>
        <PrivacyConsentProvider>
          <AppPreferencesScreen onConsentChange={onConsentChange} />
        </PrivacyConsentProvider>
      </ThemeProvider>,
    );

    fireEvent.click(getByRole('switch', { name: '匿名の利用分析と障害レポートを送信する' }));

    await vi.waitFor(() => {
      expect(onConsentChange).toHaveBeenCalledWith('denied');
    });
  });

  test('戻る導線を描画できる', () => {
    const onBack = vi.fn();

    const { getByRole } = render(
      <ThemeProvider>
        <PrivacyConsentProvider>
          <AppPreferencesScreen onBack={onBack} />
        </PrivacyConsentProvider>
      </ThemeProvider>,
    );

    fireEvent.click(getByRole('button', { name: 'プロフィールへ戻る' }));

    expect(onBack).toHaveBeenCalledTimes(1);
  });
});

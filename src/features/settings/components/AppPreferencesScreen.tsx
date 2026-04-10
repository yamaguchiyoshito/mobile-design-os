import { useState } from 'react';

import { MainLayout } from '../../../components/templates';
import { Banner, Button, Section, Select, Switch, Text } from '../../../components/ui';
import { usePrivacyConsent, useTheme } from '../../../components/providers';
import type { ThemePreference } from '../../../lib/theme';

export type AppPreferencesScreenProps = {
  onThemeChange?: (preference: ThemePreference) => void;
  onConsentChange?: (status: 'granted' | 'denied') => void;
  onBack?: () => void;
};

const themeOptions = [
  { value: 'system', label: 'システム設定に合わせる' },
  { value: 'light', label: 'ライト' },
  { value: 'dark', label: 'ダーク' },
] as const;

function isThemePreference(value: string): value is ThemePreference {
  return themeOptions.some((option) => option.value === value);
}

const resolvedThemeLabelMap = {
  light: '現在はライト表示です。',
  dark: '現在はダーク表示です。',
} as const;

export function AppPreferencesScreen({
  onThemeChange,
  onConsentChange,
  onBack,
}: AppPreferencesScreenProps) {
  const { preference, colorScheme, setPreference } = useTheme();
  const { status, setConsent } = usePrivacyConsent();
  const [isConsentPending, setIsConsentPending] = useState(false);

  const consentGranted = status === 'granted';
  const consentBannerType = consentGranted ? 'info' : 'warning';

  const handleThemeChange = (value: string) => {
    if (!isThemePreference(value)) {
      return;
    }

    setPreference(value);
    onThemeChange?.(value);
  };

  const handleConsentToggle = async (nextValue: boolean) => {
    const nextStatus = nextValue ? 'granted' : 'denied';
    setIsConsentPending(true);

    try {
      await setConsent(nextStatus);
      onConsentChange?.(nextStatus);
    } finally {
      setIsConsentPending(false);
    }
  };

  return (
    <MainLayout
      header={
        <div style={{ display: 'grid', gap: 4 }}>
          <Text as="h1" variant="headingMd">
            表示とプライバシー
          </Text>
          <Text as="p" variant="bodySm" tone="secondary">
            テーマと利用データ収集の設定をここで一元管理します。
          </Text>
        </div>
      }
      body={
        <div style={{ display: 'grid', gap: 16, maxWidth: 720 }}>
          <Section
            title="表示テーマ"
            description="ユーザー設定がシステム設定より優先されます。"
            aside={
              <Text as="span" variant="bodySm" tone="secondary">
                {resolvedThemeLabelMap[colorScheme]}
              </Text>
            }
          >
            <Select
              label="テーマを選択"
              value={preference}
              options={[...themeOptions]}
              onChange={handleThemeChange}
              description="画面全体の配色を即時に切り替えます。"
            />
          </Section>

          <Section
            title="利用分析と障害レポート"
            description="設定画面からいつでも同意を変更できます。未同意時は収集を開始しません。"
          >
            <div style={{ display: 'grid', gap: 16 }}>
              <Banner
                type={consentBannerType}
                message={
                  consentGranted
                    ? 'Analytics / Crashlytics の収集は有効です。'
                    : 'Analytics / Crashlytics の収集は無効です。'
                }
              />
              <Switch
                value={consentGranted}
                label="匿名の利用分析と障害レポートを送信する"
                description={
                  consentGranted
                    ? '同意済みです。必要であればここから撤回できます。'
                    : status === 'undetermined'
                      ? '初回選択前です。ここで有効化できます。'
                      : '現在は停止中です。必要なら再度有効化できます。'
                }
                disabled={isConsentPending}
                onChange={(nextValue) => {
                  void handleConsentToggle(nextValue);
                }}
              />
            </div>
          </Section>
        </div>
      }
      footer={
        onBack ? (
          <Button label="プロフィールへ戻る" variant="secondary" onPress={onBack} fullWidth />
        ) : undefined
      }
    />
  );
}

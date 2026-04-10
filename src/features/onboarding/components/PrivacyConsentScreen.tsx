import { useState } from 'react';

import { MainLayout } from '../../../components/templates';
import { Banner, Button, Card, Text } from '../../../components/ui';
import { usePrivacyConsent } from '../../../components/providers';

export type PrivacyConsentScreenProps = {
  onCompleted?: (status: 'granted' | 'denied') => void;
};

export function PrivacyConsentScreen({ onCompleted }: PrivacyConsentScreenProps) {
  const { status, setConsent } = usePrivacyConsent();
  const [pendingStatus, setPendingStatus] = useState<'granted' | 'denied' | null>(null);

  const handleConsent = async (nextStatus: 'granted' | 'denied') => {
    setPendingStatus(nextStatus);

    try {
      await setConsent(nextStatus);
      onCompleted?.(nextStatus);
    } finally {
      setPendingStatus(null);
    }
  };

  return (
    <MainLayout
      header={
        <div style={{ display: 'grid', gap: 4 }}>
          <Text as="h1" variant="headingMd">
            データ収集の同意設定
          </Text>
          <Text as="p" variant="bodySm" tone="secondary">
            利用状況の分析と障害調査を有効にするか、初回起動時に明示的に選択してください。
          </Text>
        </div>
      }
      body={
        <div style={{ display: 'grid', gap: 16, maxWidth: 680 }}>
          <Banner
            type={status === 'granted' ? 'info' : 'warning'}
            message={
              status === 'granted'
                ? '現在は Analytics / Crashlytics の収集が有効です。'
                : status === 'denied'
                  ? '現在は Analytics / Crashlytics の収集が無効です。'
                  : '未選択のため、現在はデータ収集を停止しています。'
            }
          />
          <Card
            title="収集対象"
            description="個人を直接特定する情報は送信せず、内部 ID と操作イベントのみを扱います。"
          >
            <div style={{ display: 'grid', gap: 12 }}>
              <Text as="p" variant="bodySm" tone="secondary">
                Analytics: 画面遷移、検索、購入などの匿名イベント
              </Text>
              <Text as="p" variant="bodySm" tone="secondary">
                Crashlytics: クラッシュ発生時の内部ユーザー ID、アプリ環境、バージョン
              </Text>
              <Text as="p" variant="bodySm" tone="secondary">
                同意はあとから設定画面で撤回できます。未同意時は収集を開始しません。
              </Text>
            </div>
          </Card>
        </div>
      }
      footer={
        <div style={{ display: 'grid', gap: 12 }}>
          <Button
            label="同意して続行"
            onPress={() => {
              void handleConsent('granted');
            }}
            loading={pendingStatus === 'granted'}
            fullWidth
          />
          <Button
            label="同意しない"
            variant="secondary"
            onPress={() => {
              void handleConsent('denied');
            }}
            loading={pendingStatus === 'denied'}
            fullWidth
          />
        </div>
      }
    />
  );
}

import { MainLayout } from '../../../components/templates';
import { Banner, Text } from '../../../components/ui';

export function NotificationsInboxScreen() {
  return (
    <MainLayout
      header={
        <Text as="h1" variant="headingMd">
          通知
        </Text>
      }
      body={
        <div style={{ display: 'grid', gap: 16 }}>
          <Banner type="warning" message="未読の重要通知が 2 件あります。" />
          <Text as="p" tone="secondary">
            配送遅延や決済確認などのイベントを一覧します。
          </Text>
        </div>
      }
    />
  );
}

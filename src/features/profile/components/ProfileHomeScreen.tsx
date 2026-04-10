import { MainLayout } from '../../../components/templates';
import { Banner, Button, Card, Text } from '../../../components/ui';

export type ProfileHomeScreenProps = {
  onOpenSettings: () => void;
};

export function ProfileHomeScreen({ onOpenSettings }: ProfileHomeScreenProps) {
  return (
    <MainLayout
      header={
        <Text as="h1" variant="headingMd">
          プロフィール
        </Text>
      }
      body={
        <div style={{ display: 'grid', gap: 16 }}>
          <Banner type="info" message="テーマ設定とデータ収集の同意はここから変更できます。" />
          <Card
            title="アプリ設定"
            description="表示テーマ、分析同意、障害レポート収集を管理します。"
            footer={<Button label="表示とプライバシー設定を開く" onPress={onOpenSettings} />}
          >
            <Text as="p" variant="bodySm" tone="secondary">
              初回同意後でも、この画面から収集同意をいつでも撤回できます。
            </Text>
          </Card>
        </div>
      }
    />
  );
}

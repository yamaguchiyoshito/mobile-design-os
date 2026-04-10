import type { ReactNode } from 'react';

import { MainLayout } from '../../../components/templates';
import { Banner, Button, Card, Text } from '../../../components/ui';
import { useAppRouter } from '../../../lib/appRouter';

export type PaymentResultStatus = 'success' | 'error' | 'cancelled';

export type PaymentResultScreenProps = {
  status: PaymentResultStatus;
  transactionId?: string;
  amountLabel?: string;
  errorMessage?: string;
  orderId?: string;
  primaryHref?: string;
  secondaryHref?: string;
  onPrimaryAction?: () => void;
  onSecondaryAction?: () => void;
};

type StatusConfig = {
  heading: string;
  description: string;
  bannerType: 'info' | 'warning' | 'error';
  bannerMessage: string;
  primaryLabel: string;
  secondaryLabel?: string;
};

const statusMap: Record<PaymentResultStatus, StatusConfig> = {
  success: {
    heading: 'お支払いが完了しました',
    description: '決済情報を確認し、必要であれば注文詳細へ進んでください。',
    bannerType: 'info',
    bannerMessage: '入金確認後に注文処理を開始します。',
    primaryLabel: 'ホームへ戻る',
    secondaryLabel: '注文詳細を見る',
  },
  error: {
    heading: 'お支払いを完了できませんでした',
    description: 'カード認証または通信状態を確認して、再試行してください。',
    bannerType: 'error',
    bannerMessage: '同じカードで複数回送信しないでください。',
    primaryLabel: 'もう一度試す',
    secondaryLabel: 'ホームへ戻る',
  },
  cancelled: {
    heading: 'お支払いを中断しました',
    description: 'この時点では注文は確定していません。内容を見直してから再開できます。',
    bannerType: 'warning',
    bannerMessage: '在庫は一定時間で解放される可能性があります。',
    primaryLabel: '決済に戻る',
    secondaryLabel: 'ホームへ戻る',
  },
};

function renderDetailRow(label: string, value?: string): ReactNode {
  if (!value) {
    return null;
  }

  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: 12,
      }}
    >
      <Text as="span" variant="bodySm" tone="secondary">
        {label}
      </Text>
      <Text as="span" variant="labelMd">
        {value}
      </Text>
    </div>
  );
}

export function PaymentResultScreen({
  status,
  transactionId,
  amountLabel,
  errorMessage,
  orderId,
  primaryHref,
  secondaryHref,
  onPrimaryAction,
  onSecondaryAction,
}: PaymentResultScreenProps) {
  const config = statusMap[status];
  const router = useAppRouter();

  const handlePrimaryAction = () => {
    if (primaryHref) {
      router.push(primaryHref);
      return;
    }

    onPrimaryAction?.();
  };

  const handleSecondaryAction = () => {
    if (secondaryHref) {
      router.push(secondaryHref);
      return;
    }

    onSecondaryAction?.();
  };

  return (
    <MainLayout
      header={
        <div style={{ display: 'grid', gap: 4 }}>
          <Text as="h1" variant="headingMd">
            {config.heading}
          </Text>
          <Text as="p" variant="bodySm" tone="secondary">
            {config.description}
          </Text>
        </div>
      }
      body={
        <div style={{ display: 'grid', gap: 16 }}>
          <Banner type={config.bannerType} message={config.bannerMessage} />
          <Card title="決済サマリー" description="結果とトランザクション情報を確認します。">
            <div style={{ display: 'grid', gap: 12 }}>
              {renderDetailRow('取引ID', transactionId)}
              {renderDetailRow('注文ID', orderId)}
              {renderDetailRow('金額', amountLabel)}
              {errorMessage ? (
                <Text as="p" variant="bodySm" tone="danger">
                  {errorMessage}
                </Text>
              ) : null}
            </div>
          </Card>
        </div>
      }
      footer={
        <div style={{ display: 'grid', gap: 12 }}>
          <Button label={config.primaryLabel} onPress={handlePrimaryAction} fullWidth />
          {config.secondaryLabel && (secondaryHref || onSecondaryAction) ? (
            <Button
              label={config.secondaryLabel}
              variant="secondary"
              onPress={handleSecondaryAction}
              fullWidth
            />
          ) : null}
        </div>
      }
    />
  );
}

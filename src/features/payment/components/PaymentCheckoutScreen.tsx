import { useEffect, useMemo } from 'react';

import { MainLayout } from '../../../components/templates';
import { Banner, Card, Text } from '../../../components/ui';
import { useFeatureFlag } from '../../../components/providers';
import { useAppRouter } from '../../../lib/appRouter';
import { sentryService } from '../../../lib/sentry';
import { PaymentWebView } from './PaymentWebView';

export type PaymentCheckoutScreenProps = {
  paymentUrl?: string;
  orderId?: string;
  amountLabel?: string;
};

function buildResultHref({
  status,
  transactionId,
  orderId,
  amountLabel,
  paymentUrl,
  errorMessage,
}: {
  status: 'success' | 'error' | 'cancelled';
  transactionId?: string;
  orderId?: string;
  amountLabel?: string;
  paymentUrl?: string;
  errorMessage?: string;
}) {
  const params = new URLSearchParams();

  if (transactionId) {
    params.set('transactionId', transactionId);
  }

  if (orderId) {
    params.set('orderId', orderId);
  }

  if (amountLabel) {
    params.set('amountLabel', amountLabel);
  }

  if (paymentUrl) {
    params.set('paymentUrl', paymentUrl);
  }

  if (errorMessage) {
    params.set('errorMessage', errorMessage);
  }

  return `/(main)/payment/result/${status}${params.size ? `?${params.toString()}` : ''}`;
}

export function PaymentCheckoutScreen({
  paymentUrl = 'https://payment.example.com/checkout',
  orderId = 'order-1001',
  amountLabel = '¥12,800',
}: PaymentCheckoutScreenProps) {
  const router = useAppRouter();
  const useNewCheckout = useFeatureFlag('newCheckout');
  const checkoutVariant = useMemo(
    () => (useNewCheckout ? 'new_checkout' : 'legacy_checkout'),
    [useNewCheckout],
  );

  useEffect(() => {
    void sentryService.setTag('checkout_variant', checkoutVariant);
  }, [checkoutVariant]);

  return (
    <MainLayout
      header={
        <div style={{ display: 'grid', gap: 4 }}>
          <Text as="h1" variant="headingMd">
            お支払い
          </Text>
          <Text as="p" variant="bodySm" tone="secondary">
            決済 WebView と結果画面は `appRouter` の route 制御に統一しています。
          </Text>
        </div>
      }
      body={
        <div style={{ display: 'grid', gap: 16 }}>
          <Banner
            type={useNewCheckout ? 'info' : 'warning'}
            message={
              useNewCheckout
                ? '新しいチェックアウトフローが有効です。'
                : '旧チェックアウトフローとして動作しています。'
            }
          />
          <Card title="決済概要" description="orderId と amount を結果 route に引き継ぎます。">
            <div style={{ display: 'grid', gap: 12 }}>
              <Text as="p" variant="bodySm" tone="secondary">
                注文ID: {orderId}
              </Text>
              <Text as="p" variant="bodySm" tone="secondary">
                金額: {amountLabel}
              </Text>
            </div>
          </Card>
          <PaymentWebView
            paymentUrl={paymentUrl}
            getAuthTokenSync={() => 'payment-token-001'}
            onSuccess={(transactionId) => {
              router.replace(
                buildResultHref({
                  status: 'success',
                  transactionId,
                  orderId,
                  amountLabel,
                  paymentUrl,
                }),
              );
            }}
            onError={(payload) => {
              router.replace(
                buildResultHref({
                  status: 'error',
                  orderId,
                  amountLabel,
                  paymentUrl,
                  errorMessage: payload.message,
                }),
              );
            }}
            onCancel={() => {
              router.replace(
                buildResultHref({
                  status: 'cancelled',
                  orderId,
                  amountLabel,
                  paymentUrl,
                }),
              );
            }}
          />
        </div>
      }
    />
  );
}

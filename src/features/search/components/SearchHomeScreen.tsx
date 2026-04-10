import { useEffect } from 'react';

import { MainLayout } from '../../../components/templates';
import { Button, Card, SearchBar, Text } from '../../../components/ui';
import { useFeatureFlag } from '../../../components/providers';
import { useAppRouter } from '../../../lib/appRouter';
import { sentryService } from '../../../lib/sentry';

export function SearchHomeScreen() {
  const router = useAppRouter();
  const showNewCheckout = useFeatureFlag('newCheckout');
  const showRecommendations = useFeatureFlag('recommendations');

  useEffect(() => {
    void sentryService.setTag('recommendations_variant', showRecommendations ? 'on' : 'off');
  }, [showRecommendations]);

  return (
    <MainLayout
      header={<SearchBar value="" onChangeText={() => undefined} />}
      body={
        <div style={{ display: 'grid', gap: 16 }}>
          <Text as="p" tone="secondary">
            検索キーワード、キャンペーン、注目商品を確認します。
          </Text>
          {showRecommendations ? (
            <Card title="おすすめ" description="recommendations flag が有効なときだけ描画します。">
              <Text as="p" variant="bodySm" tone="secondary">
                閲覧履歴に基づくおすすめ商品をここに表示します。
              </Text>
            </Card>
          ) : null}
          {showNewCheckout ? (
            <Card
              title="新チェックアウト"
              description="newCheckout flag が有効な場合の導線です。"
              footer={
                <Button
                  label="新しい決済フローを開く"
                  onPress={() => {
                    router.push('/(main)/payment/checkout?orderId=order-1001&amountLabel=%C2%A512,800');
                  }}
                />
              }
            >
              <Text as="p" variant="bodySm" tone="secondary">
                決済完了後は result route に正規化して遷移します。
              </Text>
            </Card>
          ) : null}
        </div>
      }
    />
  );
}

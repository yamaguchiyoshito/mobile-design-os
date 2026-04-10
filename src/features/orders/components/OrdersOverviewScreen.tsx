import { useMemo, useState } from 'react';

import { useTheme } from '../../../components/providers/ThemeProvider';
import { MainLayout } from '../../../components/templates';
import { Button, Card, SearchBar, Select, Text } from '../../../components/ui';
import { useOrderStore } from '../../../stores/orderStore';
import {
  getOrderRefundOverviewBadge,
  isOrderActionRequired,
  type OrderRecord,
} from '../lib/orderCatalog';

export type OrdersOverviewFilter = 'all' | 'action-required';
export type OrdersOverviewTab = 'all' | 'action-required' | 'refund' | 'payment';
export type OrdersOverviewSort = 'updated-desc' | 'updated-asc' | 'amount-desc' | 'amount-asc';

export type OrdersOverviewScreenProps = {
  onOpenOrder?: (orderId: string) => void;
  filter?: OrdersOverviewFilter;
  onChangeFilter?: (nextFilter: OrdersOverviewFilter) => void;
  tab?: OrdersOverviewTab;
  onChangeTab?: (nextTab: OrdersOverviewTab) => void;
  query?: string;
  onChangeQuery?: (nextQuery: string) => void;
  sort?: OrdersOverviewSort;
  onChangeSort?: (nextSort: OrdersOverviewSort) => void;
};

function parseAmountLabel(amountLabel: string) {
  const numeric = Number.parseInt(amountLabel.replace(/[^\d]/g, ''), 10);
  return Number.isNaN(numeric) ? 0 : numeric;
}

function isRefundWorkflowOrder(order: OrderRecord) {
  return !['未着手', '返金処理なし'].includes(order.refundStatus.statusLabel);
}

function isPaymentAttentionOrder(order: OrderRecord) {
  return (
    order.cancellationPolicy.action?.kind === 'payment_retry' || order.statusLabel.includes('お支払い待ち')
  );
}

function matchesTab(order: OrderRecord, tab: OrdersOverviewTab) {
  switch (tab) {
    case 'action-required':
      return isOrderActionRequired(order);
    case 'refund':
      return isRefundWorkflowOrder(order);
    case 'payment':
      return isPaymentAttentionOrder(order);
    default:
      return true;
  }
}

function matchesQuery(order: OrderRecord, query: string) {
  const normalizedQuery = query.trim().toLowerCase();

  if (!normalizedQuery.length) {
    return true;
  }

  return [order.id, order.title, order.address, order.amountLabel]
    .map((value) => value.toLowerCase())
    .some((value) => value.includes(normalizedQuery));
}

function compareOrders(left: OrderRecord, right: OrderRecord, sort: OrdersOverviewSort) {
  if (sort === 'updated-asc') {
    return left.updatedAt.localeCompare(right.updatedAt);
  }

  if (sort === 'amount-desc') {
    return parseAmountLabel(right.amountLabel) - parseAmountLabel(left.amountLabel);
  }

  if (sort === 'amount-asc') {
    return parseAmountLabel(left.amountLabel) - parseAmountLabel(right.amountLabel);
  }

  return right.updatedAt.localeCompare(left.updatedAt);
}

export function OrdersOverviewScreen({
  onOpenOrder,
  filter,
  onChangeFilter,
  tab,
  onChangeTab,
  query,
  onChangeQuery,
  sort,
  onChangeSort,
}: OrdersOverviewScreenProps) {
  const records = useOrderStore((snapshot) => snapshot.records);
  const [internalTab, setInternalTab] = useState<OrdersOverviewTab>('all');
  const [internalQuery, setInternalQuery] = useState('');
  const [internalSort, setInternalSort] = useState<OrdersOverviewSort>('updated-desc');
  const orders = useMemo(() => Object.values(records), [records]);
  const resolvedTab = tab ?? (filter === 'action-required' ? 'action-required' : internalTab);
  const resolvedQuery = query ?? internalQuery;
  const resolvedSort = sort ?? internalSort;
  const visibleOrders = useMemo(
    () =>
      [...orders]
        .filter((order) => matchesTab(order, resolvedTab))
        .filter((order) => matchesQuery(order, resolvedQuery))
        .sort((left, right) => compareOrders(left, right, resolvedSort)),
    [orders, resolvedQuery, resolvedSort, resolvedTab],
  );
  const { palette } = useTheme();

  const badgeToneMap = {
    warning: {
      backgroundColor: palette.surfaceSecondary,
      borderColor: '#F79009',
      color: '#B54708',
    },
    info: {
      backgroundColor: palette.surfaceSecondary,
      borderColor: '#2E90FA',
      color: '#175CD3',
    },
    success: {
      backgroundColor: palette.surfaceSecondary,
      borderColor: '#12B76A',
      color: '#027A48',
    },
  } as const;

  const handleTabChange = (nextTab: OrdersOverviewTab) => {
    setInternalTab(nextTab);
    onChangeTab?.(nextTab);

    if (nextTab === 'all' || nextTab === 'action-required') {
      onChangeFilter?.(nextTab);
    }
  };

  return (
    <MainLayout
      header={
        <Text as="h1" variant="headingMd">
          注文一覧
        </Text>
      }
      body={
        <div style={{ display: 'grid', gap: 16 }}>
          <Text as="p" tone="secondary">
            最新の注文状況と決済結果をここで確認します。
          </Text>
          <div style={{ display: 'grid', gap: 12 }}>
            <SearchBar
              value={resolvedQuery}
              onChangeText={(nextValue) => {
                setInternalQuery(nextValue);
                onChangeQuery?.(nextValue);
              }}
              placeholder="注文ID・商品名・住所で検索"
            />
            <Select
              label="並び順"
              value={resolvedSort}
              onChange={(value) => {
                const nextSort = value as OrdersOverviewSort;
                setInternalSort(nextSort);
                onChangeSort?.(nextSort);
              }}
              options={[
                { value: 'updated-desc', label: '更新日時が新しい順' },
                { value: 'updated-asc', label: '更新日時が古い順' },
                { value: 'amount-desc', label: '金額が高い順' },
                { value: 'amount-asc', label: '金額が低い順' },
              ]}
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
              <Button
                label="全件"
                variant={resolvedTab === 'all' ? 'primary' : 'secondary'}
                size="sm"
                onPress={() => {
                  handleTabChange('all');
                }}
              />
              <Button
                label="要対応のみ"
                variant={resolvedTab === 'action-required' ? 'primary' : 'secondary'}
                size="sm"
                onPress={() => {
                  handleTabChange('action-required');
                }}
              />
              <Button
                label="返金"
                variant={resolvedTab === 'refund' ? 'primary' : 'secondary'}
                size="sm"
                onPress={() => {
                  handleTabChange('refund');
                }}
              />
              <Button
                label="支払い"
                variant={resolvedTab === 'payment' ? 'primary' : 'secondary'}
                size="sm"
                onPress={() => {
                  handleTabChange('payment');
                }}
              />
              <Text as="span" variant="bodySm" tone="secondary">
                {visibleOrders.length}件表示 / 全{orders.length}件
              </Text>
            </div>
          </div>
          {visibleOrders.map((order) => {
            const refundBadge = getOrderRefundOverviewBadge(order);

            return (
              <Card
                key={order.id}
                title={order.title}
                description={`${order.id} / ${order.amountLabel}`}
                footer={
                  onOpenOrder ? (
                    <Button
                      label="注文詳細を見る"
                      variant="secondary"
                      onPress={() => {
                        onOpenOrder(order.id);
                      }}
                    />
                  ) : null
                }
              >
                <div style={{ display: 'grid', gap: 12 }}>
                  <Text as="p" variant="bodySm" tone="secondary">
                    {order.statusLabel}
                  </Text>
                  <Text as="p" variant="bodySm" tone="secondary">
                    {order.address}
                  </Text>
                  {refundBadge ? (
                    <div
                      style={{
                        display: 'inline-flex',
                        width: 'fit-content',
                        alignItems: 'center',
                        gap: 8,
                        borderRadius: 9999,
                        border: `1px solid ${badgeToneMap[refundBadge.tone].borderColor}`,
                        backgroundColor: badgeToneMap[refundBadge.tone].backgroundColor,
                        paddingInline: 10,
                        paddingBlock: 6,
                      }}
                    >
                      <Text
                        as="span"
                        variant="labelSm"
                        style={{ color: badgeToneMap[refundBadge.tone].color }}
                      >
                        {refundBadge.label}
                      </Text>
                    </div>
                  ) : null}
                </div>
              </Card>
            );
          })}
        </div>
      }
    />
  );
}

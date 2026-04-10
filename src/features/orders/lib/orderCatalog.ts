export type OrderTimelineState = 'done' | 'current' | 'upcoming';

export type OrderTimelineItem = {
  label: string;
  timestampLabel: string;
  state: OrderTimelineState;
};

export type OrderPolicyAction =
  | { kind: 'cancel'; label: string }
  | { kind: 'payment_retry'; label: string }
  | { kind: 'cancel_revoke'; label: string };

export type OrderRefundAction =
  | { kind: 'void_complete'; label: string; variant?: 'primary' | 'secondary' }
  | { kind: 'refund_complete'; label: string; variant?: 'primary' | 'secondary' }
  | { kind: 'return_pending'; label: string; variant?: 'primary' | 'secondary' }
  | { kind: 'return_received'; label: string; variant?: 'primary' | 'secondary' }
  | { kind: 'return_refund_complete'; label: string; variant?: 'primary' | 'secondary' };

export type OrderEventLogEntry = {
  timestampLabel: string;
  categoryLabel: string;
  title: string;
  detail: string;
  actorLabel: string;
  sourceLabel: string;
  correlationId: string;
  authorLabel?: string;
  visibility?: 'public' | 'private';
};

export type OrderRefundStatus = {
  statusLabel: string;
  methodLabel: string;
  detail: string;
  expectedCompletionLabel?: string;
  note?: string;
  actions?: OrderRefundAction[];
};

export type OrderCancellationPolicy = {
  decisionLabel: string;
  reason: string;
  deadlineLabel?: string;
  note?: string;
  action?: OrderPolicyAction;
};

export type OrderRecord = {
  id: string;
  title: string;
  statusLabel: string;
  amountLabel: string;
  deliveryWindow: string;
  address: string;
  supportMessage: string;
  supportBannerType: 'info' | 'warning';
  version: number;
  etag: string;
  updatedAt: string;
  lastRequestId: string;
  cancellationPolicy: OrderCancellationPolicy;
  refundStatus: OrderRefundStatus;
  eventLog: OrderEventLogEntry[];
  timeline: OrderTimelineItem[];
};

export function buildOrderEtag(orderId: string, version: number) {
  return `W/"${orderId}-v${version}"`;
}

const ORDER_RECORDS: OrderRecord[] = [
  {
    id: 'order-1001',
    title: 'コーヒー豆スターターセット',
    statusLabel: '決済完了 / 出荷準備中',
    amountLabel: '¥12,800',
    deliveryWindow: '2026-04-13 18:00-20:00',
    address: '東京都千代田区丸の内1-1-1',
    supportMessage: '配送先変更は本日 12:00 まで可能です。',
    supportBannerType: 'warning',
    version: 1,
    etag: buildOrderEtag('order-1001', 1),
    updatedAt: '2026-04-11T09:40:00.000Z',
    lastRequestId: 'seed-order-1001',
    cancellationPolicy: {
      decisionLabel: 'キャンセル可能',
      reason: '配送会社への引き渡し前なので、オペレーター承認付きでキャンセルを受け付けできます。',
      deadlineLabel: '2026-04-11 12:00',
      note: '返金は与信取消で処理します。クーポン利用分は即時再発行されません。',
      action: { kind: 'cancel', label: '注文をキャンセルする' },
    },
    refundStatus: {
      statusLabel: '未着手',
      methodLabel: '与信取消',
      detail: 'キャンセル確定後、カード売上を確定させずに取り消します。',
      expectedCompletionLabel: 'キャンセル確定後 30 分以内',
      note: 'カード会社の利用明細反映は翌営業日以降になる場合があります。',
    },
    eventLog: [
      {
        timestampLabel: '2026-04-11 09:12',
        categoryLabel: '注文',
        title: '注文受付',
        detail: 'EC フロントから注文を受け付けました。',
        actorLabel: 'customer',
        sourceLabel: 'storefront-web',
        correlationId: 'seed-order-1001',
      },
      {
        timestampLabel: '2026-04-11 09:13',
        categoryLabel: '決済',
        title: 'カード与信確保',
        detail: 'カード与信を確保し、売上確定前の状態です。',
        actorLabel: 'payment-gateway',
        sourceLabel: 'payments-api',
        correlationId: 'seed-order-1001',
      },
      {
        timestampLabel: '2026-04-11 09:40',
        categoryLabel: '配送',
        title: '出荷準備開始',
        detail: '倉庫でピッキングを開始しました。',
        actorLabel: 'warehouse-bot',
        sourceLabel: 'fulfillment-core',
        correlationId: 'seed-order-1001',
      },
    ],
    timeline: [
      { label: '注文受付', timestampLabel: '2026-04-11 09:12', state: 'done' },
      { label: '決済承認', timestampLabel: '2026-04-11 09:13', state: 'done' },
      { label: '出荷準備', timestampLabel: '2026-04-11 09:40', state: 'current' },
      { label: '配送会社へ引き渡し', timestampLabel: '2026-04-11 15:00 予定', state: 'upcoming' },
    ],
  },
  {
    id: 'order-1002',
    title: 'ワイヤレスミルクフォーマー',
    statusLabel: '発送済み',
    amountLabel: '¥7,400',
    deliveryWindow: '2026-04-12 14:00-16:00',
    address: '東京都渋谷区桜丘町2-2-2',
    supportMessage: '配送状況の更新は 30 分ごとに反映されます。',
    supportBannerType: 'info',
    version: 1,
    etag: buildOrderEtag('order-1002', 1),
    updatedAt: '2026-04-11T09:05:00.000Z',
    lastRequestId: 'seed-order-1002',
    cancellationPolicy: {
      decisionLabel: 'キャンセル不可',
      reason: '配送会社へ引き渡し済みです。受取拒否ではなく返品フローへ切り替えてください。',
      note: '未開封返品のみ受け付けます。送料は購入者負担です。',
    },
    refundStatus: {
      statusLabel: '返品待ち',
      methodLabel: '返品受領後の返金',
      detail: '発送済みのため、返品受付が完了するまで返金処理は始まりません。',
      expectedCompletionLabel: '返品検品後 3-5 営業日',
      note: '配送料と一部手数料は返金対象外になる可能性があります。',
      actions: [{ kind: 'return_received', label: '返品受領を記録', variant: 'primary' }],
    },
    eventLog: [
      {
        timestampLabel: '2026-04-10 13:02',
        categoryLabel: '注文',
        title: '注文受付',
        detail: '購入処理が完了しました。',
        actorLabel: 'customer',
        sourceLabel: 'storefront-web',
        correlationId: 'seed-order-1002',
      },
      {
        timestampLabel: '2026-04-10 18:20',
        categoryLabel: '配送',
        title: '出荷完了',
        detail: '配送会社へ引き渡し済みです。',
        actorLabel: 'warehouse-bot',
        sourceLabel: 'fulfillment-core',
        correlationId: 'seed-order-1002',
      },
      {
        timestampLabel: '2026-04-11 07:10',
        categoryLabel: '配送',
        title: '配送中',
        detail: '最終拠点から配達店へ移動しています。',
        actorLabel: 'carrier-api',
        sourceLabel: 'lastmile-sync',
        correlationId: 'seed-order-1002',
      },
      {
        timestampLabel: '2026-04-11 09:05',
        categoryLabel: '返金',
        title: '返品受付',
        detail: 'サポート窓口で返品受付を完了しました。',
        actorLabel: 'support-agent',
        sourceLabel: 'support-console',
        correlationId: 'seed-order-1002',
      },
    ],
    timeline: [
      { label: '注文受付', timestampLabel: '2026-04-10 13:02', state: 'done' },
      { label: '決済承認', timestampLabel: '2026-04-10 13:03', state: 'done' },
      { label: '出荷完了', timestampLabel: '2026-04-10 18:20', state: 'done' },
      { label: '配送中', timestampLabel: '2026-04-11 07:10', state: 'current' },
    ],
  },
  {
    id: 'order-1003',
    title: '限定ブレンド 3 種セット',
    statusLabel: 'お支払い待ち',
    amountLabel: '¥5,600',
    deliveryWindow: '入金確認後に確定',
    address: '神奈川県横浜市西区みなとみらい3-3-3',
    supportMessage: '24 時間以内に入金がない場合は自動キャンセルされます。',
    supportBannerType: 'warning',
    version: 1,
    etag: buildOrderEtag('order-1003', 1),
    updatedAt: '2026-04-11T10:31:00.000Z',
    lastRequestId: 'seed-order-1003',
    cancellationPolicy: {
      decisionLabel: '自動失効待ち',
      reason: 'まだ決済が完了していません。明示的なキャンセル処理より、決済再開か自動失効待ちを優先します。',
      deadlineLabel: '2026-04-12 10:30',
      note: '在庫は入金完了まで確保されません。',
      action: { kind: 'payment_retry', label: '支払いを再開する' },
    },
    refundStatus: {
      statusLabel: '返金処理なし',
      methodLabel: '未課金',
      detail: '決済が未完了なので返金処理は発生しません。',
      note: '期限切れになった場合は注文が自動失効します。',
    },
    eventLog: [
      {
        timestampLabel: '2026-04-11 10:30',
        categoryLabel: '注文',
        title: '注文受付',
        detail: '決済待ち注文として作成されました。',
        actorLabel: 'customer',
        sourceLabel: 'storefront-web',
        correlationId: 'seed-order-1003',
      },
      {
        timestampLabel: '2026-04-11 10:31',
        categoryLabel: '決済',
        title: '支払い待機',
        detail: '入金またはカード認証完了待ちです。',
        actorLabel: 'payments-api',
        sourceLabel: 'checkout-service',
        correlationId: 'seed-order-1003',
      },
    ],
    timeline: [
      { label: '注文受付', timestampLabel: '2026-04-11 10:30', state: 'done' },
      { label: '決済待機', timestampLabel: '2026-04-11 10:31', state: 'current' },
      { label: '自動キャンセル', timestampLabel: '2026-04-12 10:30 予定', state: 'upcoming' },
    ],
  },
  {
    id: 'order-1004',
    title: 'ステンレスドリッパー',
    statusLabel: '配送完了 / 対応なし',
    amountLabel: '¥4,200',
    deliveryWindow: '2026-04-09 配送完了',
    address: '埼玉県さいたま市浦和区高砂4-4-4',
    supportMessage: 'この注文に追加対応はありません。',
    supportBannerType: 'info',
    version: 1,
    etag: buildOrderEtag('order-1004', 1),
    updatedAt: '2026-04-10T12:40:00.000Z',
    lastRequestId: 'seed-order-1004',
    cancellationPolicy: {
      decisionLabel: '対応不要',
      reason: '配送完了から一定期間が経過しており、現在受け付け可能な手続きはありません。',
      note: '問い合わせが必要な場合はサポート窓口へ連絡してください。',
    },
    refundStatus: {
      statusLabel: '返金処理なし',
      methodLabel: '処理完了',
      detail: '返金または返品処理は発生していません。',
      note: '購入履歴として保存されています。',
    },
    eventLog: [
      {
        timestampLabel: '2026-04-08 11:20',
        categoryLabel: '注文',
        title: '注文受付',
        detail: '購入処理が完了しました。',
        actorLabel: 'customer',
        sourceLabel: 'storefront-web',
        correlationId: 'seed-order-1004',
      },
      {
        timestampLabel: '2026-04-08 11:21',
        categoryLabel: '決済',
        title: '決済確定',
        detail: 'カード売上を確定しました。',
        actorLabel: 'payment-gateway',
        sourceLabel: 'payments-api',
        correlationId: 'seed-order-1004',
      },
      {
        timestampLabel: '2026-04-09 12:40',
        categoryLabel: '配送',
        title: '配送完了',
        detail: '配達完了を確認しました。',
        actorLabel: 'carrier-api',
        sourceLabel: 'lastmile-sync',
        correlationId: 'seed-order-1004',
      },
    ],
    timeline: [
      { label: '注文受付', timestampLabel: '2026-04-08 11:20', state: 'done' },
      { label: '決済確定', timestampLabel: '2026-04-08 11:21', state: 'done' },
      { label: '出荷完了', timestampLabel: '2026-04-08 16:00', state: 'done' },
      { label: '配送完了', timestampLabel: '2026-04-09 12:40', state: 'current' },
    ],
  },
] as const;

const ORDER_MAP = Object.fromEntries(ORDER_RECORDS.map((order) => [order.id, order])) as Record<
  string,
  OrderRecord
>;

function cloneOrderRecord(order: OrderRecord): OrderRecord {
  return {
    ...order,
    cancellationPolicy: { ...order.cancellationPolicy, action: order.cancellationPolicy.action },
    refundStatus: {
      ...order.refundStatus,
      actions: order.refundStatus.actions?.map((action) => ({ ...action })),
    },
    version: order.version,
    etag: order.etag,
    updatedAt: order.updatedAt,
    lastRequestId: order.lastRequestId,
    eventLog: order.eventLog.map((entry) => ({ ...entry })),
    timeline: order.timeline.map((item) => ({ ...item })),
  };
}

export function createOrderRecordMap() {
  return Object.fromEntries(
    ORDER_RECORDS.map((order) => [order.id, cloneOrderRecord(order)]),
  ) as Record<string, OrderRecord>;
}

export function listOrderRecords() {
  return ORDER_RECORDS.map(cloneOrderRecord);
}

export function getOrderRecord(orderId: string): OrderRecord {
  const existing = ORDER_MAP[orderId];

  if (existing) {
    return cloneOrderRecord(existing);
  }

  return {
    id: orderId,
    title: '注文情報',
    statusLabel: '確認中',
    amountLabel: '未確定',
    deliveryWindow: '調整中',
    address: '配送先情報を取得中です。',
    supportMessage: '注文情報の同期中です。しばらく待ってから再読み込みしてください。',
    supportBannerType: 'info',
    version: 1,
    etag: buildOrderEtag(orderId, 1),
    updatedAt: '2026-04-11T00:00:00.000Z',
    lastRequestId: `seed-${orderId}`,
    cancellationPolicy: {
      decisionLabel: '判定保留',
      reason: '注文状態の同期が完了していません。',
    },
    refundStatus: {
      statusLabel: '確認中',
      methodLabel: '判定待ち',
      detail: '返金方式を判定中です。',
    },
    eventLog: [
      {
        timestampLabel: '最新',
        categoryLabel: '同期',
        title: '注文同期中',
        detail: '注文状態の同期が完了していません。',
        actorLabel: 'orders-api',
        sourceLabel: 'orders-sync',
        correlationId: `seed-${orderId}`,
      },
    ],
    timeline: [{ label: '注文同期中', timestampLabel: '最新状態を取得中です', state: 'current' }],
  };
}

export function isOrderActionRequired(order: OrderRecord) {
  if (order.cancellationPolicy.action) {
    return true;
  }

  if (order.refundStatus.actions?.length) {
    return true;
  }

  return ['返金可否確認中', '返品待ち', '返品受領', '返金確定'].includes(
    order.refundStatus.statusLabel,
  );
}

export function getOrderRefundOverviewBadge(order: OrderRecord) {
  switch (order.refundStatus.statusLabel) {
    case '返金可否確認中':
    case '返品待ち':
      return { label: `返金対応: ${order.refundStatus.statusLabel}`, tone: 'warning' as const };
    case '返品受領':
    case '返金確定':
      return { label: `返金進行中: ${order.refundStatus.statusLabel}`, tone: 'info' as const };
    case '返金完了':
    case '与信取消完了':
      return { label: `返金完了: ${order.refundStatus.statusLabel}`, tone: 'success' as const };
    default:
      return null;
  }
}

import type { OrderEventLogEntry, OrderRecord } from './orderCatalog';
import { getOrderRecord } from './orderCatalog';
import { persistOrderMutation } from './orderApi';

function appendEvent(order: OrderRecord, entry: OrderEventLogEntry) {
  return [...order.eventLog, entry];
}

function buildCancelledTimeline(order: OrderRecord) {
  const completedItems = order.timeline
    .filter((item) => item.state === 'done')
    .map((item) => ({ ...item }));

  return [
    ...completedItems,
    {
      label: 'キャンセル申請受付',
      timestampLabel: '受付済み',
      state: 'current' as const,
    },
    {
      label: '返金可否の確認',
      timestampLabel: 'オペレーター確認中',
      state: 'upcoming' as const,
    },
  ];
}

function buildResolvedTimeline(order: OrderRecord, finalLabel: string, finalTimestampLabel: string) {
  return [
    ...order.timeline.map((item) => ({ ...item, state: 'done' as const })),
    {
      label: finalLabel,
      timestampLabel: finalTimestampLabel,
      state: 'current' as const,
    },
  ];
}

export async function submitOrderCancellation(order: OrderRecord): Promise<OrderRecord> {
  const nextOrder: OrderRecord = {
    ...order,
    statusLabel: 'キャンセル申請受付 / 返金確認中',
    supportMessage: 'キャンセル申請を受け付けました。返金可否の確認後に通知します。',
    supportBannerType: 'info',
    cancellationPolicy: {
      decisionLabel: '申請受付済み',
      reason: 'オペレーターが出荷可否と返金条件を確認しています。',
      note: '確定後に決済取消または返金処理へ進みます。',
      action: { kind: 'cancel_revoke', label: '申請を取り消す' },
    },
    refundStatus: {
      statusLabel: '返金可否確認中',
      methodLabel: '与信取消または返金',
      detail: '配送引き渡し状況に応じて与信取消か返金かを判定しています。',
      expectedCompletionLabel: 'オペレーター確認後 1 営業日以内',
      note: '返金確定後、カード会社への反映は 3-10 営業日です。',
      actions: [
        { kind: 'void_complete', label: '与信取消で完了', variant: 'secondary' },
        { kind: 'refund_complete', label: '返金確定に進める', variant: 'primary' },
        { kind: 'return_pending', label: '返品待ちへ変更', variant: 'secondary' },
      ],
    },
    eventLog: appendEvent(order, {
      timestampLabel: '申請時刻',
      categoryLabel: '返金',
      title: 'キャンセル申請受付',
      detail: '返金方式の判定キューへ追加しました。',
      actorLabel: 'customer',
      sourceLabel: 'orders-ui',
      correlationId: '',
    }),
    timeline: buildCancelledTimeline(order),
  };

  return persistOrderMutation('submit_cancellation', nextOrder, { expectedEtag: order.etag });
}

export async function revokeOrderCancellation(order: OrderRecord): Promise<OrderRecord> {
  return persistOrderMutation('revoke_cancellation', getOrderRecord(order.id), {
    expectedEtag: order.etag,
  });
}

export async function completeAuthorizationVoid(order: OrderRecord): Promise<OrderRecord> {
  const nextOrder: OrderRecord = {
    ...order,
    statusLabel: 'キャンセル確定 / 与信取消完了',
    supportMessage: '与信取消が完了しました。カード請求は発生しません。',
    supportBannerType: 'info',
    cancellationPolicy: {
      decisionLabel: 'キャンセル確定',
      reason: '与信取消が完了し、キャンセル処理は終了しています。',
      note: '明細反映まではカード会社により差があります。',
    },
    refundStatus: {
      statusLabel: '与信取消完了',
      methodLabel: '与信取消',
      detail: 'カード売上は確定されず、請求は発生しません。',
      expectedCompletionLabel: '処理完了',
      note: '利用明細から消えるまで 1-3 営業日かかる場合があります。',
    },
    eventLog: appendEvent(order, {
      timestampLabel: '完了時刻',
      categoryLabel: '返金',
      title: '与信取消完了',
      detail: 'カード与信を取り消し、請求を停止しました。',
      actorLabel: 'refund-ops',
      sourceLabel: 'orders-console',
      correlationId: '',
    }),
    timeline: buildResolvedTimeline(order, '与信取消完了', '処理完了'),
  };

  return persistOrderMutation('complete_authorization_void', nextOrder, { expectedEtag: order.etag });
}

export async function confirmOrderRefund(order: OrderRecord): Promise<OrderRecord> {
  const nextOrder: OrderRecord = {
    ...order,
    statusLabel: 'キャンセル確定 / 返金手配完了',
    supportMessage: '返金指示を送信しました。カード会社の反映をお待ちください。',
    supportBannerType: 'info',
    cancellationPolicy: {
      decisionLabel: 'キャンセル確定',
      reason: '返金処理を確定し、以降はカード会社の反映待ちです。',
      note: '返金反映には 3-10 営業日かかる場合があります。',
    },
    refundStatus: {
      statusLabel: '返金確定',
      methodLabel: 'カード返金',
      detail: 'カード会社へ返金指示を送信済みです。',
      expectedCompletionLabel: '3-10 営業日',
      note: 'カード会社の締め日により一度請求後に返金される場合があります。',
    },
    eventLog: appendEvent(order, {
      timestampLabel: '確定時刻',
      categoryLabel: '返金',
      title: '返金確定',
      detail: 'カード会社へ返金依頼を送信しました。',
      actorLabel: 'refund-ops',
      sourceLabel: 'refund-engine',
      correlationId: '',
    }),
    timeline: buildResolvedTimeline(order, '返金確定', '返金処理開始'),
  };

  return persistOrderMutation('confirm_refund', nextOrder, { expectedEtag: order.etag });
}

export async function markOrderReturnPending(order: OrderRecord): Promise<OrderRecord> {
  const nextOrder: OrderRecord = {
    ...order,
    statusLabel: 'キャンセル申請受付 / 返品待ち',
    supportMessage: '返品受領後に返金方式を最終確定します。追跡番号を保管してください。',
    supportBannerType: 'warning',
    cancellationPolicy: {
      decisionLabel: '返品待ち',
      reason: '商品返送を確認後に返金処理へ進みます。',
      note: '返送先ラベルをメールで送付済みです。',
    },
    refundStatus: {
      statusLabel: '返品待ち',
      methodLabel: '返品受領後の返金',
      detail: '倉庫で返品を受領し、検品完了後に返金方式を確定します。',
      expectedCompletionLabel: '返送到着後 3-5 営業日',
      note: '箱つぶれや付属品欠品があると減額になる場合があります。',
      actions: [{ kind: 'return_received', label: '返品受領を記録', variant: 'primary' }],
    },
    eventLog: appendEvent(order, {
      timestampLabel: '切替時刻',
      categoryLabel: '返金',
      title: '返品待ちへ変更',
      detail: '返品受領後に返金処理を進める運用へ切り替えました。',
      actorLabel: 'support-agent',
      sourceLabel: 'orders-console',
      correlationId: '',
    }),
    timeline: buildResolvedTimeline(order, '返品到着待ち', '返送待機中'),
  };

  return persistOrderMutation('mark_return_pending', nextOrder, { expectedEtag: order.etag });
}

export async function markOrderReturnReceived(order: OrderRecord): Promise<OrderRecord> {
  const nextOrder: OrderRecord = {
    ...order,
    statusLabel: '返品受領 / 検品中',
    supportMessage: '倉庫で返品を受領しました。検品完了後に返金処理へ進めます。',
    supportBannerType: 'info',
    cancellationPolicy: {
      decisionLabel: '返品受領',
      reason: '返品商品は倉庫へ到着済みです。検品結果に応じて返金を確定します。',
      note: '不足品がある場合は一部返金または返送になる場合があります。',
    },
    refundStatus: {
      statusLabel: '返品受領',
      methodLabel: '検品後返金',
      detail: '倉庫で返品を受領し、付属品と状態の確認を進めています。',
      expectedCompletionLabel: '受領後 1-2 営業日',
      note: '検品が完了したら返金処理を実行します。',
      actions: [{ kind: 'return_refund_complete', label: '返金完了に進める', variant: 'primary' }],
    },
    eventLog: appendEvent(order, {
      timestampLabel: '受領時刻',
      categoryLabel: '返金',
      title: '返品受領',
      detail: '倉庫で返品商品の受領を確認しました。',
      actorLabel: 'warehouse-bot',
      sourceLabel: 'returns-hub',
      correlationId: '',
    }),
    timeline: buildResolvedTimeline(order, '返品受領', '倉庫到着'),
  };

  return persistOrderMutation('mark_return_received', nextOrder, { expectedEtag: order.etag });
}

export async function completeReturnRefund(order: OrderRecord): Promise<OrderRecord> {
  const nextOrder: OrderRecord = {
    ...order,
    statusLabel: 'キャンセル確定 / 返品返金完了',
    supportMessage: '返品検品が完了し、返金処理を実行しました。反映まで数営業日かかります。',
    supportBannerType: 'info',
    cancellationPolicy: {
      decisionLabel: 'キャンセル確定',
      reason: '返品受領と検品が完了し、返金処理を実行済みです。',
      note: '返金反映まではカード会社または決済代行会社の処理待ちです。',
    },
    refundStatus: {
      statusLabel: '返金完了',
      methodLabel: '返品受領後返金',
      detail: '返品商品の検品完了後に返金処理を実行しました。',
      expectedCompletionLabel: '3-10 営業日',
      note: '反映タイミングはカード会社や銀行の締め日に依存します。',
    },
    eventLog: appendEvent(order, {
      timestampLabel: '実行時刻',
      categoryLabel: '返金',
      title: '返金完了',
      detail: '返品検品完了後、返金処理を実行しました。',
      actorLabel: 'refund-engine',
      sourceLabel: 'refund-settlement',
      correlationId: '',
    }),
    timeline: buildResolvedTimeline(order, '返金完了', '返金実行済み'),
  };

  return persistOrderMutation('complete_return_refund', nextOrder, { expectedEtag: order.etag });
}

export async function addOrderSupportNote(
  order: OrderRecord,
  note: string,
  metadata?: {
    authorLabel?: string;
    visibility?: 'public' | 'private';
  },
): Promise<OrderRecord> {
  const trimmedNote = note.trim();

  if (!trimmedNote.length) {
    throw new Error('Support note is empty');
  }

  const nextOrder: OrderRecord = {
    ...order,
    eventLog: appendEvent(order, {
      timestampLabel: '記録時刻',
      categoryLabel: 'サポート',
      title: 'サポートメモ',
      detail: trimmedNote,
      actorLabel: 'support-agent',
      sourceLabel: 'support-console',
      correlationId: '',
      authorLabel: metadata?.authorLabel?.trim() || 'CS Ops',
      visibility: metadata?.visibility ?? 'private',
    }),
  };

  return persistOrderMutation('add_support_note', nextOrder, { expectedEtag: order.etag });
}

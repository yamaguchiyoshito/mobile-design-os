import { describe, expect, test } from 'vitest';

import { getOrderRecord } from './orderCatalog';
import { OrderPreconditionError } from './orderApi';
import {
  addOrderSupportNote,
  completeAuthorizationVoid,
  completeReturnRefund,
  confirmOrderRefund,
  markOrderReturnPending,
  markOrderReturnReceived,
  revokeOrderCancellation,
  submitOrderCancellation,
} from './orderMutations';

describe('submitOrderCancellation', () => {
  test('キャンセル申請後の注文状態を返す', async () => {
    const order = getOrderRecord('order-1001');

    const updated = await submitOrderCancellation(order);

    expect(updated.statusLabel).toBe('キャンセル申請受付 / 返金確認中');
    expect(updated.cancellationPolicy.decisionLabel).toBe('申請受付済み');
    expect(updated.cancellationPolicy.action?.kind).toBe('cancel_revoke');
    expect(updated.refundStatus.statusLabel).toBe('返金可否確認中');
    expect(updated.timeline[updated.timeline.length - 1]?.label).toBe('返金可否の確認');
    expect(updated.lastRequestId).toMatch(/^req-submit_cancellation-/);
    expect(updated.version).toBe(2);
  });

  test('キャンセル申請の取り消しで初期状態へ戻す', async () => {
    const submitted = await submitOrderCancellation(getOrderRecord('order-1001'));
    const restored = await revokeOrderCancellation(submitted);

    expect(restored.statusLabel).toBe('決済完了 / 出荷準備中');
    expect(restored.cancellationPolicy.decisionLabel).toBe('キャンセル可能');
    expect(restored.refundStatus.statusLabel).toBe('未着手');
    expect(restored.version).toBe(3);
  });

  test('古い etag での取り消しは precondition error になる', async () => {
    const submitted = await submitOrderCancellation(getOrderRecord('order-1001'));

    await confirmOrderRefund(submitted);

    await expect(revokeOrderCancellation(submitted)).rejects.toBeInstanceOf(OrderPreconditionError);
  });

  test('与信取消完了へ更新できる', async () => {
    const order = await submitOrderCancellation(getOrderRecord('order-1001'));

    const updated = await completeAuthorizationVoid(order);

    expect(updated.refundStatus.statusLabel).toBe('与信取消完了');
    expect(updated.eventLog[updated.eventLog.length - 1]?.title).toBe('与信取消完了');
  });

  test('返金確定へ更新できる', async () => {
    const order = await submitOrderCancellation(getOrderRecord('order-1001'));

    const updated = await confirmOrderRefund(order);

    expect(updated.refundStatus.statusLabel).toBe('返金確定');
    expect(updated.eventLog[updated.eventLog.length - 1]?.title).toBe('返金確定');
  });

  test('返品待ちへ更新できる', async () => {
    const order = await submitOrderCancellation(getOrderRecord('order-1001'));

    const updated = await markOrderReturnPending(order);

    expect(updated.refundStatus.statusLabel).toBe('返品待ち');
    expect(updated.eventLog[updated.eventLog.length - 1]?.title).toBe('返品待ちへ変更');
    expect(updated.refundStatus.actions?.[0]?.kind).toBe('return_received');
  });

  test('返品受領へ更新できる', async () => {
    const order = await markOrderReturnPending(await submitOrderCancellation(getOrderRecord('order-1001')));

    const updated = await markOrderReturnReceived(order);

    expect(updated.refundStatus.statusLabel).toBe('返品受領');
    expect(updated.eventLog[updated.eventLog.length - 1]?.title).toBe('返品受領');
    expect(updated.refundStatus.actions?.[0]?.kind).toBe('return_refund_complete');
  });

  test('返品受領後に返金完了へ更新できる', async () => {
    const order = await markOrderReturnReceived(
      await markOrderReturnPending(await submitOrderCancellation(getOrderRecord('order-1001'))),
    );

    const updated = await completeReturnRefund(order);

    expect(updated.refundStatus.statusLabel).toBe('返金完了');
    expect(updated.eventLog[updated.eventLog.length - 1]?.title).toBe('返金完了');
  });

  test('サポートメモを event log へ追記できる', async () => {
    const order = getOrderRecord('order-1001');

    const updated = await addOrderSupportNote(order, '返送ラベルを送付済み', {
      authorLabel: 'CS Lead',
      visibility: 'public',
    });

    expect(updated.eventLog[updated.eventLog.length - 1]?.title).toBe('サポートメモ');
    expect(updated.eventLog[updated.eventLog.length - 1]?.detail).toBe('返送ラベルを送付済み');
    expect(updated.eventLog[updated.eventLog.length - 1]?.authorLabel).toBe('CS Lead');
    expect(updated.eventLog[updated.eventLog.length - 1]?.visibility).toBe('public');
    expect(updated.eventLog[updated.eventLog.length - 1]?.correlationId).toBe(updated.lastRequestId);
    expect(updated.version).toBe(2);
  });
});

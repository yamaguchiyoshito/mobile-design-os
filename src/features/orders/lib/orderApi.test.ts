import { describe, expect, test } from 'vitest';

import { getOrderRecord } from './orderCatalog';
import { OrderPreconditionError, fetchOrderSnapshot, persistOrderMutation } from './orderApi';

describe('orderApi', () => {
  test('persistOrderMutation は注文スナップショットを複製して返す', async () => {
    const order = getOrderRecord('order-1001');

    const persisted = await persistOrderMutation('submit_cancellation', order);

    expect(persisted.id).toBe(order.id);
    expect(persisted.statusLabel).toBe(order.statusLabel);
    expect(persisted.version).toBe(2);
    expect(persisted.etag).toBe('W/"order-1001-v2"');
    expect(persisted).not.toBe(order);
    expect(persisted.timeline).not.toBe(order.timeline);
    expect(persisted.eventLog).not.toBe(order.eventLog);
    expect(persisted.lastRequestId).toMatch(/^req-submit_cancellation-/);
    expect(persisted.updatedAt).not.toBe(order.updatedAt);
    expect(persisted.eventLog[persisted.eventLog.length - 1]?.correlationId).toBe(
      persisted.lastRequestId,
    );
  });

  test('fetchOrderSnapshot は初期注文状態を返す', async () => {
    const snapshot = await fetchOrderSnapshot('order-1002');

    expect(snapshot.id).toBe('order-1002');
    expect(snapshot.refundStatus.statusLabel).toBe('返品待ち');
    expect(snapshot.refundStatus.actions?.[0]?.kind).toBe('return_received');
    expect(snapshot.version).toBe(1);
    expect(snapshot.etag).toBe('W/"order-1002-v1"');
    expect(snapshot.lastRequestId).toMatch(/^req-fetch_order_snapshot-/);
  });

  test('expectedEtag が一致しない mutation は precondition error を返す', async () => {
    const order = getOrderRecord('order-1001');

    await expect(
      persistOrderMutation('submit_cancellation', order, { expectedEtag: 'W/"order-1001-v999"' }),
    ).rejects.toBeInstanceOf(OrderPreconditionError);
  });
});

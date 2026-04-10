import { afterEach, describe, expect, test } from 'vitest';

import { orderStore } from './orderStore';

describe('orderStore', () => {
  afterEach(() => {
    orderStore.getState().reset();
  });

  test('upsert で注文状態を更新できる', () => {
    const current = orderStore.getState().records['order-1001'];

    orderStore.getState().upsert({
      ...current,
      statusLabel: 'キャンセル申請受付 / 返金確認中',
    });

    expect(orderStore.getState().records['order-1001']?.statusLabel).toBe(
      'キャンセル申請受付 / 返金確認中',
    );
  });

  test('reset で初期状態へ戻る', () => {
    const current = orderStore.getState().records['order-1001'];

    orderStore.getState().upsert({
      ...current,
      statusLabel: '更新済み',
    });
    orderStore.getState().reset();

    expect(orderStore.getState().records['order-1001']?.statusLabel).toBe('決済完了 / 出荷準備中');
  });

  test('updatedAt が古い注文では上書きしない', () => {
    const current = orderStore.getState().records['order-1001'];

    orderStore.getState().upsert({
      ...current,
      statusLabel: '最新更新',
      updatedAt: '2026-04-11T12:00:00.000Z',
      lastRequestId: 'req-newer-0001',
    });

    orderStore.getState().upsert({
      ...current,
      statusLabel: '古い更新',
      updatedAt: '2026-04-11T08:00:00.000Z',
      lastRequestId: 'req-older-0001',
    });

    expect(orderStore.getState().records['order-1001']?.statusLabel).toBe('最新更新');
    expect(orderStore.getState().records['order-1001']?.lastRequestId).toBe('req-newer-0001');
  });

  test('version が古い注文では updatedAt が新しくても上書きしない', () => {
    const current = orderStore.getState().records['order-1001'];

    orderStore.getState().upsert({
      ...current,
      statusLabel: 'version-2',
      version: 2,
      etag: 'W/"order-1001-v2"',
      updatedAt: '2026-04-12T12:00:00.000Z',
      lastRequestId: 'req-v2-0001',
    });

    orderStore.getState().upsert({
      ...current,
      statusLabel: 'version-1-late',
      version: 1,
      etag: 'W/"order-1001-v1"',
      updatedAt: '2026-04-13T12:00:00.000Z',
      lastRequestId: 'req-v1-late-0001',
    });

    expect(orderStore.getState().records['order-1001']?.statusLabel).toBe('version-2');
    expect(orderStore.getState().records['order-1001']?.etag).toBe('W/"order-1001-v2"');
  });
});

import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { notify } from '../../../lib/notify';
import { orderStore } from '../../../stores/orderStore';
import { getOrderRecord } from '../lib/orderCatalog';
import { submitOrderCancellation } from '../lib/orderMutations';
import { OrderDetailScreen } from './OrderDetailScreen';

describe('OrderDetailScreen', () => {
  afterEach(() => {
    orderStore.getState().reset();
    vi.restoreAllMocks();
  });

  test('注文と決済の詳細を表示する', () => {
    const { getAllByText, getByRole, getByText } = render(
      <OrderDetailScreen
        orderId="order-1001"
        transactionId="txn-100"
        amountLabel="¥12,800"
        onBackToOrders={() => undefined}
      />,
    );

    expect(getByText('注文詳細')).toBeInTheDocument();
    expect(getByText('コーヒー豆スターターセット')).toBeInTheDocument();
    expect(getByText('txn-100')).toBeInTheDocument();
    expect(getByText('¥12,800')).toBeInTheDocument();
    expect(getByText('配送タイムライン')).toBeInTheDocument();
    expect(getByText('出荷準備')).toBeInTheDocument();
    expect(getByText('キャンセル可能')).toBeInTheDocument();
    expect(getByText('返金ステータス')).toBeInTheDocument();
    expect(getByText('未着手')).toBeInTheDocument();
    expect(getByText('W/"order-1001-v1"')).toBeInTheDocument();
    expect(getByText('2026-04-11T09:40:00.000Z')).toBeInTheDocument();
    expect(getByText('seed-order-1001')).toBeInTheDocument();
    expect(getByText('オペレーションログ')).toBeInTheDocument();
    expect(getByText('カード与信確保')).toBeInTheDocument();
    expect(getByText('actor: payment-gateway / source: payments-api')).toBeInTheDocument();
    expect(getAllByText('correlationId: seed-order-1001')).toHaveLength(3);
    expect(getByRole('button', { name: 'メモを記録する' })).toBeDisabled();
    expect(getByText('W/"order-1001-v1"').parentElement).toHaveStyle({
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 104px) minmax(0, 1fr)',
    });
  });

  test('一覧へ戻る操作を呼ぶ', () => {
    const onBackToOrders = vi.fn();
    const { getByRole } = render(
      <OrderDetailScreen orderId="order-1002" onBackToOrders={onBackToOrders} />,
    );

    fireEvent.click(getByRole('button', { name: '注文一覧へ戻る' }));

    expect(onBackToOrders).toHaveBeenCalledTimes(1);
  });

  test('未払い注文では支払い再開を呼ぶ', () => {
    const onResumePayment = vi.fn();
    const { getByRole } = render(
      <OrderDetailScreen
        orderId="order-1003"
        onBackToOrders={() => undefined}
        onResumePayment={onResumePayment}
      />,
    );

    fireEvent.click(getByRole('button', { name: '支払いを再開する' }));

    expect(onResumePayment).toHaveBeenCalledWith('order-1003', '¥5,600');
  });

  test('キャンセル可能な注文では確認ダイアログを開く', () => {
    const dialogSpy = vi.spyOn(notify, 'dialog').mockImplementation(() => undefined);
    const { getByRole } = render(
      <OrderDetailScreen orderId="order-1001" onBackToOrders={() => undefined} />,
    );

    fireEvent.click(getByRole('button', { name: '注文をキャンセルする' }));

    expect(dialogSpy).toHaveBeenCalledTimes(1);
    expect(dialogSpy.mock.calls[0]?.[0].title).toBe('キャンセル申請を確定しますか');
  });

  test('申請受付済み注文では取り消しダイアログを開く', async () => {
    const dialogSpy = vi.spyOn(notify, 'dialog').mockImplementation(() => undefined);
    const current = orderStore.getState().records['order-1001'];

    orderStore.getState().upsert({
      ...current,
      statusLabel: 'キャンセル申請受付 / 返金確認中',
      cancellationPolicy: {
        decisionLabel: '申請受付済み',
        reason: 'オペレーターが返金条件を確認しています。',
        action: { kind: 'cancel_revoke', label: '申請を取り消す' },
      },
      refundStatus: {
        statusLabel: '返金可否確認中',
        methodLabel: '与信取消または返金',
        detail: '返金方式を確認中です。',
      },
    });

    const { getByRole } = render(
      <OrderDetailScreen orderId="order-1001" onBackToOrders={() => undefined} />,
    );

    fireEvent.click(getByRole('button', { name: '申請を取り消す' }));

    expect(dialogSpy).toHaveBeenCalledTimes(1);
    expect(dialogSpy.mock.calls[0]?.[0].title).toBe('キャンセル申請を取り消しますか');
  });

  test('返金可否確認中では終端アクションを表示する', () => {
    const current = orderStore.getState().records['order-1001'];

    orderStore.getState().upsert({
      ...current,
      statusLabel: 'キャンセル申請受付 / 返金確認中',
      cancellationPolicy: {
        decisionLabel: '申請受付済み',
        reason: 'オペレーターが返金条件を確認しています。',
        action: { kind: 'cancel_revoke', label: '申請を取り消す' },
      },
      refundStatus: {
        statusLabel: '返金可否確認中',
        methodLabel: '与信取消または返金',
        detail: '返金方式を確認中です。',
        actions: [
          { kind: 'void_complete', label: '与信取消で完了', variant: 'secondary' },
          { kind: 'refund_complete', label: '返金確定に進める', variant: 'primary' },
          { kind: 'return_pending', label: '返品待ちへ変更', variant: 'secondary' },
        ],
      },
      eventLog: current.eventLog,
    });

    const { getByRole } = render(
      <OrderDetailScreen orderId="order-1001" onBackToOrders={() => undefined} />,
    );

    expect(getByRole('button', { name: '与信取消で完了' })).toBeInTheDocument();
    expect(getByRole('button', { name: '返金確定に進める' })).toBeInTheDocument();
    expect(getByRole('button', { name: '返品待ちへ変更' })).toBeInTheDocument();
  });

  test('返品待ちでは返品受領アクションを表示する', () => {
    const { getByRole } = render(
      <OrderDetailScreen orderId="order-1002" onBackToOrders={() => undefined} />,
    );

    expect(getByRole('button', { name: '返品受領を記録' })).toBeInTheDocument();
  });

  test('返品受領では返金完了アクションを表示する', () => {
    const current = orderStore.getState().records['order-1002'];

    orderStore.getState().upsert({
      ...current,
      statusLabel: '返品受領 / 検品中',
      cancellationPolicy: {
        decisionLabel: '返品受領',
        reason: '返品商品の検品を進めています。',
      },
      refundStatus: {
        statusLabel: '返品受領',
        methodLabel: '検品後返金',
        detail: '返品商品の受領を確認済みです。',
        actions: [{ kind: 'return_refund_complete', label: '返金完了に進める', variant: 'primary' }],
      },
    });

    const { getByRole } = render(
      <OrderDetailScreen orderId="order-1002" onBackToOrders={() => undefined} />,
    );

    expect(getByRole('button', { name: '返金完了に進める' })).toBeInTheDocument();
  });

  test('サポートメモを追加すると event log に統合される', async () => {
    const { findAllByText, findByText, getByRole } = render(
      <OrderDetailScreen orderId="order-1001" onBackToOrders={() => undefined} />,
    );

    fireEvent.change(getByRole('textbox', { name: '記録者' }), {
      target: { value: 'CS Lead' },
    });
    fireEvent.change(getByRole('combobox', { name: '公開範囲' }), {
      target: { value: 'public' },
    });
    fireEvent.change(getByRole('textbox', { name: 'サポートメモ' }), {
      target: { value: '返送ラベルを再送済み' },
    });
    fireEvent.click(getByRole('button', { name: 'メモを記録する' }));

    expect(await findByText('サポートメモ')).toBeInTheDocument();
    expect(await findByText('返送ラベルを再送済み')).toBeInTheDocument();
    expect(await findByText('actor: support-agent / source: support-console')).toBeInTheDocument();
    expect(
      await findByText('recorded by: CS Lead / visibility: 顧客共有可'),
    ).toBeInTheDocument();
  });

  test('stale etag で操作すると競合カードを表示して最新状態へ同期する', async () => {
    await submitOrderCancellation(getOrderRecord('order-1001'));
    vi.spyOn(notify, 'warning').mockImplementation(() => undefined);
    vi.spyOn(notify, 'dialog').mockImplementation((options) => {
      void options.onConfirm();
    });

    const { findAllByText, findByText, getByRole } = render(
      <OrderDetailScreen orderId="order-1001" onBackToOrders={() => undefined} />,
    );

    fireEvent.click(getByRole('button', { name: '注文をキャンセルする' }));

    expect(await findByText('同時更新を検知')).toBeInTheDocument();
    expect(await findAllByText('W/"order-1001-v2"')).toHaveLength(2);
    expect(await findByText('申請受付済み')).toBeInTheDocument();
  });
});

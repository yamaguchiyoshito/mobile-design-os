import { render, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { notify } from '../../../lib/notify';
import { PaymentCheckoutScreen } from './PaymentCheckoutScreen';

function dispatchBridgeMessage(message: Record<string, unknown>) {
  window.dispatchEvent(
    new MessageEvent('message', {
      data: JSON.stringify(message),
    }),
  );
}

describe('PaymentCheckoutScreen', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/');
    vi.restoreAllMocks();
  });

  test('決済成功時に success route へ置換する', async () => {
    render(
      <PaymentCheckoutScreen
        paymentUrl="https://payment.example.com/checkout"
        orderId="order-1001"
        amountLabel="¥12,800"
      />,
    );

    dispatchBridgeMessage({
      type: 'PAYMENT_SUCCESS',
      payload: { transactionId: 'txn-100' },
    });

    await waitFor(() => {
      expect(window.location.pathname).toBe('/(main)/payment/result/success');
      expect(new URLSearchParams(window.location.search).get('transactionId')).toBe('txn-100');
      expect(new URLSearchParams(window.location.search).get('orderId')).toBe('order-1001');
      expect(new URLSearchParams(window.location.search).get('amountLabel')).toBe('¥12,800');
      expect(new URLSearchParams(window.location.search).get('paymentUrl')).toBe(
        'https://payment.example.com/checkout',
      );
    });
  });

  test('決済失敗時に error route へ置換する', async () => {
    const notifySpy = vi.spyOn(notify, 'error').mockImplementation(() => undefined);

    render(
      <PaymentCheckoutScreen
        paymentUrl="https://payment.example.com/checkout"
        orderId="order-1001"
        amountLabel="¥12,800"
      />,
    );

    dispatchBridgeMessage({
      type: 'PAYMENT_ERROR',
      payload: { code: 'DECLINED', message: 'カード認証に失敗しました' },
    });

    await waitFor(() => {
      expect(notifySpy).toHaveBeenCalledWith('カード認証に失敗しました');
      expect(window.location.pathname).toBe('/(main)/payment/result/error');
      expect(new URLSearchParams(window.location.search).get('errorMessage')).toBe(
        'カード認証に失敗しました',
      );
      expect(new URLSearchParams(window.location.search).get('paymentUrl')).toBe(
        'https://payment.example.com/checkout',
      );
    });
  });

  test('キャンセル時に cancelled route へ置換する', async () => {
    render(
      <PaymentCheckoutScreen
        paymentUrl="https://payment.example.com/checkout"
        orderId="order-1001"
        amountLabel="¥12,800"
      />,
    );

    dispatchBridgeMessage({
      type: 'PAYMENT_CANCEL',
    });

    await waitFor(() => {
      expect(window.location.pathname).toBe('/(main)/payment/result/cancelled');
      expect(new URLSearchParams(window.location.search).get('orderId')).toBe('order-1001');
      expect(new URLSearchParams(window.location.search).get('paymentUrl')).toBe(
        'https://payment.example.com/checkout',
      );
    });
  });
});

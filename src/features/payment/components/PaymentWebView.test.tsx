import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { notify } from '../../../lib/notify';
import { PaymentWebView } from './PaymentWebView';

describe('PaymentWebView', () => {
  test('READY で INIT script を生成する', async () => {
    const onInitScriptReady = vi.fn();

    render(
      <PaymentWebView
        paymentUrl="https://payment.example.com/checkout"
        getAuthTokenSync={() => 'token-1'}
        onInitScriptReady={onInitScriptReady}
        onSuccess={() => undefined}
        onCancel={() => undefined}
      />,
    );

    window.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify({ type: 'READY' }),
      }),
    );

    await vi.waitFor(() => {
      expect(onInitScriptReady).toHaveBeenCalledTimes(1);
      expect(onInitScriptReady.mock.calls[0]?.[0]).toContain('"authToken":"token-1"');
    });
  });

  test('PAYMENT_SUCCESS で onSuccess を呼ぶ', async () => {
    const onSuccess = vi.fn();

    render(
      <PaymentWebView
        paymentUrl="https://payment.example.com/checkout"
        onSuccess={onSuccess}
        onCancel={() => undefined}
      />,
    );

    window.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify({
          type: 'PAYMENT_SUCCESS',
          payload: { transactionId: 'txn-100' },
        }),
      }),
    );

    await vi.waitFor(() => {
      expect(onSuccess).toHaveBeenCalledWith('txn-100');
    });
  });

  test('PAYMENT_ERROR で notify.error と onCancel を呼ぶ', async () => {
    const onCancel = vi.fn();
    const notifySpy = vi.spyOn(notify, 'error').mockImplementation(() => undefined);

    render(
      <PaymentWebView
        paymentUrl="https://payment.example.com/checkout"
        onSuccess={() => undefined}
        onCancel={onCancel}
      />,
    );

    window.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify({
          type: 'PAYMENT_ERROR',
          payload: { code: 'DECLINED', message: '支払いに失敗しました' },
        }),
      }),
    );

    await vi.waitFor(() => {
      expect(notifySpy).toHaveBeenCalledWith('支払いに失敗しました');
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });

  test('PAYMENT_ERROR で onError があれば onCancel せずにそちらを呼ぶ', async () => {
    const onCancel = vi.fn();
    const onError = vi.fn();
    const notifySpy = vi.spyOn(notify, 'error').mockImplementation(() => undefined);

    render(
      <PaymentWebView
        paymentUrl="https://payment.example.com/checkout"
        onSuccess={() => undefined}
        onCancel={onCancel}
        onError={onError}
      />,
    );

    window.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify({
          type: 'PAYMENT_ERROR',
          payload: { code: 'DECLINED', message: '支払いに失敗しました' },
        }),
      }),
    );

    await vi.waitFor(() => {
      expect(notifySpy).toHaveBeenCalledWith('支払いに失敗しました');
      expect(onError).toHaveBeenCalledWith({
        code: 'DECLINED',
        message: '支払いに失敗しました',
      });
      expect(onCancel).not.toHaveBeenCalled();
    });
  });

  test('CLOSE で onCancel を呼ぶ', async () => {
    const onCancel = vi.fn();

    render(
      <PaymentWebView
        paymentUrl="https://payment.example.com/checkout"
        onSuccess={() => undefined}
        onCancel={onCancel}
      />,
    );

    window.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify({ type: 'CLOSE' }),
      }),
    );

    await vi.waitFor(() => {
      expect(onCancel).toHaveBeenCalledTimes(1);
    });
  });
});

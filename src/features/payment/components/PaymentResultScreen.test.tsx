import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import * as appRouterModule from '../../../lib/appRouter';
import { PaymentResultScreen } from './PaymentResultScreen';

describe('PaymentResultScreen', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  test('成功時のサマリーを表示する', () => {
    const { getByText } = render(
      <PaymentResultScreen
        status="success"
        transactionId="txn-001"
        orderId="order-1001"
        amountLabel="¥12,800"
        onPrimaryAction={() => undefined}
        onSecondaryAction={() => undefined}
      />,
    );

    expect(getByText('お支払いが完了しました')).toBeInTheDocument();
    expect(getByText('txn-001')).toBeInTheDocument();
    expect(getByText('¥12,800')).toBeInTheDocument();
  });

  test('error 時の action を呼ぶ', () => {
    const onPrimaryAction = vi.fn();
    const onSecondaryAction = vi.fn();
    const { getByRole } = render(
      <PaymentResultScreen
        status="error"
        errorMessage="認証に失敗しました"
        onPrimaryAction={onPrimaryAction}
        onSecondaryAction={onSecondaryAction}
      />,
    );

    fireEvent.click(getByRole('button', { name: 'もう一度試す' }));
    fireEvent.click(getByRole('button', { name: 'ホームへ戻る' }));

    expect(onPrimaryAction).toHaveBeenCalledTimes(1);
    expect(onSecondaryAction).toHaveBeenCalledTimes(1);
  });

  test('href 指定時は appRouter.push で遷移する', () => {
    const push = vi.fn();
    vi.spyOn(appRouterModule, 'useAppRouter').mockReturnValue({
      getHref: () => '/',
      getPathname: () => '/',
      getSearch: () => '',
      push,
      replace: vi.fn(),
      back: vi.fn(),
      subscribe: () => () => undefined,
    });

    const { getByRole } = render(
      <PaymentResultScreen
        status="cancelled"
        primaryHref="/(main)/payment/checkout?orderId=order-1001"
        secondaryHref="/(main)/search"
      />,
    );

    fireEvent.click(getByRole('button', { name: '決済に戻る' }));
    fireEvent.click(getByRole('button', { name: 'ホームへ戻る' }));

    expect(push).toHaveBeenNthCalledWith(1, '/(main)/payment/checkout?orderId=order-1001');
    expect(push).toHaveBeenNthCalledWith(2, '/(main)/search');
  });
});

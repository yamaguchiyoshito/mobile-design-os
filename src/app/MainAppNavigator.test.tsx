import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, test } from 'vitest';

import { MainAppNavigator } from './MainAppNavigator';
import { RootAppShell } from './RootAppShell';

describe('MainAppNavigator', () => {
  afterEach(() => {
    window.history.replaceState({}, '', '/');
  });

  test('プロフィールから設定画面へ遷移できる', async () => {
    window.history.replaceState({}, '', '/(main)/profile');

    const { getByRole, findByText } = render(
      <RootAppShell>
        <MainAppNavigator />
      </RootAppShell>,
    );

    fireEvent.click(getByRole('button', { name: '表示とプライバシー設定を開く' }));

    expect(await findByText('表示とプライバシー')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/(main)/profile/settings');
  });

  test('設定画面からプロフィールへ戻れる', async () => {
    window.history.replaceState({}, '', '/(main)/profile/settings');

    const { getByRole, findByText } = render(
      <RootAppShell>
        <MainAppNavigator />
      </RootAppShell>,
    );

    fireEvent.click(getByRole('button', { name: 'プロフィールへ戻る' }));

    expect(await findByText('プロフィール')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/(main)/profile');
  });

  test('payment checkout route で決済画面を表示する', async () => {
    window.history.replaceState(
      {},
      '',
      '/(main)/payment/checkout?orderId=order-1001&amountLabel=%C2%A512,800',
    );

    const { findByText } = render(
      <RootAppShell>
        <MainAppNavigator />
      </RootAppShell>,
    );

    expect(await findByText('お支払い')).toBeInTheDocument();
    expect(await findByText('注文ID: order-1001')).toBeInTheDocument();
    expect(await findByText('金額: ¥12,800')).toBeInTheDocument();
  });

  test('payment result route から再試行で checkout へ戻れる', async () => {
    window.history.replaceState(
      {},
      '',
      '/(main)/payment/result/error?orderId=order-1001&amountLabel=%C2%A512,800&errorMessage=%E8%AA%8D%E8%A8%BC%E3%81%AB%E5%A4%B1%E6%95%97%E3%81%97%E3%81%BE%E3%81%97%E3%81%9F',
    );

    const { getByRole, findByText } = render(
      <RootAppShell>
        <MainAppNavigator />
      </RootAppShell>,
    );

    expect(await findByText('お支払いを完了できませんでした')).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: 'もう一度試す' }));

    expect(await findByText('お支払い')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/(main)/payment/checkout');
    expect(new URLSearchParams(window.location.search).get('orderId')).toBe('order-1001');
    expect(new URLSearchParams(window.location.search).get('amountLabel')).toBe('¥12,800');
  });

  test('payment success route から注文詳細へ遷移できる', async () => {
    window.history.replaceState(
      {},
      '',
      '/(main)/payment/result/success?orderId=order-1001&transactionId=txn-100&amountLabel=%C2%A512,800',
    );

    const { getByRole, findByText } = render(
      <RootAppShell>
        <MainAppNavigator />
      </RootAppShell>,
    );

    expect(await findByText('お支払いが完了しました')).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: '注文詳細を見る' }));

    expect(await findByText('注文詳細')).toBeInTheDocument();
    expect(await findByText('コーヒー豆スターターセット')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/(main)/orders/order-1001');
    expect(new URLSearchParams(window.location.search).get('transactionId')).toBe('txn-100');
  });

  test('注文一覧から注文詳細へ遷移できる', async () => {
    window.history.replaceState({}, '', '/(main)/orders');

    const { getAllByRole, findByText } = render(
      <RootAppShell>
        <MainAppNavigator />
      </RootAppShell>,
    );

    fireEvent.click(getAllByRole('button', { name: '注文詳細を見る' })[0]!);

    expect(await findByText('注文詳細')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/(main)/orders/order-1003');
  });

  test('注文一覧の filter query を URL state として反映できる', async () => {
    window.history.replaceState({}, '', '/(main)/orders?filter=action-required');

    const { getByRole, queryByText } = render(
      <RootAppShell>
        <MainAppNavigator />
      </RootAppShell>,
    );

    expect(queryByText('ステンレスドリッパー')).not.toBeInTheDocument();
    expect(getByRole('button', { name: '要対応のみ' })).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: '全件' }));

    expect(window.location.pathname).toBe('/(main)/orders');
    expect(window.location.search).toBe('');
  });

  test('注文一覧の tab/q/sort query を URL state として初期表示できる', () => {
    window.history.replaceState(
      {},
      '',
      '/(main)/orders?tab=refund&q=%E3%83%AF%E3%82%A4%E3%83%A4%E3%83%AC%E3%82%B9&sort=amount-asc',
    );

    const { getByRole, queryByText } = render(
      <RootAppShell>
        <MainAppNavigator />
      </RootAppShell>,
    );

    expect(getByRole('searchbox', { name: '検索' })).toHaveValue('ワイヤレス');
    expect(getByRole('combobox', { name: '並び順' })).toHaveValue('amount-asc');
    expect(queryByText('ワイヤレスミルクフォーマー')).toBeInTheDocument();
    expect(queryByText('限定ブレンド 3 種セット')).not.toBeInTheDocument();
  });

  test('注文一覧の検索とタブ変更が URL state を更新する', () => {
    window.history.replaceState({}, '', '/(main)/orders');

    const { getByRole } = render(
      <RootAppShell>
        <MainAppNavigator />
      </RootAppShell>,
    );

    fireEvent.change(getByRole('searchbox', { name: '検索' }), {
      target: { value: 'ドリッパー' },
    });
    fireEvent.change(getByRole('combobox', { name: '並び順' }), {
      target: { value: 'amount-asc' },
    });
    fireEvent.click(getByRole('button', { name: '返金' }));

    const params = new URLSearchParams(window.location.search);
    expect(window.location.pathname).toBe('/(main)/orders');
    expect(params.get('tab')).toBe('refund');
    expect(params.get('q')).toBe('ドリッパー');
    expect(params.get('sort')).toBe('amount-asc');
  });

  test('未払い注文の詳細から決済フローを再開できる', async () => {
    window.history.replaceState({}, '', '/(main)/orders/order-1003');

    const { getByRole, findByText } = render(
      <RootAppShell>
        <MainAppNavigator />
      </RootAppShell>,
    );

    expect(await findByText('注文詳細')).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: '支払いを再開する' }));

    expect(await findByText('お支払い')).toBeInTheDocument();
    expect(window.location.pathname).toBe('/(main)/payment/checkout');
    expect(new URLSearchParams(window.location.search).get('orderId')).toBe('order-1003');
    expect(new URLSearchParams(window.location.search).get('amountLabel')).toBe('¥5,600');
  });

  test('キャンセル可能な注文で確認後に状態が更新される', async () => {
    window.history.replaceState({}, '', '/(main)/orders/order-1001');

    const { getByRole, findByRole, findByText } = render(
      <RootAppShell>
        <MainAppNavigator />
      </RootAppShell>,
    );

    fireEvent.click(getByRole('button', { name: '注文をキャンセルする' }));

    expect(await findByRole('dialog')).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: '申請する' }));

    expect(await findByText('キャンセル申請受付 / 返金確認中')).toBeInTheDocument();
    expect(await findByText('申請受付済み')).toBeInTheDocument();
    expect(await findByText('返金可否の確認')).toBeInTheDocument();
    expect(await findByText('返金可否確認中')).toBeInTheDocument();
  });

  test('キャンセル申請受付後に取り消して元の状態へ戻せる', async () => {
    window.history.replaceState({}, '', '/(main)/orders/order-1001');

    const { getByRole, findByRole, findByText, queryByText } = render(
      <RootAppShell>
        <MainAppNavigator />
      </RootAppShell>,
    );

    fireEvent.click(getByRole('button', { name: '注文をキャンセルする' }));
    expect(await findByRole('dialog')).toBeInTheDocument();
    fireEvent.click(getByRole('button', { name: '申請する' }));

    expect(await findByText('申請を取り消す')).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: '申請を取り消す' }));
    expect(await findByRole('dialog')).toBeInTheDocument();
    fireEvent.click(getByRole('button', { name: '取り消す' }));

    expect(await findByText('決済完了 / 出荷準備中')).toBeInTheDocument();
    expect(await findByText('キャンセル可能')).toBeInTheDocument();
    expect(await findByText('未着手')).toBeInTheDocument();
    expect(queryByText('申請受付済み')).not.toBeInTheDocument();
  });

  test('返金可否確認中から返金確定へ進められる', async () => {
    window.history.replaceState({}, '', '/(main)/orders/order-1001');

    const { getByRole, findByRole, findByText } = render(
      <RootAppShell>
        <MainAppNavigator />
      </RootAppShell>,
    );

    fireEvent.click(getByRole('button', { name: '注文をキャンセルする' }));
    expect(await findByRole('dialog')).toBeInTheDocument();
    fireEvent.click(getByRole('button', { name: '申請する' }));

    expect(await findByText('返金確定に進める')).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: '返金確定に進める' }));
    expect(await findByRole('dialog')).toBeInTheDocument();
    fireEvent.click(getByRole('button', { name: '返金確定' }));

    expect(await findByText('キャンセル確定 / 返金手配完了')).toBeInTheDocument();
    expect(await findByText('カード返金')).toBeInTheDocument();
    expect(
      await findByText('カード会社へ返金指示を送信済みです。'),
    ).toBeInTheDocument();
    expect(await findByText('オペレーションログ')).toBeInTheDocument();
    expect(await findByText('カード会社へ返金依頼を送信しました。')).toBeInTheDocument();
  });

  test('返品待ちから返品受領と返金完了へ進められる', async () => {
    window.history.replaceState({}, '', '/(main)/orders/order-1002');

    const { getByRole, findByRole, findByText } = render(
      <RootAppShell>
        <MainAppNavigator />
      </RootAppShell>,
    );

    expect(await findByText('返品受領を記録')).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: '返品受領を記録' }));
    expect(await findByRole('dialog')).toBeInTheDocument();
    fireEvent.click(getByRole('button', { name: '受領済みにする' }));

    expect(await findByText('返品受領 / 検品中')).toBeInTheDocument();
    expect(await findByText('返金完了に進める')).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: '返金完了に進める' }));
    expect(await findByRole('dialog')).toBeInTheDocument();
    fireEvent.click(getByRole('button', { name: '返金完了' }));

    expect(await findByText('キャンセル確定 / 返品返金完了')).toBeInTheDocument();
    expect(await findByText('返品商品の検品完了後に返金処理を実行しました。')).toBeInTheDocument();
  });
});

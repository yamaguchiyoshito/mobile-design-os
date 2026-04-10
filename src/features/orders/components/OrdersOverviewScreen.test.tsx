import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { OrdersOverviewScreen } from './OrdersOverviewScreen';

describe('OrdersOverviewScreen', () => {
  test('注文詳細を見るで選択した注文 ID を返す', () => {
    const onOpenOrder = vi.fn();
    const { getAllByRole } = render(<OrdersOverviewScreen onOpenOrder={onOpenOrder} />);

    fireEvent.click(getAllByRole('button', { name: '注文詳細を見る' })[0]!);

    expect(onOpenOrder).toHaveBeenCalledWith('order-1003');
  });

  test('返金進行中の注文には一覧バッジを表示する', () => {
    const { getByText } = render(<OrdersOverviewScreen />);

    expect(getByText('返金対応: 返品待ち')).toBeInTheDocument();
  });

  test('要対応のみで対応不要の注文を除外する', () => {
    const { getByRole, queryByText } = render(<OrdersOverviewScreen />);

    expect(queryByText('ステンレスドリッパー')).toBeInTheDocument();

    fireEvent.click(getByRole('button', { name: '要対応のみ' }));

    expect(queryByText('ステンレスドリッパー')).not.toBeInTheDocument();
  });

  test('filter prop で要対応のみを初期表示できる', () => {
    const { queryByText } = render(<OrdersOverviewScreen filter="action-required" />);

    expect(queryByText('ステンレスドリッパー')).not.toBeInTheDocument();
    expect(queryByText('限定ブレンド 3 種セット')).toBeInTheDocument();
  });

  test('tab/query/sort prop で URL state 相当の初期表示を再現できる', () => {
    const { getByRole, queryByText } = render(
      <OrdersOverviewScreen tab="refund" query="ワイヤレス" sort="amount-asc" />,
    );

    expect(getByRole('searchbox', { name: '検索' })).toHaveValue('ワイヤレス');
    expect(getByRole('combobox', { name: '並び順' })).toHaveValue('amount-asc');
    expect(queryByText('ワイヤレスミルクフォーマー')).toBeInTheDocument();
    expect(queryByText('限定ブレンド 3 種セット')).not.toBeInTheDocument();
  });

  test('検索入力で表示対象を絞り込める', () => {
    const { getByRole, queryByText } = render(<OrdersOverviewScreen />);

    fireEvent.change(getByRole('searchbox', { name: '検索' }), {
      target: { value: 'ドリッパー' },
    });

    expect(queryByText('ステンレスドリッパー')).toBeInTheDocument();
    expect(queryByText('コーヒー豆スターターセット')).not.toBeInTheDocument();
  });
});

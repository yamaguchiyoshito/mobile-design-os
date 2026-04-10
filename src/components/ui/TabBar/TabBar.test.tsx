import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { TabBar } from './TabBar';

const items = [
  { key: 'home', label: 'ホーム' },
  { key: 'search', label: '検索' },
  { key: 'profile', label: '設定', disabled: true },
];

describe('TabBar', () => {
  test('tablist と selected 状態を描画する', () => {
    const { getByRole } = render(
      <TabBar items={items} activeKey="home" onChange={() => undefined} />,
    );

    expect(getByRole('tablist', { name: 'メインナビゲーション' })).toBeInTheDocument();
    expect(getByRole('tab', { name: 'ホーム' })).toHaveAttribute('aria-selected', 'true');
  });

  test('選択可能なタブだけ onChange を呼ぶ', () => {
    const onChange = vi.fn();
    const { getByRole } = render(<TabBar items={items} activeKey="home" onChange={onChange} />);

    fireEvent.click(getByRole('tab', { name: '検索' }));
    fireEvent.click(getByRole('tab', { name: '設定' }));

    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange).toHaveBeenCalledWith('search');
  });
});

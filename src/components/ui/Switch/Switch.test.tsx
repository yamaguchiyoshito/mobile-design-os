import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { Switch } from './Switch';

describe('Switch', () => {
  test('switch ロールで描画してクリック時に次状態を返す', () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <Switch value={false} label="通知を受け取る" onChange={onChange} />,
    );

    fireEvent.click(getByRole('switch', { name: '通知を受け取る' }));

    expect(onChange).toHaveBeenCalledWith(true);
  });

  test('disabled のときは状態変更を通知しない', () => {
    const onChange = vi.fn();
    const { getByRole } = render(
      <Switch value={true} label="通知を受け取る" disabled onChange={onChange} />,
    );

    fireEvent.click(getByRole('switch', { name: '通知を受け取る' }));

    expect(onChange).not.toHaveBeenCalled();
  });

  test('長い文言でも本文とトグルをグリッドで保持する', () => {
    const { getByRole } = render(
      <Switch
        value={true}
        label="匿名の利用分析と障害レポートを送信する"
        description="同意済みです。必要であればここから撤回できます。"
        onChange={() => undefined}
      />,
    );

    expect(getByRole('switch', { name: '匿名の利用分析と障害レポートを送信する' })).toHaveStyle({
      display: 'grid',
      gridTemplateColumns: 'minmax(0, 1fr) auto',
    });
  });
});

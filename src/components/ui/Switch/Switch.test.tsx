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
});

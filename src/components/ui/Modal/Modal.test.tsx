import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { Modal } from './Modal';

describe('Modal', () => {
  test('visible=false のとき描画しない', () => {
    const { queryByRole } = render(
      <Modal visible={false} onClose={vi.fn()}>
        <div>content</div>
      </Modal>,
    );

    expect(queryByRole('dialog')).toBeNull();
  });

  test('dialog として表示し閉じる操作を受け付ける', () => {
    const onClose = vi.fn();
    const { getByRole } = render(
      <Modal visible onClose={onClose} title="利用規約">
        <div>content</div>
      </Modal>,
    );

    expect(getByRole('dialog', { name: '利用規約' })).toBeTruthy();

    fireEvent.click(getByRole('button', { name: '閉じる' }));

    expect(onClose).toHaveBeenCalledTimes(1);
  });
});

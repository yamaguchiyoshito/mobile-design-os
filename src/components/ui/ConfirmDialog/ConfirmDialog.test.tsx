import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { notifyStore } from '../../../stores/notifyStore';
import { ConfirmDialog } from './ConfirmDialog';

describe('ConfirmDialog', () => {
  afterEach(() => {
    notifyStore.getState().reset();
  });

  test('confirm で onConfirm を呼び dialog を閉じる', () => {
    const onConfirm = vi.fn();
    notifyStore.getState().pushDialog({
      title: '削除しますか？',
      message: 'この操作は取り消せません',
      confirmLabel: '削除する',
      cancelLabel: 'キャンセル',
      destructive: true,
      onConfirm,
    });

    const dialog = notifyStore.getState().dialog;
    if (!dialog) {
      throw new Error('dialog not initialized');
    }

    const { getByRole } = render(<ConfirmDialog item={dialog} />);
    fireEvent.click(getByRole('button', { name: '削除する' }));

    expect(onConfirm).toHaveBeenCalledTimes(1);
    expect(notifyStore.getState().dialog).toBeNull();
  });

  test('アクション群を可変幅グリッドで描画する', () => {
    notifyStore.getState().pushDialog({
      title: '削除しますか？',
      message: 'この操作は取り消せません',
      confirmLabel: '削除する',
      cancelLabel: 'キャンセル',
      destructive: true,
      onConfirm: () => undefined,
    });

    const dialog = notifyStore.getState().dialog;
    if (!dialog) {
      throw new Error('dialog not initialized');
    }

    const { getByRole } = render(<ConfirmDialog item={dialog} />);
    const actions = getByRole('button', { name: '削除する' }).parentElement;

    expect(actions).not.toBeNull();
    expect(actions).toHaveStyle({
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
    });
  });
});

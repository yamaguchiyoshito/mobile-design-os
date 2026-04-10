import { afterEach, describe, expect, test, vi } from 'vitest';

import { notifyStore } from './notifyStore';

describe('notifyStore', () => {
  afterEach(() => {
    notifyStore.getState().reset();
  });

  test('同一メッセージの連続投入を抑止する', () => {
    notifyStore.getState().push({ type: 'info', message: '同じです' });
    notifyStore.getState().push({ type: 'info', message: '同じです' });

    expect(notifyStore.getState().queue).toHaveLength(1);
  });

  test('キュー上限を超えたら先頭を破棄する', () => {
    notifyStore.getState().push({ type: 'info', message: '1' });
    notifyStore.getState().push({ type: 'info', message: '2' });
    notifyStore.getState().push({ type: 'info', message: '3' });
    notifyStore.getState().push({ type: 'info', message: '4' });

    expect(notifyStore.getState().queue).toHaveLength(3);
    expect(notifyStore.getState().queue[0]?.message).toBe('2');
  });

  test('dialog を設定して dismissDialog で閉じる', () => {
    notifyStore.getState().pushDialog({
      title: '確認',
      message: '実行しますか？',
      onConfirm: vi.fn(),
    });

    expect(notifyStore.getState().dialog?.title).toBe('確認');

    notifyStore.getState().dismissDialog();

    expect(notifyStore.getState().dialog).toBeNull();
  });
});

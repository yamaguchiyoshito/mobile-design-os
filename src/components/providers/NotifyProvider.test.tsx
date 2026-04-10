import { act, render } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import { notify } from '../../lib/notify';
import { notifyStore } from '../../stores/notifyStore';
import { NotifyProvider } from './NotifyProvider';

describe('NotifyProvider', () => {
  afterEach(() => {
    notifyStore.getState().reset();
    vi.useRealTimers();
  });

  test('notify.success で Toast を描画して自動 dismiss する', async () => {
    vi.useFakeTimers();

    const { getByRole, queryByRole } = render(
      <NotifyProvider>
        <div>content</div>
      </NotifyProvider>,
    );

    act(() => {
      notify.success('保存しました');
    });

    expect(getByRole('alert')).toHaveAttribute('aria-label', '保存しました');

    act(() => {
      vi.advanceTimersByTime(3000);
    });

    expect(notifyStore.getState().queue).toHaveLength(0);
    expect(queryByRole('alert')).toBeNull();
  });
});

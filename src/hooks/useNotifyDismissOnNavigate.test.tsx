import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { notify } from '../lib/notify';
import { useNotifyDismissOnNavigate } from './useNotifyDismissOnNavigate';

function TestComponent({ pathname }: { pathname: string }) {
  useNotifyDismissOnNavigate(pathname);
  return null;
}

describe('useNotifyDismissOnNavigate', () => {
  test('path 変更時に notify.dismiss を呼ぶ', () => {
    const dismissSpy = vi.spyOn(notify, 'dismiss');
    const { rerender } = render(<TestComponent pathname="/search" />);

    expect(dismissSpy).not.toHaveBeenCalled();

    rerender(<TestComponent pathname="/orders" />);

    expect(dismissSpy).toHaveBeenCalledTimes(1);

    dismissSpy.mockRestore();
  });
});

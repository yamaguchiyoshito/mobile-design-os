import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { Button } from './Button';

describe('Button', () => {
  test('クリックすると onPress が呼ばれる', () => {
    const onPress = vi.fn();
    const { getByRole } = render(<Button label="送信する" onPress={onPress} />);

    fireEvent.click(getByRole('button', { name: '送信する' }));

    expect(onPress).toHaveBeenCalledTimes(1);
  });

  test('disabled のとき onPress が呼ばれない', () => {
    const onPress = vi.fn();
    const { getByRole } = render(<Button label="送信する" onPress={onPress} disabled />);

    fireEvent.click(getByRole('button', { name: '送信する' }));

    expect(onPress).not.toHaveBeenCalled();
    expect(getByRole('button', { name: '送信する' })).toBeDisabled();
  });

  test('loading のとき onPress が呼ばれない', () => {
    const onPress = vi.fn();
    const { getByRole } = render(<Button label="送信する" onPress={onPress} loading />);

    fireEvent.click(getByRole('button', { name: '送信する' }));

    expect(onPress).not.toHaveBeenCalled();
    expect(getByRole('button', { name: '送信する' })).toHaveAttribute('aria-busy', 'true');
  });
});

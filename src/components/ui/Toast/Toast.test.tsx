import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { Toast } from './Toast';

describe('Toast', () => {
  test('error Toast は alert として描画する', () => {
    const { getByRole } = render(
      <Toast item={{ id: '1', type: 'error', message: 'エラーです' }} onDismiss={vi.fn()} />,
    );

    expect(getByRole('alert')).toBeTruthy();
  });

  test('error Toast は aria-live assertive', () => {
    const { getByRole } = render(
      <Toast item={{ id: '1', type: 'error', message: 'エラーです' }} onDismiss={vi.fn()} />,
    );

    expect(getByRole('alert')).toHaveAttribute('aria-live', 'assertive');
  });

  test('info Toast は aria-live polite', () => {
    const { getByRole } = render(
      <Toast item={{ id: '1', type: 'info', message: 'お知らせです' }} onDismiss={vi.fn()} />,
    );

    expect(getByRole('alert')).toHaveAttribute('aria-live', 'polite');
  });
});

import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { ErrorState } from './ErrorState';

describe('ErrorState', () => {
  test('再試行ボタンを表示できる', () => {
    const { getByRole } = render(
      <ErrorState message="注文一覧を取得できませんでした" onRetry={vi.fn()} />,
    );

    expect(getByRole('button', { name: '再試行' })).toBeTruthy();
  });

  test('accessibilityLabel にメッセージを設定する', () => {
    const { getByLabelText } = render(<ErrorState message="接続を確認してください" />);

    expect(getByLabelText('接続を確認してください')).toBeTruthy();
  });
});

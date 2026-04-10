import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { Banner } from './Banner';

describe('Banner', () => {
  test('warning Banner を status として表示する', () => {
    const { getByRole } = render(
      <Banner type="warning" message="現在オフラインです" />,
    );

    expect(getByRole('status')).toBeTruthy();
    expect(getByRole('status')).toHaveAttribute('aria-label', '現在オフラインです');
  });

  test('aria-live が polite に設定されている', () => {
    const { getByRole } = render(
      <Banner type="warning" message="現在オフラインです" />,
    );

    expect(getByRole('status')).toHaveAttribute('aria-live', 'polite');
  });

  test('action ボタンを押すと onPress が呼ばれる', () => {
    const onPress = vi.fn();
    const { getByRole } = render(
      <Banner
        type="info"
        message="この機能はプレビュー版です"
        action={{ label: '詳細を見る', onPress }}
      />,
    );

    getByRole('button', { name: '詳細を見る' }).click();

    expect(onPress).toHaveBeenCalledTimes(1);
  });
});

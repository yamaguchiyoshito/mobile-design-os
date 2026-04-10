import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { Skeleton } from './Skeleton';

describe('Skeleton', () => {
  test('スクリーンリーダー対象外として描画する', () => {
    const { getByTestId } = render(<Skeleton testID="loading-skeleton" />);

    expect(getByTestId('loading-skeleton')).toHaveAttribute('aria-hidden', 'true');
  });
});

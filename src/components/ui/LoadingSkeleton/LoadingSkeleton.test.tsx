import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { LoadingSkeleton } from './LoadingSkeleton';

describe('LoadingSkeleton', () => {
  test('読み込み status とカード数を描画する', () => {
    const { getByRole, getAllByTestId } = render(<LoadingSkeleton itemCount={2} />);

    expect(getByRole('status', { name: '読み込み中' })).toBeInTheDocument();
    expect(getAllByTestId('loading-skeleton-card')).toHaveLength(2);
  });
});

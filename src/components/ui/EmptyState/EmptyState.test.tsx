import { render } from '@testing-library/react';
import { describe, expect, test } from 'vitest';

import { EmptyState } from './EmptyState';

describe('EmptyState', () => {
  test('一覧 0 件時にタイトルと説明を表示する', () => {
    const { getByText } = render(
      <EmptyState title="検索結果がありません" description="別のキーワードで試してください" />,
    );

    expect(getByText('検索結果がありません')).toBeTruthy();
    expect(getByText('別のキーワードで試してください')).toBeTruthy();
  });
});

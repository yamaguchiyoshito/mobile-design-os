import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { ImagePreview } from './ImagePreview';

describe('ImagePreview', () => {
  test('プレビュー画像を代替テキスト付きで表示する', () => {
    const { getByAltText } = render(<ImagePreview uri="https://example.com/image.jpg" />);

    expect(getByAltText('選択した画像のプレビュー')).toBeTruthy();
  });

  test('削除ボタン押下を親へ伝える', () => {
    const onRemove = vi.fn();
    const { getByRole } = render(
      <ImagePreview uri="https://example.com/image.jpg" onRemove={onRemove} />,
    );

    fireEvent.click(getByRole('button', { name: '画像を削除' }));

    expect(onRemove).toHaveBeenCalledTimes(1);
  });
});

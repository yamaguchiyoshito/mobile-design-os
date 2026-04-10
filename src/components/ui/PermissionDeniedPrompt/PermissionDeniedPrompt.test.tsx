import { fireEvent, render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { PermissionDeniedPrompt } from './PermissionDeniedPrompt';

describe('PermissionDeniedPrompt', () => {
  test('alert として表示し、説明文を含む', () => {
    const { getByRole } = render(
      <PermissionDeniedPrompt
        featureName="カメラ"
        reason="プロフィール写真の撮影に使用します。"
        onOpenSettings={vi.fn()}
        onDismiss={vi.fn()}
      />,
    );

    expect(getByRole('alert')).toHaveAttribute(
      'aria-label',
      'カメラのアクセスが許可されていません。プロフィール写真の撮影に使用します。',
    );
  });

  test('ボタン押下を親へ伝える', () => {
    const onOpenSettings = vi.fn();
    const onDismiss = vi.fn();
    const { getByRole } = render(
      <PermissionDeniedPrompt
        featureName="カメラ"
        reason="プロフィール写真の撮影に使用します。"
        onOpenSettings={onOpenSettings}
        onDismiss={onDismiss}
      />,
    );

    fireEvent.click(getByRole('button', { name: '設定を開く' }));
    fireEvent.click(getByRole('button', { name: '後で' }));

    expect(onOpenSettings).toHaveBeenCalledTimes(1);
    expect(onDismiss).toHaveBeenCalledTimes(1);
  });
});

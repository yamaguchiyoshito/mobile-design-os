import { fireEvent, render, waitFor } from '@testing-library/react';
import { beforeEach, describe, expect, test, vi } from 'vitest';

import { WebViewContainer } from './WebViewContainer';

describe('WebViewContainer', () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  test('ロード完了前はローディングオーバーレイを表示する', () => {
    const { getByRole } = render(<WebViewContainer uri="https://example.com" />);

    expect(getByRole('progressbar')).toBeTruthy();
  });

  test('load でローディングオーバーレイが消える', async () => {
    const { container, queryByRole } = render(
      <WebViewContainer uri="https://example.com" />,
    );

    const iframe = container.querySelector('iframe');
    if (!iframe) {
      throw new Error('iframe not found');
    }

    fireEvent.load(iframe);

    await waitFor(() => {
      expect(queryByRole('progressbar')).toBeNull();
    });
  });

  test('error でエラー状態を表示する', async () => {
    const { container, findByRole } = render(
      <WebViewContainer uri="https://example.com" />,
    );

    const iframe = container.querySelector('iframe');
    if (!iframe) {
      throw new Error('iframe not found');
    }

    fireEvent.error(iframe);

    expect(await findByRole('button', { name: '再試行' })).toBeTruthy();
  });

  test('許可されていない origin は外部表示へ逃がす', async () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    const { findByRole } = render(
      <WebViewContainer
        uri="https://unauthorized.example.com"
        allowedOrigins={['https://example.com']}
      />,
    );

    expect(await findByRole('button', { name: '再試行' })).toBeTruthy();
    expect(openSpy).toHaveBeenCalledWith(
      'https://unauthorized.example.com',
      '_blank',
      'noopener,noreferrer',
    );
  });

  test('bridge の OPEN_EXTERNAL メッセージを外部表示へ委譲する', () => {
    const openSpy = vi.spyOn(window, 'open').mockImplementation(() => null);

    render(<WebViewContainer uri="https://example.com" />);

    window.dispatchEvent(
      new MessageEvent('message', {
        data: JSON.stringify({
          type: 'OPEN_EXTERNAL',
          payload: { url: 'https://billing.example.com' },
        }),
      }),
    );

    expect(openSpy).toHaveBeenCalledWith(
      'https://billing.example.com',
      '_blank',
      'noopener,noreferrer',
    );
  });
});

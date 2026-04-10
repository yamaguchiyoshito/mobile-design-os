import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { MainRouteGuard } from './MainRouteGuard';

describe('MainRouteGuard', () => {
  test('認証済みなら children を描画する', () => {
    const { getByText } = render(
      <MainRouteGuard isAuthenticated={true}>
        <div>main</div>
      </MainRouteGuard>,
    );

    expect(getByText('main')).toBeInTheDocument();
  });

  test('未認証なら fallback を表示し redirect を通知する', async () => {
    const onRedirect = vi.fn();
    const { getByText } = render(
      <MainRouteGuard
        isAuthenticated={false}
        fallback={<div>redirecting</div>}
        onRedirect={onRedirect}
      >
        <div>main</div>
      </MainRouteGuard>,
    );

    expect(getByText('redirecting')).toBeInTheDocument();

    await vi.waitFor(() => {
      expect(onRedirect).toHaveBeenCalledWith('/(auth)/login');
    });
  });
});

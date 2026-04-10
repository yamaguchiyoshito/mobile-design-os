import { render } from '@testing-library/react';
import { describe, expect, test, vi } from 'vitest';

import { AuthRouteGuard } from './AuthRouteGuard';

describe('AuthRouteGuard', () => {
  test('未認証なら children を描画する', () => {
    const { getByText } = render(
      <AuthRouteGuard isAuthenticated={false}>
        <div>auth</div>
      </AuthRouteGuard>,
    );

    expect(getByText('auth')).toBeInTheDocument();
  });

  test('認証済みなら fallback を表示し redirect を通知する', async () => {
    const onRedirect = vi.fn();
    const { getByText } = render(
      <AuthRouteGuard
        isAuthenticated={true}
        fallback={<div>redirecting</div>}
        onRedirect={onRedirect}
      >
        <div>auth</div>
      </AuthRouteGuard>,
    );

    expect(getByText('redirecting')).toBeInTheDocument();

    await vi.waitFor(() => {
      expect(onRedirect).toHaveBeenCalledWith('/');
    });
  });
});

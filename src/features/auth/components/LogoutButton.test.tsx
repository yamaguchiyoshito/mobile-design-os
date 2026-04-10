import { fireEvent, render } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

import * as appRouterModule from '../../../lib/appRouter';
import { authStore } from '../../../stores/authStore';
import * as logoutModule from '../../../lib/logout';
import { notify } from '../../../lib/notify';
import { LogoutButton } from './LogoutButton';

describe('LogoutButton', () => {
  afterEach(() => {
    authStore.getState().reset();
    vi.restoreAllMocks();
  });

  test('成功時に logout と完了コールバックを呼ぶ', async () => {
    const onCompleted = vi.fn();
    vi.spyOn(logoutModule, 'logoutWithCleanup').mockResolvedValue();
    const notifySpy = vi.spyOn(notify, 'info').mockImplementation(() => undefined);
    const replace = vi.fn();
    vi.spyOn(appRouterModule, 'useAppRouter').mockReturnValue({
      getHref: () => '/',
      getPathname: () => '/',
      getSearch: () => '',
      push: vi.fn(),
      replace,
      back: vi.fn(),
      subscribe: () => () => undefined,
    });

    const { getByRole } = render(<LogoutButton onCompleted={onCompleted} redirectTo="/(auth)/login" />);

    fireEvent.click(getByRole('button', { name: 'ログアウト' }));

    await vi.waitFor(() => {
      expect(logoutModule.logoutWithCleanup).toHaveBeenCalledTimes(1);
      expect(onCompleted).toHaveBeenCalledTimes(1);
      expect(notifySpy).toHaveBeenCalledWith('ログアウトしました');
      expect(replace).toHaveBeenCalledWith('/(auth)/login');
    });
  });

  test('失敗時に警告とエラー表示を出す', async () => {
    const onCompleted = vi.fn();
    const onError = vi.fn();
    vi.spyOn(logoutModule, 'logoutWithCleanup').mockRejectedValue(new Error('cleanup failed'));
    const notifySpy = vi.spyOn(notify, 'warning').mockImplementation(() => undefined);

    const { getByRole, findByRole } = render(
      <LogoutButton onCompleted={onCompleted} onError={onError} />,
    );

    fireEvent.click(getByRole('button', { name: 'ログアウト' }));

    expect(await findByRole('alert')).toHaveTextContent('セッションの終了処理に失敗しました');
    expect(notifySpy).toHaveBeenCalledWith('セッションの終了処理に失敗しました');
    expect(onCompleted).toHaveBeenCalledTimes(1);
    expect(onError).toHaveBeenCalledTimes(1);
  });
});

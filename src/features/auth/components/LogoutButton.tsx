import { useState } from 'react';

import { Button, FormError } from '../../../components/ui';
import { useAppRouter } from '../../../lib/appRouter';
import { notify } from '../../../lib/notify';
import { logoutWithCleanup } from '../../../lib/logout';

export type LogoutButtonProps = {
  label?: string;
  successMessage?: string;
  errorMessage?: string;
  redirectTo?: string;
  onCompleted?: () => void;
  onError?: (error: unknown) => void;
};

export function LogoutButton({
  label = 'ログアウト',
  successMessage = 'ログアウトしました',
  errorMessage = 'セッションの終了処理に失敗しました',
  redirectTo,
  onCompleted,
  onError,
}: LogoutButtonProps) {
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useAppRouter();

  const handlePress = async () => {
    setIsPending(true);
    setError(null);

    try {
      await logoutWithCleanup();
      notify.info(successMessage);
      if (redirectTo) {
        router.replace(redirectTo);
      }
      onCompleted?.();
    } catch (cause) {
      setError(errorMessage);
      notify.warning(errorMessage);
      onError?.(cause);
      if (redirectTo) {
        router.replace(redirectTo);
      }
      onCompleted?.();
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div style={{ display: 'grid', gap: 12, width: '100%' }}>
      <FormError message={error ?? undefined} />
      <Button
        label={label}
        variant="secondary"
        loading={isPending}
        fullWidth
        onPress={() => {
          void handlePress();
        }}
      />
    </div>
  );
}

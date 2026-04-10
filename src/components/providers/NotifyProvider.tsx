import { useEffect, type ReactNode } from 'react';

import { useNotifyStore } from '../../stores/notifyStore';
import { ConfirmDialog } from '../ui/ConfirmDialog';
import { Snackbar } from '../ui/Snackbar';
import { Toast } from '../ui/Toast';

const DURATION = {
  success: 3000,
  info: 3000,
  warning: 5000,
  error: 5000,
  snackbar: 5000,
} as const;

export type NotifyProviderProps = {
  children: ReactNode;
};

export function NotifyProvider({ children }: NotifyProviderProps) {
  const current = useNotifyStore((snapshot) => snapshot.queue[0] ?? null);
  const dialog = useNotifyStore((snapshot) => snapshot.dialog);
  const dismissById = useNotifyStore((snapshot) => snapshot.dismissById);

  useEffect(() => {
    if (!current) {
      return;
    }

    const ms = current.duration ?? DURATION[current.type];
    const timer = window.setTimeout(() => {
      dismissById(current.id);
    }, ms);

    return () => {
      window.clearTimeout(timer);
    };
  }, [current, dismissById]);

  return (
    <>
      {children}
      {current && current.type !== 'snackbar' ? (
        <Toast item={current} onDismiss={() => dismissById(current.id)} />
      ) : null}
      {current?.type === 'snackbar' ? (
        <Snackbar
          item={current as typeof current & { type: 'snackbar' }}
          onDismiss={() => dismissById(current.id)}
        />
      ) : null}
      {dialog ? <ConfirmDialog item={dialog} /> : null}
    </>
  );
}

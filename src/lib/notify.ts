import { notifyStore } from '../stores/notifyStore';

export type ToastOptions = {
  duration?: number;
  action?: {
    label: string;
    onPress: () => void;
  };
};

export type DialogOptions = {
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  destructive?: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
};

export type Notify = {
  success: (message: string, options?: ToastOptions) => void;
  error: (message: string, options?: ToastOptions) => void;
  warning: (message: string, options?: ToastOptions) => void;
  info: (message: string, options?: ToastOptions) => void;
  snackbar: (
    message: string,
    options: Required<Pick<ToastOptions, 'action'>> & ToastOptions,
  ) => void;
  dialog: (options: DialogOptions) => void;
  dismiss: () => void;
};

export const notify: Notify = {
  success: (message, options) =>
    notifyStore.getState().push({ type: 'success', message, ...options }),

  error: (message, options) =>
    notifyStore.getState().push({ type: 'error', message, ...options }),

  warning: (message, options) =>
    notifyStore.getState().push({ type: 'warning', message, ...options }),

  info: (message, options) =>
    notifyStore.getState().push({ type: 'info', message, ...options }),

  snackbar: (message, options) =>
    notifyStore.getState().push({ type: 'snackbar', message, ...options }),

  dialog: (options) => notifyStore.getState().pushDialog(options),

  dismiss: () => notifyStore.getState().dismiss(),
};

import { useSyncExternalStore } from 'react';

export type NotifyTone = 'success' | 'error' | 'warning' | 'info' | 'snackbar';

export type ToastAction = {
  label: string;
  onPress: () => void;
};

export type ToastItem = {
  id: string;
  type: NotifyTone;
  message: string;
  duration?: number;
  action?: ToastAction;
};

export type DialogItem = {
  title: string;
  message: string;
  confirmLabel: string;
  cancelLabel: string;
  destructive: boolean;
  onConfirm: () => void;
  onCancel?: () => void;
};

type NotifyState = {
  queue: ToastItem[];
  dialog: DialogItem | null;
};

type NotifyMethods = {
  push: (item: Omit<ToastItem, 'id'>) => void;
  pushDialog: (
    item: Omit<DialogItem, 'confirmLabel' | 'cancelLabel' | 'destructive'> & Partial<DialogItem>,
  ) => void;
  dismiss: () => void;
  dismissById: (id: string) => void;
  dismissDialog: () => void;
  reset: () => void;
};

type NotifySnapshot = NotifyState & NotifyMethods;
type Listener = () => void;

const QUEUE_MAX = 3;

let state: NotifyState = {
  queue: [],
  dialog: null,
};

const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function setState(next: NotifyState) {
  state = next;
  emit();
}

function createId() {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }

  return `notify-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

const methods: NotifyMethods = {
  push(item) {
    const last = state.queue.at(-1);
    if (last?.message === item.message && last.type === item.type) {
      return;
    }

    const nextItem: ToastItem = {
      ...item,
      id: createId(),
    };

    const nextQueue = [...state.queue, nextItem];
    setState({
      ...state,
      queue: nextQueue.length > QUEUE_MAX ? nextQueue.slice(-QUEUE_MAX) : nextQueue,
    });
  },

  pushDialog(item) {
    setState({
      ...state,
      dialog: {
        confirmLabel: '確認',
        cancelLabel: 'キャンセル',
        destructive: false,
        ...item,
      },
    });
  },

  dismiss() {
    setState({
      ...state,
      queue: state.queue.slice(1),
    });
  },

  dismissById(id) {
    setState({
      ...state,
      queue: state.queue.filter((entry) => entry.id !== id),
    });
  },

  dismissDialog() {
    setState({
      ...state,
      dialog: null,
    });
  },

  reset() {
    setState({
      queue: [],
      dialog: null,
    });
  },
};

export const notifyStore = {
  getState(): NotifySnapshot {
    return {
      ...state,
      ...methods,
    };
  },

  subscribe(listener: Listener) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
};

export function useNotifyStore<T>(selector: (snapshot: NotifySnapshot) => T) {
  return useSyncExternalStore(
    notifyStore.subscribe,
    () => selector(notifyStore.getState()),
    () => selector(notifyStore.getState()),
  );
}

import { useSyncExternalStore } from 'react';

import { createOrderRecordMap, type OrderRecord } from '../features/orders/lib/orderCatalog';

type OrderState = {
  records: Record<string, OrderRecord>;
};

type OrderMethods = {
  upsert: (order: OrderRecord) => void;
  reset: () => void;
};

export type OrderSnapshot = OrderState & OrderMethods;
type Listener = () => void;

function createState(): OrderState {
  return {
    records: createOrderRecordMap(),
  };
}

let state = createState();
const listeners = new Set<Listener>();

function emit() {
  listeners.forEach((listener) => listener());
}

function toTimestamp(value: string) {
  const numeric = Date.parse(value);
  return Number.isNaN(numeric) ? null : numeric;
}

function setState(next: OrderState) {
  state = next;
  emit();
}

const methods: OrderMethods = {
  upsert(order) {
    const current = state.records[order.id];

    if (current) {
      if (order.version < current.version) {
        return;
      }

      const currentUpdatedAt = toTimestamp(current.updatedAt);
      const nextUpdatedAt = toTimestamp(order.updatedAt);

      if (
        order.version === current.version &&
        currentUpdatedAt !== null &&
        nextUpdatedAt !== null &&
        nextUpdatedAt < currentUpdatedAt
      ) {
        return;
      }
    }

    setState({
      records: {
        ...state.records,
        [order.id]: order,
      },
    });
  },

  reset() {
    setState(createState());
  },
};

export const orderStore = {
  getState(): OrderSnapshot {
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

export function useOrderStore<T>(selector: (snapshot: OrderSnapshot) => T) {
  return useSyncExternalStore(
    orderStore.subscribe,
    () => selector(orderStore.getState()),
    () => selector(orderStore.getState()),
  );
}

export const selectOrderList = (snapshot: OrderSnapshot) => Object.values(snapshot.records);
export const selectOrderById =
  (orderId: string) =>
  (snapshot: OrderSnapshot): OrderRecord | null =>
    snapshot.records[orderId] ?? null;

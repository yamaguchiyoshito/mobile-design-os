import {
  buildOrderEtag,
  createOrderRecordMap,
  getOrderRecord,
  type OrderRecord,
} from './orderCatalog';

export type OrderMutationOperation =
  | 'submit_cancellation'
  | 'revoke_cancellation'
  | 'complete_authorization_void'
  | 'confirm_refund'
  | 'mark_return_pending'
  | 'mark_return_received'
  | 'complete_return_refund'
  | 'add_support_note';

let requestSequence = 0;
const mutationBaseTimestamp = Date.parse('2026-04-12T00:00:00.000Z');
let serverRecords = createOrderRecordMap();

export class OrderPreconditionError extends Error {
  readonly expectedEtag?: string;
  readonly actualEtag: string;
  readonly latestOrder: OrderRecord;

  constructor(args: { expectedEtag?: string; actualEtag: string; latestOrder: OrderRecord }) {
    super('Order precondition failed');
    this.name = 'OrderPreconditionError';
    this.expectedEtag = args.expectedEtag;
    this.actualEtag = args.actualEtag;
    this.latestOrder = args.latestOrder;
  }
}

function createRequestId(prefix: string) {
  requestSequence += 1;
  return `${prefix}-${String(requestSequence).padStart(4, '0')}`;
}

function createUpdatedAt() {
  return new Date(mutationBaseTimestamp + requestSequence * 1000).toISOString();
}

function cloneOrderRecord(order: OrderRecord): OrderRecord {
  return {
    ...order,
    version: order.version,
    etag: order.etag,
    updatedAt: order.updatedAt,
    lastRequestId: order.lastRequestId,
    cancellationPolicy: {
      ...order.cancellationPolicy,
      action: order.cancellationPolicy.action ? { ...order.cancellationPolicy.action } : undefined,
    },
    refundStatus: {
      ...order.refundStatus,
      actions: order.refundStatus.actions?.map((action) => ({ ...action })),
    },
    eventLog: order.eventLog.map((entry) => ({ ...entry })),
    timeline: order.timeline.map((item) => ({ ...item })),
  };
}

export async function persistOrderMutation(
  operation: OrderMutationOperation,
  nextOrder: OrderRecord,
  options?: { expectedEtag?: string },
): Promise<OrderRecord> {
  await Promise.resolve();
  const currentServerOrder = serverRecords[nextOrder.id] ?? getOrderRecord(nextOrder.id);

  if (options?.expectedEtag && options.expectedEtag !== currentServerOrder.etag) {
    throw new OrderPreconditionError({
      expectedEtag: options.expectedEtag,
      actualEtag: currentServerOrder.etag,
      latestOrder: cloneOrderRecord(currentServerOrder),
    });
  }

  const requestId = createRequestId(`req-${operation}`);
  const nextVersion = currentServerOrder.version + 1;
  const persisted = cloneOrderRecord({
    ...nextOrder,
    version: nextVersion,
    etag: buildOrderEtag(nextOrder.id, nextVersion),
    updatedAt: createUpdatedAt(),
    lastRequestId: requestId,
    eventLog: nextOrder.eventLog.map((entry, index, entries) =>
      index === entries.length - 1
        ? {
            ...entry,
            actorLabel: entry.actorLabel || 'system',
            sourceLabel: entry.sourceLabel || 'orders-api',
            correlationId: requestId,
          }
        : { ...entry },
      ),
  });
  serverRecords[nextOrder.id] = cloneOrderRecord(persisted);
  return persisted;
}

export async function fetchOrderSnapshot(orderId: string): Promise<OrderRecord> {
  await Promise.resolve();
  const requestId = createRequestId('req-fetch_order_snapshot');
  const currentServerOrder = serverRecords[orderId] ?? getOrderRecord(orderId);
  return cloneOrderRecord({
    ...currentServerOrder,
    updatedAt: createUpdatedAt(),
    lastRequestId: requestId,
  });
}

export function resetOrderApiState() {
  requestSequence = 0;
  serverRecords = createOrderRecordMap();
}

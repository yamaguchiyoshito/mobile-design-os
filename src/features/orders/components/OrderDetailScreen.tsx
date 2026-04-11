import { useMemo, useState } from 'react';

import { MainLayout } from '../../../components/templates';
import { Banner, Button, Card, Select, Text, TextInput } from '../../../components/ui';
import { notify } from '../../../lib/notify';
import { orderStore, selectOrderById, useOrderStore } from '../../../stores/orderStore';
import { getOrderRecord, type OrderTimelineState } from '../lib/orderCatalog';
import { OrderPreconditionError, fetchOrderSnapshot } from '../lib/orderApi';
import {
  addOrderSupportNote,
  completeAuthorizationVoid,
  completeReturnRefund,
  confirmOrderRefund,
  markOrderReturnPending,
  markOrderReturnReceived,
  revokeOrderCancellation,
  submitOrderCancellation,
} from '../lib/orderMutations';

export type OrderDetailScreenProps = {
  orderId: string;
  transactionId?: string;
  amountLabel?: string;
  onBackToOrders: () => void;
  onResumePayment?: (orderId: string, amountLabel: string) => void;
};

function renderRow(label: string, value: string) {
  return (
    <div
      style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(0, 104px) minmax(0, 1fr)',
        alignItems: 'start',
        gap: 12,
      }}
    >
      <Text as="span" variant="bodySm" tone="secondary">
        {label}
      </Text>
      <Text as="span" variant="labelMd" align="right" style={{ overflowWrap: 'anywhere' }}>
        {value}
      </Text>
    </div>
  );
}

function getTimelineColor(state: OrderTimelineState) {
  if (state === 'done') {
    return { dot: '#175CD3', line: '#175CD3', tone: 'primary' as const };
  }

  if (state === 'current') {
    return { dot: '#F79009', line: '#F79009', tone: 'primary' as const };
  }

  return { dot: '#D0D5DD', line: '#EAECF0', tone: 'secondary' as const };
}

function getVisibilityLabel(visibility?: 'public' | 'private') {
  return visibility === 'public' ? '顧客共有可' : '内部メモ';
}

type ConflictState = {
  expectedEtag?: string;
  actualEtag: string;
  version: number;
  updatedAt: string;
  requestId: string;
};

export function OrderDetailScreen({
  orderId,
  transactionId,
  amountLabel,
  onBackToOrders,
  onResumePayment,
}: OrderDetailScreenProps) {
  const storedOrder = useOrderStore(useMemo(() => selectOrderById(orderId), [orderId]));
  const order = storedOrder ?? getOrderRecord(orderId);
  const [pendingAction, setPendingAction] = useState<
    | 'idle'
    | 'cancel'
    | 'revoke'
    | 'void'
    | 'refund'
    | 'return'
    | 'received'
    | 'returnRefund'
    | 'note'
  >('idle');
  const [supportNote, setSupportNote] = useState('');
  const [supportAuthor, setSupportAuthor] = useState('CS Ops');
  const [supportVisibility, setSupportVisibility] = useState<'public' | 'private'>('private');
  const [conflictState, setConflictState] = useState<ConflictState | null>(null);
  const [isRefreshingConflict, setIsRefreshingConflict] = useState(false);
  const resolvedAmountLabel = amountLabel ?? order.amountLabel;
  const handleMutationFailure = (error: unknown, fallbackMessage: string) => {
    if (error instanceof OrderPreconditionError) {
      orderStore.getState().upsert(error.latestOrder);
      setConflictState({
        expectedEtag: error.expectedEtag,
        actualEtag: error.actualEtag,
        version: error.latestOrder.version,
        updatedAt: error.latestOrder.updatedAt,
        requestId: error.latestOrder.lastRequestId,
      });
      notify.warning(`${order.id} は他端末更新を検知したため最新状態へ同期しました`);
      return;
    }

    notify.error(fallbackMessage);
  };
  const refreshLatestOrder = async () => {
    setIsRefreshingConflict(true);

    try {
      const latestOrder = await fetchOrderSnapshot(order.id);
      orderStore.getState().upsert(latestOrder);
      setConflictState(null);
      notify.info(`${order.id} の最新状態を再取得しました`);
    } catch {
      notify.error('最新状態の再取得に失敗しました');
    } finally {
      setIsRefreshingConflict(false);
    }
  };
  const action = order.cancellationPolicy.action;
  const policyFooter =
    action?.kind === 'cancel' ? (
      <Button
        label={action.label}
        variant="destructive"
        loading={pendingAction === 'cancel'}
        onPress={() => {
          notify.dialog({
            title: 'キャンセル申請を確定しますか',
            message: '出荷前の注文に対してキャンセル申請を送信します。返金可否の確認後に通知します。',
            confirmLabel: '申請する',
            cancelLabel: '戻る',
            destructive: true,
            onConfirm: async () => {
              setPendingAction('cancel');

              try {
                const nextOrder = await submitOrderCancellation(order);
                orderStore.getState().upsert(nextOrder);
                setConflictState(null);
                notify.success(`${order.id} のキャンセル申請を受け付けました`);
              } catch (error) {
                handleMutationFailure(error, 'キャンセル申請の送信に失敗しました');
              } finally {
                setPendingAction('idle');
              }
            },
          });
        }}
        fullWidth
      />
    ) : action?.kind === 'cancel_revoke' ? (
      <Button
        label={action.label}
        variant="secondary"
        loading={pendingAction === 'revoke'}
        onPress={() => {
          notify.dialog({
            title: 'キャンセル申請を取り消しますか',
            message: '返金可否の確認キューから外し、元の注文状態へ戻します。',
            confirmLabel: '取り消す',
            cancelLabel: '戻る',
            destructive: false,
            onConfirm: async () => {
              setPendingAction('revoke');

              try {
                const nextOrder = await revokeOrderCancellation(order);
                orderStore.getState().upsert(nextOrder);
                setConflictState(null);
                notify.info(`${order.id} のキャンセル申請を取り消しました`);
              } catch (error) {
                handleMutationFailure(error, 'キャンセル申請の取り消しに失敗しました');
              } finally {
                setPendingAction('idle');
              }
            },
          });
        }}
        fullWidth
      />
    ) : action?.kind === 'payment_retry' && onResumePayment ? (
      <Button
        label={action.label}
        onPress={() => {
          onResumePayment(order.id, resolvedAmountLabel);
        }}
        fullWidth
      />
    ) : null;
  const refundFooter = order.refundStatus.actions?.length ? (
    <div style={{ display: 'grid', gap: 12 }}>
      {order.refundStatus.actions.map((refundAction) => (
        <Button
          key={`${order.id}-${refundAction.kind}`}
          label={refundAction.label}
          variant={refundAction.variant ?? 'secondary'}
          loading={
            (refundAction.kind === 'void_complete' && pendingAction === 'void') ||
            (refundAction.kind === 'refund_complete' && pendingAction === 'refund') ||
            (refundAction.kind === 'return_pending' && pendingAction === 'return') ||
            (refundAction.kind === 'return_received' && pendingAction === 'received') ||
            (refundAction.kind === 'return_refund_complete' && pendingAction === 'returnRefund')
          }
          onPress={() => {
            const config =
              refundAction.kind === 'void_complete'
                ? {
                    title: '与信取消を完了しますか',
                    message: 'カード売上を確定させず、請求を停止した状態で処理を終了します。',
                    confirmLabel: '完了する',
                    destructive: false,
                    pendingKey: 'void' as const,
                    run: completeAuthorizationVoid,
                    successMessage: '与信取消を完了しました',
                    errorMessage: '与信取消の完了に失敗しました',
                  }
                : refundAction.kind === 'refund_complete'
                  ? {
                      title: '返金確定として処理しますか',
                      message: 'カード会社へ返金指示を送信済みとして記録し、反映待ちへ進めます。',
                      confirmLabel: '返金確定',
                      destructive: false,
                      pendingKey: 'refund' as const,
                      run: confirmOrderRefund,
                      successMessage: '返金確定へ更新しました',
                      errorMessage: '返金確定への更新に失敗しました',
                    }
                  : refundAction.kind === 'return_pending'
                    ? {
                        title: '返品待ちへ変更しますか',
                        message: '返送品の受領後に返金可否を最終判断する状態へ切り替えます。',
                        confirmLabel: '変更する',
                        destructive: false,
                        pendingKey: 'return' as const,
                        run: markOrderReturnPending,
                        successMessage: '返品待ちへ変更しました',
                        errorMessage: '返品待ちへの変更に失敗しました',
                      }
                    : refundAction.kind === 'return_received'
                      ? {
                          title: '返品受領として記録しますか',
                          message: '倉庫で返品を受領済みとして記録し、検品待ちへ進めます。',
                          confirmLabel: '受領済みにする',
                          destructive: false,
                          pendingKey: 'received' as const,
                          run: markOrderReturnReceived,
                          successMessage: '返品受領へ更新しました',
                          errorMessage: '返品受領への更新に失敗しました',
                        }
                      : {
                          title: '返金完了として処理しますか',
                          message: '返品検品が完了し、返金処理を実行済みとして記録します。',
                          confirmLabel: '返金完了',
                          destructive: false,
                          pendingKey: 'returnRefund' as const,
                          run: completeReturnRefund,
                          successMessage: '返金完了へ更新しました',
                          errorMessage: '返金完了への更新に失敗しました',
                        };

            notify.dialog({
              title: config.title,
              message: config.message,
              confirmLabel: config.confirmLabel,
              cancelLabel: '戻る',
              destructive: config.destructive,
              onConfirm: async () => {
                setPendingAction(config.pendingKey);

                try {
                  const nextOrder = await config.run(order);
                  orderStore.getState().upsert(nextOrder);
                  setConflictState(null);
                  notify.success(`${order.id} を${config.successMessage}`);
                } catch (error) {
                  handleMutationFailure(error, config.errorMessage);
                } finally {
                  setPendingAction('idle');
                }
              },
            });
          }}
          fullWidth
        />
      ))}
    </div>
  ) : null;

  return (
    <MainLayout
      header={
        <div style={{ display: 'grid', gap: 4 }}>
          <Text as="h1" variant="headingMd">
            注文詳細
          </Text>
          <Text as="p" variant="bodySm" tone="secondary">
            注文ごとの配送、決済、サポート情報を 1 画面で確認します。
          </Text>
        </div>
      }
      body={
        <div style={{ display: 'grid', gap: 16 }}>
          <Banner type={order.supportBannerType} message={order.supportMessage} />
          {conflictState ? (
            <Card
              title="同時更新を検知"
              description="送信時の etag とサーバー上の最新 etag が一致しませんでした。表示は最新状態へ同期済みです。"
              footer={
                <div style={{ display: 'grid', gap: 12 }}>
                  <Button
                    label="最新状態を再取得"
                    variant="secondary"
                    loading={isRefreshingConflict}
                    onPress={refreshLatestOrder}
                    fullWidth
                  />
                  <Button
                    label="通知を閉じる"
                    variant="secondary"
                    onPress={() => {
                      setConflictState(null);
                    }}
                    fullWidth
                  />
                </div>
              }
            >
              <div style={{ display: 'grid', gap: 12 }}>
                {renderRow('expected etag', conflictState.expectedEtag ?? '未送信')}
                {renderRow('actual etag', conflictState.actualEtag)}
                {renderRow('version', String(conflictState.version))}
                {renderRow('updatedAt', conflictState.updatedAt)}
                {renderRow('requestId', conflictState.requestId)}
                <Text as="p" variant="bodySm" tone="secondary">
                  他端末または別オペレーターの更新を優先しました。操作前に内容を再確認してください。
                </Text>
              </div>
            </Card>
          ) : null}
          <Card title={order.title} description={`注文ID: ${order.id}`}>
            <div style={{ display: 'grid', gap: 12 }}>
              {renderRow('配送ステータス', order.statusLabel)}
              {renderRow('お届け予定', order.deliveryWindow)}
              {renderRow('配送先', order.address)}
              {renderRow('決済金額', resolvedAmountLabel)}
              {renderRow('version', String(order.version))}
              {renderRow('etag', order.etag)}
              {renderRow('最終更新', order.updatedAt)}
              {renderRow('直近 requestId', order.lastRequestId)}
              {transactionId ? renderRow('取引ID', transactionId) : null}
            </div>
          </Card>
          <Card title="配送タイムライン" description="処理済み、現在処理中、次のイベントを時系列で表示します。">
            <div style={{ display: 'grid', gap: 12 }}>
              {order.timeline.map((item, index) => {
                const colors = getTimelineColor(item.state);

                return (
                  <div
                    key={`${order.id}-${item.label}`}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '20px 1fr',
                      gap: 12,
                      alignItems: 'start',
                    }}
                  >
                    <div style={{ display: 'grid', justifyItems: 'center', gap: 6 }}>
                      <span
                        aria-hidden="true"
                        style={{
                          width: 12,
                          height: 12,
                          borderRadius: '9999px',
                          backgroundColor: colors.dot,
                        }}
                      />
                      {index < order.timeline.length - 1 ? (
                        <span
                          aria-hidden="true"
                          style={{
                            width: 2,
                            minHeight: 28,
                            borderRadius: 9999,
                            backgroundColor: colors.line,
                          }}
                        />
                      ) : null}
                    </div>
                    <div style={{ display: 'grid', gap: 4 }}>
                      <Text as="p" variant="labelMd">
                        {item.label}
                      </Text>
                      <Text as="p" variant="bodySm" tone={colors.tone}>
                        {item.timestampLabel}
                      </Text>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
          <Card
            title="キャンセルルール"
            description="現在の注文状態から受付可否と次のアクションを判定しています。"
            footer={policyFooter}
          >
            <div style={{ display: 'grid', gap: 12 }}>
              {renderRow('判定', order.cancellationPolicy.decisionLabel)}
              {order.cancellationPolicy.deadlineLabel
                ? renderRow('受付期限', order.cancellationPolicy.deadlineLabel)
                : null}
              <Text as="p" variant="bodySm" tone="secondary">
                {order.cancellationPolicy.reason}
              </Text>
              {order.cancellationPolicy.note ? (
                <Text as="p" variant="bodySm" tone="secondary">
                  {order.cancellationPolicy.note}
                </Text>
              ) : null}
            </div>
          </Card>
          <Card
            title="返金ステータス"
            description="返金方式、進行状況、反映見込みを表示します。"
            footer={refundFooter}
          >
            <div style={{ display: 'grid', gap: 12 }}>
              {renderRow('ステータス', order.refundStatus.statusLabel)}
              {renderRow('方式', order.refundStatus.methodLabel)}
              {order.refundStatus.expectedCompletionLabel
                ? renderRow('完了目安', order.refundStatus.expectedCompletionLabel)
                : null}
              <Text as="p" variant="bodySm" tone="secondary">
                {order.refundStatus.detail}
              </Text>
              {order.refundStatus.note ? (
                <Text as="p" variant="bodySm" tone="secondary">
                  {order.refundStatus.note}
                </Text>
              ) : null}
            </div>
          </Card>
          <Card
            title="オペレーションログ"
            description="注文、配送、返金、サポートメモを時系列で記録します。"
            footer={
              <div style={{ display: 'grid', gap: 12 }}>
                <TextInput
                  label="記録者"
                  value={supportAuthor}
                  onChangeText={setSupportAuthor}
                  description="監査ログに表示する担当者名です。"
                  placeholder="例: CS Ops"
                  disabled={pendingAction === 'note'}
                />
                <Select
                  label="公開範囲"
                  value={supportVisibility}
                  onChange={(value) => {
                    setSupportVisibility(value === 'public' ? 'public' : 'private');
                  }}
                  options={[
                    { value: 'private', label: '内部メモ' },
                    { value: 'public', label: '顧客共有可' },
                  ]}
                  description="顧客共有可は、外部向け履歴へ転記可能な内容だけに限定します。"
                  disabled={pendingAction === 'note'}
                />
                <TextInput
                  label="サポートメモ"
                  value={supportNote}
                  onChangeText={setSupportNote}
                  description="確定すると event log に記録されます。"
                  placeholder="例: 返送ラベルをメール送付済み"
                  disabled={pendingAction === 'note'}
                />
                <Button
                  label="メモを記録する"
                  variant="secondary"
                  loading={pendingAction === 'note'}
                  disabled={!supportNote.trim().length || !supportAuthor.trim().length}
                  onPress={async () => {
                    setPendingAction('note');

                    try {
                      const nextOrder = await addOrderSupportNote(order, supportNote, {
                        authorLabel: supportAuthor,
                        visibility: supportVisibility,
                      });
                      orderStore.getState().upsert(nextOrder);
                      setConflictState(null);
                      setSupportNote('');
                      setSupportAuthor((current) => current.trim() || 'CS Ops');
                      setSupportVisibility('private');
                      notify.success(`${order.id} にサポートメモを記録しました`);
                    } catch (error) {
                      handleMutationFailure(error, 'サポートメモの記録に失敗しました');
                    } finally {
                      setPendingAction('idle');
                    }
                  }}
                  fullWidth
                />
              </div>
            }
          >
            <div style={{ display: 'grid', gap: 12 }}>
              {order.eventLog.map((entry) => (
                <div
                  key={`${entry.timestampLabel}-${entry.title}-${entry.correlationId || entry.detail}`}
                  style={{
                    display: 'grid',
                    gap: 4,
                    paddingLeft: 12,
                    borderLeft: '2px solid #D0D5DD',
                  }}
                >
                  <Text as="p" variant="labelMd">
                    {entry.title}
                  </Text>
                  <Text as="p" variant="bodySm" tone="secondary">
                    {entry.timestampLabel} / {entry.categoryLabel}
                  </Text>
                  <Text as="p" variant="bodySm" tone="secondary">
                    actor: {entry.actorLabel} / source: {entry.sourceLabel}
                  </Text>
                  {entry.authorLabel || entry.visibility ? (
                    <Text as="p" variant="bodySm" tone="secondary">
                      recorded by: {entry.authorLabel ?? 'CS Ops'} / visibility:{' '}
                      {getVisibilityLabel(entry.visibility)}
                    </Text>
                  ) : null}
                  <Text as="p" variant="bodySm" tone="secondary">
                    {entry.detail}
                  </Text>
                  <Text
                    as="p"
                    variant="bodySm"
                    tone="secondary"
                    style={{ fontFamily: 'ui-monospace, SFMono-Regular, Menlo, monospace' }}
                  >
                    correlationId: {entry.correlationId}
                  </Text>
                </div>
              ))}
            </div>
          </Card>
        </div>
      }
      footer={<Button label="注文一覧へ戻る" variant="secondary" onPress={onBackToOrders} fullWidth />}
    />
  );
}

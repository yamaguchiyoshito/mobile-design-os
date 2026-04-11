import { useId } from 'react';

import { notifyStore } from '../../../stores/notifyStore';
import tokens from '../../../tokens';
import { Button } from '../Button';
import { Text } from '../Text';

export type ConfirmDialogProps = {
  item: {
    title: string;
    message: string;
    confirmLabel: string;
    cancelLabel: string;
    destructive: boolean;
    onConfirm: () => void;
    onCancel?: () => void;
  };
};

export function ConfirmDialog({ item }: ConfirmDialogProps) {
  const titleId = useId();
  const messageId = useId();

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-labelledby={titleId}
      aria-describedby={messageId}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1100,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: tokens.space4,
        backgroundColor: tokens.colorSurfaceOverlay,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 420,
          borderRadius: tokens.radiusLg,
          backgroundColor: tokens.colorSurfacePrimary,
          boxShadow: '0 20px 48px rgba(15, 23, 42, 0.24)',
          padding: tokens.space5,
          display: 'flex',
          flexDirection: 'column',
          gap: tokens.space4,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space2 }}>
          <Text as="h3" variant="headingMd" id={titleId}>
            {item.title}
          </Text>
          <Text as="p" variant="bodyMd" tone="secondary" id={messageId}>
            {item.message}
          </Text>
        </div>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
            gap: tokens.space3,
          }}
        >
          <Button
            label={item.cancelLabel}
            variant="secondary"
            onPress={() => {
              item.onCancel?.();
              notifyStore.getState().dismissDialog();
            }}
          />
          <Button
            label={item.confirmLabel}
            variant={item.destructive ? 'destructive' : 'primary'}
            onPress={() => {
              item.onConfirm();
              notifyStore.getState().dismissDialog();
            }}
          />
        </div>
      </div>
    </div>
  );
}

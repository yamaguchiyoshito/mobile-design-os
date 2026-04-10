import type { CSSProperties } from 'react';

import tokens from '../../../tokens';
import type { ToastItem } from '../../../stores/notifyStore';
import { IconButton } from '../IconButton';
import { Text } from '../Text';

export type SnackbarProps = {
  item: ToastItem & { type: 'snackbar' };
  onDismiss: () => void;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function Snackbar({ item, onDismiss, testID, style, className }: SnackbarProps) {
  return (
    <div
      role="alert"
      aria-live="polite"
      aria-label={item.message}
      data-testid={testID}
      className={className}
      style={{
        position: 'fixed',
        left: 16,
        right: 16,
        bottom: 16,
        zIndex: 1000,
        display: 'flex',
        justifyContent: 'center',
        pointerEvents: 'none',
        ...style,
      }}
    >
      <div
        style={{
          width: '100%',
          maxWidth: 480,
          display: 'flex',
          alignItems: 'center',
          gap: tokens.space2,
          paddingInline: tokens.space4,
          paddingBlock: tokens.space3,
          borderRadius: 12,
          border: `1px solid ${tokens.colorBorderStrong}`,
          backgroundColor: tokens.colorSurfacePrimary,
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.16)',
          pointerEvents: 'auto',
        }}
      >
        <Text as="p" variant="bodySm" style={{ flex: 1 }}>
          {item.message}
        </Text>
        {item.action ? (
          <button
            type="button"
            aria-label={item.action.label}
            onClick={item.action.onPress}
            style={{
              appearance: 'none',
              border: 'none',
              background: 'transparent',
              color: tokens.colorContentBrand,
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
              fontSize: 14,
              fontWeight: 600,
              lineHeight: '18px',
            }}
          >
            {item.action.label}
          </button>
        ) : null}
        <IconButton label="閉じる" icon="x" size="sm" variant="ghost" onPress={onDismiss} />
      </div>
    </div>
  );
}

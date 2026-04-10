import type { CSSProperties } from 'react';

import { ANIMATION_DURATION } from '../../../constants/animation';
import tokens from '../../../tokens';
import type { ToastItem } from '../../../stores/notifyStore';
import { Icon } from '../Icon';
import { IconButton } from '../IconButton';
import { Text } from '../Text';

export type ToastProps = {
  item: ToastItem;
  onDismiss: () => void;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

const toneMap = {
  success: {
    backgroundColor: tokens.colorSurfaceSuccessSubtle,
    borderColor: '#ABEFC6',
    color: tokens.colorContentSuccess,
    icon: 'check-circle' as const,
  },
  error: {
    backgroundColor: tokens.colorSurfaceDangerSubtle,
    borderColor: '#FCA5A5',
    color: tokens.colorContentDanger,
    icon: 'alert-circle' as const,
  },
  warning: {
    backgroundColor: tokens.colorSurfaceWarningSubtle,
    borderColor: '#F7B955',
    color: tokens.colorContentWarning,
    icon: 'warning' as const,
  },
  info: {
    backgroundColor: tokens.colorSurfaceInfoSubtle,
    borderColor: '#B2DDFF',
    color: tokens.colorContentInfo,
    icon: 'info' as const,
  },
  snackbar: {
    backgroundColor: tokens.colorSurfacePrimary,
    borderColor: tokens.colorBorderStrong,
    color: tokens.colorContentPrimary,
    icon: 'info' as const,
  },
};

export function Toast({ item, onDismiss, testID, style, className }: ToastProps) {
  const tone = toneMap[item.type];
  const liveRegion = item.type === 'error' || item.type === 'warning' ? 'assertive' : 'polite';

  return (
    <div
      role="alert"
      aria-live={liveRegion}
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
          alignItems: 'flex-start',
          gap: tokens.space2,
          paddingInline: tokens.space4,
          paddingBlock: tokens.space3,
          borderRadius: 12,
          border: `1px solid ${tone.borderColor}`,
          backgroundColor: tone.backgroundColor,
          boxShadow: '0 12px 32px rgba(15, 23, 42, 0.16)',
          pointerEvents: 'auto',
          animation: `toast-enter ${ANIMATION_DURATION.ENTER}ms ease`,
        }}
      >
        <Icon name={tone.icon} size={18} color={tone.color} accessible={false} />
        <Text as="p" variant="bodySm" style={{ flex: 1, color: tone.color }}>
          {item.message}
        </Text>
        <IconButton
          icon={<Icon name="x" size={14} color={tone.color} accessible={false} />}
          label="閉じる"
          size="sm"
          variant="ghost"
          onPress={onDismiss}
          style={{ marginTop: -6, marginRight: -6 }}
        />
      </div>
    </div>
  );
}

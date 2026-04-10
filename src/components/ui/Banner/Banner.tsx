import type { CSSProperties } from 'react';

import tokens from '../../../tokens';
import { Icon, type IconName } from '../Icon';
import { IconButton } from '../IconButton';
import { Text } from '../Text';

export type BannerType = 'info' | 'warning' | 'error';

export type BannerProps = {
  type: BannerType;
  message: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  onDismiss?: () => void;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

const typeMap: Record<
  BannerType,
  { backgroundColor: string; color: string; icon: IconName; borderColor: string }
> = {
  info: {
    backgroundColor: tokens.colorSurfaceInfoSubtle,
    color: tokens.colorContentInfo,
    icon: 'info',
    borderColor: '#B2DDFF',
  },
  warning: {
    backgroundColor: tokens.colorSurfaceWarningSubtle,
    color: tokens.colorContentWarning,
    icon: 'warning',
    borderColor: '#F7B955',
  },
  error: {
    backgroundColor: tokens.colorSurfaceDangerSubtle,
    color: tokens.colorContentDanger,
    icon: 'alert-circle',
    borderColor: '#FCA5A5',
  },
};

export function Banner({
  type,
  message,
  action,
  onDismiss,
  testID,
  style,
  className,
}: BannerProps) {
  const colors = typeMap[type];

  return (
    <section
      role="status"
      aria-live="polite"
      aria-label={message}
      data-testid={testID}
      className={className}
      style={{
        width: '100%',
        borderRadius: tokens.radiusMd,
        border: `1px solid ${colors.borderColor}`,
        backgroundColor: colors.backgroundColor,
        paddingInline: tokens.space4,
        paddingBlock: tokens.space3,
        ...style,
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: tokens.space2,
        }}
      >
        <Icon name={colors.icon} size={16} color={colors.color} accessible={false} />
        <Text as="p" variant="bodySm" style={{ flex: 1, color: colors.color }}>
          {message}
        </Text>
        {action ? (
          <button
            type="button"
            aria-label={action.label}
            onClick={action.onPress}
            style={{
              appearance: 'none',
              border: 'none',
              background: 'transparent',
              color: colors.color,
              cursor: 'pointer',
              padding: 0,
              textDecoration: 'underline',
              fontSize: 14,
              fontWeight: 600,
              lineHeight: '18px',
            }}
          >
            {action.label}
          </button>
        ) : null}
        {onDismiss ? (
          <IconButton
            icon={<Icon name="x" size={14} color={colors.color} accessible={false} />}
            label="閉じる"
            size="sm"
            variant="ghost"
            onPress={onDismiss}
            style={{ marginRight: -6 }}
          />
        ) : null}
      </div>
    </section>
  );
}

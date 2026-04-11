import type { CSSProperties } from 'react';

import { useTheme } from '../../providers/ThemeProvider';
import tokens, { typography } from '../../../tokens';
import { Icon, type IconName } from '../Icon';

export type ButtonVariant = 'primary' | 'secondary' | 'destructive';
export type ButtonSize = 'sm' | 'md' | 'lg';

export type ButtonProps = {
  label: string;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  fullWidth?: boolean;
  iconLeft?: IconName;
  iconRight?: IconName;
  onPress: () => void;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

const sizeMap: Record<
  ButtonSize,
  { minHeight: number; paddingInline: number; iconSize: number; textStyle: CSSProperties }
> = {
  sm: {
    minHeight: tokens.controlHeightSm,
    paddingInline: 14,
    iconSize: tokens.iconSizeSm,
    textStyle: typography.labelSm,
  },
  md: {
    minHeight: tokens.controlHeightMd,
    paddingInline: 18,
    iconSize: tokens.iconSizeMd,
    textStyle: typography.labelMd,
  },
  lg: {
    minHeight: tokens.controlHeightLg,
    paddingInline: 22,
    iconSize: tokens.iconSizeLg,
    textStyle: typography.labelMd,
  },
};

const variantMap: Record<
  ButtonVariant,
  { backgroundColor: string; borderColor: string; color: string; boxShadow?: string }
> = {
  primary: {
    backgroundColor: tokens.colorSurfaceBrand,
    borderColor: tokens.colorSurfaceBrand,
    color: tokens.colorContentInverse,
    boxShadow: '0 12px 24px rgba(23, 92, 211, 0.22)',
  },
  secondary: {
    backgroundColor: tokens.colorSurfacePrimary,
    borderColor: tokens.colorBorderDefault,
    color: tokens.colorContentPrimary,
  },
  destructive: {
    backgroundColor: tokens.colorSurfaceDanger,
    borderColor: tokens.colorSurfaceDanger,
    color: tokens.colorContentInverse,
    boxShadow: '0 12px 24px rgba(220, 38, 38, 0.18)',
  },
};

export function Button({
  label,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  fullWidth = false,
  iconLeft,
  iconRight,
  onPress,
  testID,
  style,
  className,
}: ButtonProps) {
  const sizing = sizeMap[size];
  const { palette } = useTheme();
  const colors = {
    ...variantMap[variant],
    ...(variant === 'secondary'
      ? {
          backgroundColor: palette.surfacePrimary,
          borderColor: palette.borderDefault,
          color: palette.contentPrimary,
        }
      : {}),
  };
  const blocked = disabled || loading;

  const buttonStyle: CSSProperties = {
    appearance: 'none',
    width: fullWidth ? '100%' : undefined,
    maxWidth: '100%',
    minHeight: sizing.minHeight,
    borderRadius: tokens.radiusMd,
    border: `1px solid ${blocked ? palette.borderDefault : colors.borderColor}`,
    backgroundColor: blocked ? palette.surfaceSecondary : colors.backgroundColor,
    color: blocked ? palette.contentDisabled : colors.color,
    paddingInline: sizing.paddingInline,
    paddingBlock: 0,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: tokens.space2,
    cursor: blocked ? 'not-allowed' : 'pointer',
    transition: 'background-color 160ms ease, border-color 160ms ease, box-shadow 160ms ease',
    boxShadow: blocked ? 'none' : colors.boxShadow,
    ...style,
  };

  const labelStyle: CSSProperties = {
    ...sizing.textStyle,
    color: blocked ? palette.contentDisabled : colors.color,
    whiteSpace: 'normal',
    overflowWrap: 'anywhere',
    textAlign: 'center',
  };

  const spinnerStyle: CSSProperties = {
    width: sizing.iconSize,
    height: sizing.iconSize,
    borderRadius: '50%',
    border: `2px solid ${
      blocked ? 'rgba(152, 162, 179, 0.35)' : 'rgba(255, 255, 255, 0.35)'
    }`,
    borderTopColor: blocked ? palette.contentDisabled : colors.color,
    animation: 'ui-spin 0.8s linear infinite',
  };

  const renderLeft = () => {
    if (loading) {
      return <span aria-hidden="true" style={spinnerStyle} />;
    }

    if (iconLeft) {
      return (
        <Icon
          name={iconLeft}
          size={sizing.iconSize}
          color={blocked ? palette.contentDisabled : colors.color}
          accessible={false}
        />
      );
    }

    return null;
  };

  return (
    <button
      type="button"
      className={className}
      data-testid={testID}
      aria-busy={loading || undefined}
      disabled={blocked}
      onClick={() => {
        if (!blocked) {
          onPress();
        }
      }}
      style={buttonStyle}
    >
      {renderLeft()}
      <span style={labelStyle}>{label}</span>
      {iconRight && !loading ? (
        <Icon
          name={iconRight}
          size={sizing.iconSize}
          color={blocked ? palette.contentDisabled : colors.color}
          accessible={false}
        />
      ) : null}
    </button>
  );
}

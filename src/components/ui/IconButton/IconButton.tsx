import type { CSSProperties, ReactNode } from 'react';

import { useTheme } from '../../providers/ThemeProvider';
import tokens from '../../../tokens';
import { Icon, type IconName } from '../Icon';

export type IconButtonVariant = 'ghost' | 'secondary' | 'primary' | 'destructive';
export type IconButtonSize = 'sm' | 'md' | 'lg';

export type IconButtonProps = {
  icon: IconName | ReactNode;
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
  onPress: () => void;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

const sizeMap: Record<IconButtonSize, { size: number; iconSize: number }> = {
  sm: { size: 44, iconSize: 18 },
  md: { size: 48, iconSize: 20 },
  lg: { size: 52, iconSize: 22 },
};

const variantMap: Record<IconButtonVariant, { backgroundColor: string; color: string; borderColor: string }> =
  {
    ghost: {
      backgroundColor: 'transparent',
      color: tokens.colorContentPrimary,
      borderColor: 'transparent',
    },
    secondary: {
      backgroundColor: tokens.colorSurfacePrimary,
      color: tokens.colorContentPrimary,
      borderColor: tokens.colorBorderDefault,
    },
    primary: {
      backgroundColor: tokens.colorSurfaceBrandSubtle,
      color: tokens.colorContentBrand,
      borderColor: tokens.colorSurfaceBrandSubtle,
    },
    destructive: {
      backgroundColor: tokens.colorSurfaceDangerSubtle,
      color: tokens.colorContentDanger,
      borderColor: tokens.colorSurfaceDangerSubtle,
    },
  };

export function IconButton({
  icon,
  label,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  onPress,
  testID,
  style,
  className,
}: IconButtonProps) {
  const sizing = sizeMap[size];
  const { palette } = useTheme();
  const colors = {
    ...variantMap[variant],
    ...(variant === 'ghost' || variant === 'secondary'
      ? {
          backgroundColor: variant === 'ghost' ? 'transparent' : palette.surfacePrimary,
          color: palette.contentPrimary,
          borderColor: variant === 'ghost' ? 'transparent' : palette.borderDefault,
        }
      : {}),
  };

  const buttonStyle: CSSProperties = {
    appearance: 'none',
    width: sizing.size,
    minWidth: 44,
    height: sizing.size,
    minHeight: 44,
    borderRadius: tokens.radiusMd,
    border: `1px solid ${disabled ? palette.borderDefault : colors.borderColor}`,
    backgroundColor: disabled ? palette.surfaceSecondary : colors.backgroundColor,
    color: disabled ? palette.contentDisabled : colors.color,
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    cursor: disabled ? 'not-allowed' : 'pointer',
    transition: 'background-color 160ms ease, border-color 160ms ease',
    ...style,
  };

  return (
    <button
      type="button"
      className={className}
      data-testid={testID}
      aria-label={label}
      disabled={disabled}
      onClick={() => {
        if (!disabled) {
          onPress();
        }
      }}
      style={buttonStyle}
    >
      {typeof icon === 'string' ? (
        <Icon
          name={icon as IconName}
          size={sizing.iconSize}
          color={disabled ? palette.contentDisabled : colors.color}
          accessible={false}
        />
      ) : (
        icon
      )}
    </button>
  );
}

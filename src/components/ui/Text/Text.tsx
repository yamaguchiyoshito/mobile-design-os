import type {
  ComponentPropsWithoutRef,
  CSSProperties,
  ElementType,
  ReactNode,
} from 'react';

import { useTheme } from '../../providers/ThemeProvider';
import tokens, { typography } from '../../../tokens';

export type TextVariant = keyof typeof typography;
export type TextTone =
  | 'primary'
  | 'secondary'
  | 'danger'
  | 'inverse'
  | 'disabled'
  | 'brand';

type TextOwnProps<T extends ElementType> = {
  as?: T;
  children: ReactNode;
  variant?: TextVariant;
  tone?: TextTone;
  align?: 'left' | 'center' | 'right';
  truncate?: boolean;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export type TextProps<T extends ElementType = 'span'> = TextOwnProps<T> &
  Omit<ComponentPropsWithoutRef<T>, keyof TextOwnProps<T> | 'color'>;

export function Text<T extends ElementType = 'span'>({
  as,
  children,
  variant = 'bodyMd',
  tone = 'primary',
  align = 'left',
  truncate = false,
  testID,
  style,
  className,
  ...rest
}: TextProps<T>) {
  const Component = (as ?? 'span') as ElementType;
  const { palette } = useTheme();

  const toneMap: Record<TextTone, string> = {
    primary: palette.contentPrimary,
    secondary: palette.contentSecondary,
    danger: palette.contentDanger,
    inverse: palette.contentInverse,
    disabled: palette.contentDisabled,
    brand: palette.contentBrand,
  };

  const textStyle: CSSProperties = {
    margin: 0,
    color: toneMap[tone],
    textAlign: align,
    ...typography[variant],
    ...(truncate
      ? {
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }
      : {}),
    ...style,
  };

  return (
    <Component
      data-testid={testID}
      className={className}
      style={textStyle}
      {...(rest as ComponentPropsWithoutRef<T>)}
    >
      {children}
    </Component>
  );
}

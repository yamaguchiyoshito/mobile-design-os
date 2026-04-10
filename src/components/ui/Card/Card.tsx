import type { CSSProperties, ReactNode } from 'react';

import { useTheme } from '../../providers/ThemeProvider';
import tokens from '../../../tokens';
import { Text } from '../Text';

export type CardPadding = 'sm' | 'md' | 'lg';

export type CardProps = {
  title?: string;
  description?: string;
  footer?: ReactNode;
  children: ReactNode;
  padding?: CardPadding;
  elevated?: boolean;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

const paddingMap: Record<CardPadding, number> = {
  sm: 12,
  md: 16,
  lg: 24,
};

export function Card({
  title,
  description,
  footer,
  children,
  padding = 'md',
  elevated = true,
  testID,
  style,
  className,
}: CardProps) {
  const paddingValue = paddingMap[padding];
  const { palette } = useTheme();

  const cardStyle: CSSProperties = {
    width: '100%',
    borderRadius: tokens.radiusLg,
    border: `1px solid ${palette.borderDefault}`,
    backgroundColor: palette.surfaceElevated,
    boxShadow: elevated ? palette.cardShadow : 'none',
    padding: paddingValue,
    display: 'flex',
    flexDirection: 'column',
    gap: tokens.space3,
    ...style,
  };

  return (
    <section data-testid={testID} className={className} style={cardStyle}>
      {title ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Text as="h3" variant="headingSm">
            {title}
          </Text>
          {description ? (
            <Text as="p" variant="bodySm" tone="secondary">
              {description}
            </Text>
          ) : null}
        </div>
      ) : null}
      <div>{children}</div>
      {footer ? (
        <div
          style={{
            borderTop: `1px solid ${palette.borderDefault}`,
            paddingTop: tokens.space3,
          }}
        >
          {footer}
        </div>
      ) : null}
    </section>
  );
}

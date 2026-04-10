import type { CSSProperties, ReactNode } from 'react';

import { useTheme } from '../providers/ThemeProvider';
import tokens from '../../tokens';
import { Card } from '../ui/Card';

export type AuthLayoutProps = {
  heading: ReactNode;
  body: ReactNode;
  footer?: ReactNode;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function AuthLayout({
  heading,
  body,
  footer,
  testID,
  style,
  className,
}: AuthLayoutProps) {
  const { palette } = useTheme();

  return (
    <div
      data-testid={testID}
      className={className}
      style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: tokens.space6,
        background: palette.authGradient,
        ...style,
      }}
    >
      <div style={{ width: '100%', maxWidth: 440 }}>
        <Card padding="lg">
          <div style={{ display: 'flex', flexDirection: 'column', gap: tokens.space4 }}>
            <div>{heading}</div>
            <div>{body}</div>
            {footer ? <div>{footer}</div> : null}
          </div>
        </Card>
      </div>
    </div>
  );
}

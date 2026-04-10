import type { CSSProperties, ReactNode } from 'react';

import { useTheme } from '../providers/ThemeProvider';
import tokens from '../../tokens';

export type MainLayoutProps = {
  header: ReactNode;
  body: ReactNode;
  footer?: ReactNode;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function MainLayout({
  header,
  body,
  footer,
  testID,
  style,
  className,
}: MainLayoutProps) {
  const { palette } = useTheme();

  return (
    <div
      data-testid={testID}
      className={className}
      style={{
        minHeight: '100vh',
        display: 'grid',
        gridTemplateRows: 'auto 1fr auto',
        backgroundColor: palette.surfacePrimary,
        ...style,
      }}
    >
      <header style={{ paddingInline: tokens.space4, paddingBlock: tokens.space3 }}>{header}</header>
      <main style={{ paddingInline: tokens.space4, paddingBottom: tokens.space4 }}>{body}</main>
      {footer ? (
        <footer
          style={{
            borderTop: `1px solid ${palette.borderDefault}`,
            paddingInline: tokens.space4,
            paddingBlock: tokens.space3,
          }}
        >
          {footer}
        </footer>
      ) : null}
    </div>
  );
}

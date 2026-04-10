import type { CSSProperties, ReactNode } from 'react';
import { useId } from 'react';

import { useTheme } from '../../providers/ThemeProvider';
import tokens from '../../../tokens';
import { Text } from '../Text';

export type SectionProps = {
  title: string;
  description?: string;
  aside?: ReactNode;
  children: ReactNode;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function Section({
  title,
  description,
  aside,
  children,
  testID,
  style,
  className,
}: SectionProps) {
  const titleId = useId();
  const descriptionId = useId();
  const { palette } = useTheme();

  return (
    <section
      aria-labelledby={titleId}
      aria-describedby={description ? descriptionId : undefined}
      data-testid={testID}
      className={className}
      style={{
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.space4,
        padding: tokens.space4,
        borderRadius: tokens.radiusLg,
        border: `1px solid ${palette.borderDefault}`,
        backgroundColor: palette.surfacePrimary,
        ...style,
      }}
    >
      <header
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          gap: tokens.space3,
        }}
      >
        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          <Text as="h2" id={titleId} variant="headingSm">
            {title}
          </Text>
          {description ? (
            <Text as="p" id={descriptionId} variant="bodySm" tone="secondary">
              {description}
            </Text>
          ) : null}
        </div>
        {aside ? <div>{aside}</div> : null}
      </header>
      <div>{children}</div>
    </section>
  );
}

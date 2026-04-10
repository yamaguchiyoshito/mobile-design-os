import type { CSSProperties, ReactNode } from 'react';

import tokens from '../../../tokens';
import { Button } from '../Button';
import { Text } from '../Text';

export type EmptyStateProps = {
  illustration?: ReactNode;
  title: string;
  description?: string;
  action?: {
    label: string;
    onPress: () => void;
  };
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function EmptyState({
  illustration,
  title,
  description,
  action,
  testID,
  style,
  className,
}: EmptyStateProps) {
  return (
    <section
      data-testid={testID}
      className={className}
      aria-label={[title, description].filter(Boolean).join('。')}
      style={{
        width: '100%',
        minHeight: 280,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: tokens.space3,
        paddingInline: 32,
        paddingBlock: 40,
        textAlign: 'center',
        ...style,
      }}
    >
      {illustration ? <div aria-hidden="true">{illustration}</div> : null}
      <Text as="h3" variant="headingMd" align="center">
        {title}
      </Text>
      {description ? (
        <Text as="p" variant="bodyMd" tone="secondary" align="center">
          {description}
        </Text>
      ) : null}
      {action ? <Button label={action.label} onPress={action.onPress} /> : null}
    </section>
  );
}

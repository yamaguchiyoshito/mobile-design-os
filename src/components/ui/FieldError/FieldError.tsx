import type { CSSProperties } from 'react';

import tokens from '../../../tokens';
import { Icon } from '../Icon';
import { Text } from '../Text';

export type FieldErrorProps = {
  message?: string;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function FieldError({ message, testID, style, className }: FieldErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      data-testid={testID}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: tokens.space2,
        ...style,
      }}
    >
      <Icon name="alert-circle" size={16} color={tokens.colorContentDanger} accessible={false} />
      <Text as="span" variant="bodySm" tone="danger">
        {message}
      </Text>
    </div>
  );
}

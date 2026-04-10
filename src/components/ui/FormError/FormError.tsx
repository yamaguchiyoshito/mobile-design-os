import type { CSSProperties } from 'react';

import tokens from '../../../tokens';
import { Icon } from '../Icon';
import { Text } from '../Text';

export type FormErrorProps = {
  message?: string;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function FormError({ message, testID, style, className }: FormErrorProps) {
  if (!message) {
    return null;
  }

  return (
    <div
      role="alert"
      aria-live="assertive"
      aria-label={message}
      data-testid={testID}
      className={className}
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: tokens.space2,
        width: '100%',
        borderRadius: tokens.radiusMd,
        backgroundColor: tokens.colorSurfaceDangerSubtle,
        padding: tokens.space3,
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

import type { CSSProperties } from 'react';

import { useTheme } from '../../providers/ThemeProvider';
import tokens from '../../../tokens';
import { Button } from '../Button';
import { Icon } from '../Icon';
import { Text } from '../Text';

export type ErrorStateProps = {
  message?: string;
  onRetry?: () => void;
  retryLabel?: string;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function ErrorState({
  message = '接続を確認してください',
  onRetry,
  retryLabel = '再試行',
  testID,
  style,
  className,
}: ErrorStateProps) {
  const { palette } = useTheme();

  return (
    <section
      data-testid={testID}
      className={className}
      aria-label={message}
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
      <Icon
        name="wifi-off"
        size={48}
        color={palette.contentDisabled}
        accessible={false}
      />
      <Text as="p" variant="bodyMd" tone="secondary" align="center">
        {message}
      </Text>
      {onRetry ? <Button label={retryLabel} onPress={onRetry} variant="secondary" /> : null}
    </section>
  );
}

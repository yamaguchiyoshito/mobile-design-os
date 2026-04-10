import type { CSSProperties } from 'react';

import tokens from '../../../tokens';
import { Button } from '../Button';
import { Text } from '../Text';

export type PermissionDeniedPromptProps = {
  featureName: string;
  reason: string;
  onOpenSettings: () => void;
  onDismiss: () => void;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function PermissionDeniedPrompt({
  featureName,
  reason,
  onOpenSettings,
  onDismiss,
  testID,
  style,
  className,
}: PermissionDeniedPromptProps) {
  return (
    <section
      role="alert"
      aria-label={`${featureName}のアクセスが許可されていません。${reason}`}
      data-testid={testID}
      className={className}
      style={{
        width: '100%',
        borderRadius: tokens.radiusLg,
        backgroundColor: tokens.colorSurfaceSecondary,
        padding: tokens.space5,
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.space3,
        ...style,
      }}
    >
      <Text as="h3" variant="headingSm">
        {featureName}へのアクセスが必要です
      </Text>
      <Text as="p" variant="bodyMd" tone="secondary">
        {reason}設定アプリから{featureName}のアクセスを許可してください。
      </Text>
      <div
        style={{
          display: 'flex',
          justifyContent: 'flex-end',
          gap: tokens.space3,
          flexWrap: 'wrap',
        }}
      >
        <Button label="後で" variant="secondary" onPress={onDismiss} />
        <Button label="設定を開く" variant="primary" onPress={onOpenSettings} />
      </div>
    </section>
  );
}

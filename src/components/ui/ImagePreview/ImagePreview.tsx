import type { CSSProperties } from 'react';

import tokens from '../../../tokens';
import { IconButton } from '../IconButton';

export type ImagePreviewProps = {
  uri: string;
  onRemove?: () => void;
  maxWidth?: number;
  maxHeight?: number;
  alt?: string;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function ImagePreview({
  uri,
  onRemove,
  maxWidth = 400,
  maxHeight = 400,
  alt = '選択した画像のプレビュー',
  testID,
  style,
  className,
}: ImagePreviewProps) {
  return (
    <div
      data-testid={testID}
      className={className}
      style={{
        position: 'relative',
        width: 'fit-content',
        maxWidth,
        ...style,
      }}
    >
      <img
        src={uri}
        alt={alt}
        style={{
          display: 'block',
          width: maxWidth,
          height: maxHeight,
          maxWidth: '100%',
          objectFit: 'contain',
          borderRadius: tokens.radiusLg,
          backgroundColor: tokens.colorSurfaceSecondary,
        }}
      />
      {onRemove ? (
        <IconButton
          icon="x"
          label="画像を削除"
          size="sm"
          variant="secondary"
          onPress={onRemove}
          style={{
            position: 'absolute',
            top: 8,
            right: 8,
            backgroundColor: tokens.colorSurfaceOverlay,
            borderColor: 'transparent',
          }}
        />
      ) : null}
    </div>
  );
}

import type { KeyboardEvent, ReactNode } from 'react';
import { useEffect, useRef } from 'react';

import { useTheme } from '../../providers/ThemeProvider';
import tokens from '../../../tokens';
import { IconButton } from '../IconButton';

export type ModalProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  testID?: string;
};

export function Modal({ visible, onClose, children, title = 'モーダル', testID }: ModalProps) {
  const dialogRef = useRef<HTMLDivElement | null>(null);
  const { palette } = useTheme();

  useEffect(() => {
    if (!visible) {
      return;
    }

    dialogRef.current?.focus();
  }, [visible]);

  if (!visible) {
    return null;
  }

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  return (
    <div
      aria-modal="true"
      role="dialog"
      aria-label={title}
      data-testid={testID}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 1200,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: tokens.space4,
        backgroundColor: palette.overlay,
      }}
    >
      <div
        ref={dialogRef}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        style={{
          width: '100%',
          maxWidth: 480,
          borderRadius: tokens.radiusLg,
          backgroundColor: palette.surfacePrimary,
          boxShadow: palette.modalShadow,
          padding: tokens.space5,
          outline: 'none',
          position: 'relative',
        }}
      >
        <div style={{ position: 'absolute', top: 12, right: 12 }}>
          <IconButton icon="close" label="閉じる" size="sm" variant="ghost" onPress={onClose} />
        </div>
        {children}
      </div>
    </div>
  );
}

import type { CSSProperties, InputHTMLAttributes } from 'react';

import tokens from '../../../tokens';
import { IconButton } from '../IconButton';

export type SearchBarProps = {
  value: string;
  onChangeText: (value: string) => void;
  onSubmit?: () => void;
  onClear?: () => void;
  placeholder?: string;
  disabled?: boolean;
  autoFocus?: boolean;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function SearchBar({
  value,
  onChangeText,
  onSubmit,
  onClear,
  placeholder = '検索',
  disabled = false,
  autoFocus = false,
  testID,
  style,
  className,
}: SearchBarProps) {
  const handleKeyDown: InputHTMLAttributes<HTMLInputElement>['onKeyDown'] = (event) => {
    if (event.key === 'Enter') {
      onSubmit?.();
    }
  };

  return (
    <div
      data-testid={testID}
      className={className}
      style={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        gap: tokens.space2,
        minHeight: tokens.controlHeightLg,
        borderRadius: tokens.radiusLg,
        border: `1px solid ${tokens.colorBorderDefault}`,
        backgroundColor: disabled ? tokens.colorSurfaceSecondary : tokens.colorSurfacePrimary,
        paddingInline: tokens.space3,
        ...style,
      }}
    >
      <span aria-hidden="true" style={{ color: tokens.colorContentSecondary, fontSize: 16 }}>
        ⌕
      </span>
      <input
        type="search"
        role="searchbox"
        aria-label="検索"
        value={value}
        disabled={disabled}
        autoFocus={autoFocus}
        placeholder={placeholder}
        onChange={(event) => onChangeText(event.target.value)}
        onKeyDown={handleKeyDown}
        style={{
          flex: 1,
          minHeight: 42,
          border: 'none',
          outline: 'none',
          backgroundColor: 'transparent',
          color: disabled ? tokens.colorContentDisabled : tokens.colorContentPrimary,
          fontSize: 16,
          lineHeight: '24px',
        }}
      />
      {value ? (
        <IconButton
          icon="x"
          label="検索語をクリア"
          size="sm"
          variant="ghost"
          disabled={disabled}
          onPress={() => {
            onChangeText('');
            onClear?.();
          }}
        />
      ) : null}
    </div>
  );
}

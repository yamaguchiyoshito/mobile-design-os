import type { CSSProperties } from 'react';
import { useId } from 'react';

import { useTheme } from '../../providers/ThemeProvider';
import tokens from '../../../tokens';
import { Text } from '../Text';

export type SwitchProps = {
  value: boolean;
  label: string;
  description?: string;
  disabled?: boolean;
  onChange: (nextValue: boolean) => void;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function Switch({
  value,
  label,
  description,
  disabled = false,
  onChange,
  testID,
  style,
  className,
}: SwitchProps) {
  const descriptionId = useId();
  const { palette } = useTheme();

  return (
    <button
      type="button"
      role="switch"
      aria-checked={value}
      aria-label={label}
      aria-describedby={description ? descriptionId : undefined}
      aria-disabled={disabled || undefined}
      data-testid={testID}
      className={className}
      onClick={() => {
        if (!disabled) {
          onChange(!value);
        }
      }}
      style={{
        width: '100%',
        padding: tokens.space3,
        borderRadius: tokens.radiusLg,
        border: `1px solid ${value ? tokens.colorSurfaceBrand : palette.borderDefault}`,
        backgroundColor: disabled ? palette.surfaceSecondary : palette.surfacePrimary,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: tokens.space3,
        cursor: disabled ? 'not-allowed' : 'pointer',
        textAlign: 'left',
        transition: 'border-color 160ms ease, background-color 160ms ease',
        ...style,
      }}
    >
      <span style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
        <Text as="span" variant="labelMd" tone={disabled ? 'disabled' : 'primary'}>
          {label}
        </Text>
        {description ? (
          <Text as="span" id={descriptionId} variant="bodySm" tone={disabled ? 'disabled' : 'secondary'}>
            {description}
          </Text>
        ) : null}
      </span>

      <span
        aria-hidden="true"
        style={{
          width: 52,
          minWidth: 52,
          height: 32,
          padding: 4,
          borderRadius: 999,
          backgroundColor: value
            ? disabled
              ? '#9DB6E8'
              : tokens.colorSurfaceBrand
            : palette.borderStrong,
          display: 'inline-flex',
          alignItems: 'center',
          justifyContent: value ? 'flex-end' : 'flex-start',
          transition: 'background-color 160ms ease, justify-content 160ms ease',
        }}
      >
        <span
          style={{
            width: 24,
            height: 24,
            borderRadius: '50%',
            backgroundColor: palette.surfacePrimary,
            boxShadow: '0 2px 6px rgba(15, 23, 42, 0.24)',
          }}
        />
      </span>
    </button>
  );
}

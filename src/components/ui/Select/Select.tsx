import type { CSSProperties } from 'react';
import { useId } from 'react';

import { useTheme } from '../../providers/ThemeProvider';
import tokens from '../../../tokens';
import { FieldError } from '../FieldError';
import { Text } from '../Text';

export type SelectOption = {
  value: string;
  label: string;
  disabled?: boolean;
};

export type SelectProps = {
  label: string;
  value: string;
  options: SelectOption[];
  onChange: (value: string) => void;
  error?: string;
  description?: string;
  placeholder?: string;
  name?: string;
  required?: boolean;
  disabled?: boolean;
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function Select({
  label,
  value,
  options,
  onChange,
  error,
  description,
  placeholder = '選択してください',
  name,
  required = false,
  disabled = false,
  testID,
  style,
  className,
}: SelectProps) {
  const selectId = useId();
  const labelId = `${selectId}-label`;
  const errorId = `${selectId}-error`;
  const descriptionId = `${selectId}-description`;
  const { palette } = useTheme();

  const describedBy = [description ? descriptionId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ');

  return (
    <div
      className={className}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: tokens.space2,
        width: '100%',
        ...style,
      }}
    >
      <Text as="label" id={labelId} htmlFor={selectId} variant="bodySm">
        {label}
      </Text>
      {description ? (
        <Text as="p" id={descriptionId} variant="bodySm" tone="secondary">
          {description}
        </Text>
      ) : null}
      <div style={{ position: 'relative' }}>
        <select
          id={selectId}
          data-testid={testID}
          name={name}
          value={value}
          disabled={disabled}
          required={required}
          aria-label={label}
          aria-labelledby={labelId}
          aria-invalid={error ? true : undefined}
          aria-errormessage={error ? errorId : undefined}
          aria-describedby={describedBy || undefined}
          onChange={(event) => onChange(event.target.value)}
          style={{
            width: '100%',
            minHeight: tokens.controlHeightMd,
            borderRadius: tokens.radiusMd,
            border: `1px solid ${error ? tokens.colorBorderDanger : palette.borderDefault}`,
            backgroundColor: disabled ? palette.surfaceSecondary : palette.surfacePrimary,
            color: disabled ? palette.contentDisabled : palette.contentPrimary,
            paddingInline: 14,
            paddingBlock: 10,
            paddingRight: 40,
            fontSize: 16,
            lineHeight: '24px',
            outlineColor: tokens.colorFocus,
            appearance: 'none',
          }}
        >
          <option value="" disabled={required}>
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} disabled={option.disabled}>
              {option.label}
            </option>
          ))}
        </select>
        <span
          aria-hidden="true"
          style={{
            position: 'absolute',
            right: 14,
            top: '50%',
            transform: 'translateY(-50%)',
            color: palette.contentSecondary,
            pointerEvents: 'none',
          }}
        >
          ▾
        </span>
      </div>
      <div id={errorId}>
        <FieldError message={error} />
      </div>
    </div>
  );
}

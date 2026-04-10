import type { CSSProperties, InputHTMLAttributes } from 'react';
import { useId } from 'react';

import tokens from '../../../tokens';
import { FieldError } from '../FieldError';
import { Text } from '../Text';

export type TextInputProps = {
  label: string;
  value: string;
  onChangeText: (value: string) => void;
  error?: string;
  description?: string;
  placeholder?: string;
  type?: InputHTMLAttributes<HTMLInputElement>['type'];
  name?: string;
  required?: boolean;
  disabled?: boolean;
  autoComplete?: InputHTMLAttributes<HTMLInputElement>['autoComplete'];
  inputMode?: InputHTMLAttributes<HTMLInputElement>['inputMode'];
  enterKeyHint?: InputHTMLAttributes<HTMLInputElement>['enterKeyHint'];
  autoFocus?: boolean;
  onBlur?: InputHTMLAttributes<HTMLInputElement>['onBlur'];
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function TextInput({
  label,
  value,
  onChangeText,
  error,
  description,
  placeholder,
  type = 'text',
  name,
  required = false,
  disabled = false,
  autoComplete,
  inputMode,
  enterKeyHint,
  autoFocus = false,
  onBlur,
  testID,
  style,
  className,
}: TextInputProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const descriptionId = `${inputId}-description`;
  const labelId = `${inputId}-label`;

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
      <Text as="label" id={labelId} htmlFor={inputId} variant="bodySm">
        {label}
      </Text>
      {description ? (
        <Text as="p" id={descriptionId} variant="bodySm" tone="secondary">
          {description}
        </Text>
      ) : null}
      <input
        id={inputId}
        data-testid={testID}
        name={name}
        type={type}
        value={value}
        disabled={disabled}
        required={required}
        placeholder={placeholder}
        autoComplete={autoComplete}
        inputMode={inputMode}
        enterKeyHint={enterKeyHint}
        autoFocus={autoFocus}
        aria-label={label}
        aria-labelledby={labelId}
        aria-invalid={error ? true : undefined}
        aria-errormessage={error ? errorId : undefined}
        aria-describedby={describedBy || undefined}
        onBlur={onBlur}
        onChange={(event) => onChangeText(event.target.value)}
        style={{
          width: '100%',
          minHeight: tokens.controlHeightMd,
          borderRadius: tokens.radiusMd,
          border: `1px solid ${error ? tokens.colorBorderDanger : tokens.colorBorderDefault}`,
          backgroundColor: disabled ? tokens.colorSurfaceSecondary : tokens.colorSurfacePrimary,
          color: disabled ? tokens.colorContentDisabled : tokens.colorContentPrimary,
          paddingInline: 14,
          paddingBlock: 10,
          fontSize: 16,
          lineHeight: '24px',
          outlineColor: tokens.colorFocus,
        }}
      />
      <div id={errorId}>
        <FieldError message={error} />
      </div>
    </div>
  );
}

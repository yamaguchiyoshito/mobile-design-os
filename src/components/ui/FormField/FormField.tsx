import type { CSSProperties, InputHTMLAttributes } from 'react';
import { useId } from 'react';

import tokens from '../../../tokens';
import { FieldError } from '../FieldError';
import { Text } from '../Text';

export type FormFieldProps = {
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
  onBlur?: InputHTMLAttributes<HTMLInputElement>['onBlur'];
  testID?: string;
  style?: CSSProperties;
  className?: string;
};

export function FormField({
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
  onBlur,
  testID,
  style,
  className,
}: FormFieldProps) {
  const inputId = useId();
  const errorId = `${inputId}-error`;
  const descriptionId = `${inputId}-description`;

  const describedBy = [description ? descriptionId : null, error ? errorId : null]
    .filter(Boolean)
    .join(' ');

  const inputStyle: CSSProperties = {
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
  };

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
      <Text as="label" htmlFor={inputId} variant="bodySm">
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
        aria-label={label}
        aria-invalid={error ? true : undefined}
        aria-errormessage={error ? errorId : undefined}
        aria-describedby={describedBy || undefined}
        onBlur={onBlur}
        onChange={(event) => onChangeText(event.target.value)}
        style={inputStyle}
      />
      <div id={errorId}>
        <FieldError message={error} />
      </div>
    </div>
  );
}

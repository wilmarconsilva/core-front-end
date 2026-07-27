import React from 'react';
import { Platform } from 'react-native';
import { IDateFieldProps } from '../Interfaces/Fields/IDateFieldProps';
import { webDateInputStyle } from '../Styles';
import { FormField } from './FormField';

export function DateField({ label, error, style, ...inputProps }: IDateFieldProps) {
  const { value, onChangeText, onSubmitEditing, editable, ...rest } = inputProps;

  if (Platform.OS === 'web') {
    return (
      <FormField label={label} error={error}>
        <input
          type="date"
          value={typeof value === 'string' ? value : ''}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => onChangeText?.(e.target.value)}
          onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) => {
            if (e.key !== 'Enter') return;
            e.preventDefault();
            (onSubmitEditing as (() => void) | undefined)?.();
          }}
          disabled={editable === false}
          style={webDateInputStyle(!!error)}
          aria-invalid={error ? true : undefined}
        />
      </FormField>
    );
  }

  return (
    <FormField
      label={label}
      error={error}
      placeholder="dd/mm/aaaa"
      style={style}
      value={value}
      onChangeText={onChangeText}
      onSubmitEditing={onSubmitEditing}
      editable={editable}
      {...rest}
    />
  );
}

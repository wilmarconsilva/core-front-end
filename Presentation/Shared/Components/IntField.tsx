import React, { useCallback } from 'react';
import { FormField } from './FormField';
import { IIntFieldProps } from '../Interfaces/Fields/IIntFieldProps';

function toDisplayValue(value: IIntFieldProps['value']): string {
  if (value === undefined || value === null) return '';
  return String(value);
}

export function IntField({ label, error, value, onChangeText, ...inputProps }: IIntFieldProps) {
  const handleChangeText = useCallback(
    (text: string) => {
      onChangeText?.(text.replace(/\D/g, ''));
    },
    [onChangeText],
  );

  return (
    <FormField
      label={label}
      error={error}
      keyboardType="number-pad"
      value={toDisplayValue(value)}
      onChangeText={handleChangeText}
      {...inputProps}
    />
  );
}

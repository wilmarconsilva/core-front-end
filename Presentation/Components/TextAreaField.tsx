import React from 'react';
import { FormField } from './FormField';
import { ITextAreaFieldProps } from '../Interfaces/Fields/ITextAreaFieldProps';

export function TextAreaField({ label, error, numberOfLines = 4, style, ...inputProps }: ITextAreaFieldProps) {
  return (
    <FormField
      label={label}
      error={error}
      multiline
      numberOfLines={numberOfLines}
      style={[{ height: numberOfLines * 24, textAlignVertical: 'top' }, style]}
      {...inputProps}
    />
  );
}

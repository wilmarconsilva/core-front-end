import React from 'react';
import CurrencyInput from 'react-native-currency-input';
import { FormField } from './FormField';
import { colors, formStyles } from '../Styles';
import { IDecimalFieldProps } from '../Interfaces/Fields/IDecimalFieldProps';

const PRECISION = 2;

export function DecimalField({
  label,
  error,
  value,
  onChangeValue,
  style,
  editable = true,
  ...inputProps
}: IDecimalFieldProps) {
  return (
    <FormField label={label} error={error}>
      <CurrencyInput
        value={value}
        onChangeValue={(newValue) => onChangeValue?.(newValue ?? 0)}
        separator=","
        delimiter="."
        precision={PRECISION}
        minValue={0}
        editable={editable}
        keyboardType="numeric"
        style={[formStyles.input, error ? formStyles.inputError : null, style]}
        placeholderTextColor={colors.textPlaceholder}
        autoCapitalize="none"
        autoCorrect={false}
        {...inputProps}
      />
    </FormField>
  );
}

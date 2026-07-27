import React, { useCallback } from 'react';
import { Text, TextInput, View } from 'react-native';
import MaskInput from 'react-native-mask-input';
import { IFormFieldProps } from '../Interfaces/Fields/IFormFieldProps';
import { colors, formStyles } from '../Styles';

export function FormField({
  label,
  error,
  style,
  children,
  mask,
  onChangeText,
  keyboardType,
  ...inputProps
}: IFormFieldProps) {
  const { onSubmitEditing, returnKeyType, ...restInput } = inputProps;

  const resolvedKeyboardType = keyboardType ?? (mask ? 'numeric' : undefined);

  const handleMaskedChange = useCallback(
    (masked: string, _unmasked: string, _obfuscated: string) => {
      onChangeText?.(masked);
    },
    [onChangeText],
  );

  const sharedInputStyle = [formStyles.input, error ? formStyles.inputError : null, style];

  return (
    <View style={formStyles.field}>
      <Text style={formStyles.label}>{label}</Text>
      {children ??
        (mask ? (
          <MaskInput
            {...restInput}
            style={sharedInputStyle}
            placeholderTextColor={colors.textPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType={returnKeyType ?? (onSubmitEditing ? 'search' : undefined)}
            onSubmitEditing={onSubmitEditing}
            keyboardType={resolvedKeyboardType}
            mask={mask}
            onChangeText={handleMaskedChange}
          />
        ) : (
          <TextInput
            {...restInput}
            style={sharedInputStyle}
            placeholderTextColor={colors.textPlaceholder}
            autoCapitalize="none"
            autoCorrect={false}
            returnKeyType={returnKeyType ?? (onSubmitEditing ? 'search' : undefined)}
            onSubmitEditing={onSubmitEditing}
            keyboardType={resolvedKeyboardType}
            onChangeText={onChangeText}
          />
        ))}
      {error ? <Text style={formStyles.fieldError}>{error}</Text> : null}
    </View>
  );
}

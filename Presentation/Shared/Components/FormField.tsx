import React, { useCallback, useState } from 'react';
import { Text, TextInput, TextInputProps, View } from 'react-native';
import MaskInput from 'react-native-mask-input';
import { IFormFieldProps } from '../Interfaces/Fields/IFormFieldProps';
import { colors, formStyles, interactionStyles } from '../Styles';

/** Derivados de TextInputProps para não fixar tipos que mudam entre versões do RN. */
type FocusHandler = NonNullable<TextInputProps['onFocus']>;
type BlurHandler = NonNullable<TextInputProps['onBlur']>;

export function FormField({
  label,
  error,
  style,
  children,
  mask,
  onChangeText,
  keyboardType,
  onFocus,
  onBlur,
  ...inputProps
}: IFormFieldProps) {
  const { onSubmitEditing, returnKeyType, ...restInput } = inputProps;

  const resolvedKeyboardType = keyboardType ?? (mask ? 'numeric' : undefined);

  const [isFocused, setIsFocused] = useState(false);

  // Compõe com o onFocus/onBlur que venha por props em vez de sobrescrevê-lo.
  const handleFocus = useCallback<FocusHandler>(
    (e) => {
      setIsFocused(true);
      onFocus?.(e);
    },
    [onFocus],
  );

  const handleBlur = useCallback<BlurHandler>(
    (e) => {
      setIsFocused(false);
      onBlur?.(e);
    },
    [onBlur],
  );

  const handleMaskedChange = useCallback(
    (masked: string, _unmasked: string, _obfuscated: string) => {
      onChangeText?.(masked);
    },
    [onChangeText],
  );

  const sharedInputStyle = [
    formStyles.input,
    error ? formStyles.inputError : null,
    !error && isFocused ? interactionStyles.focusRing : null,
    style,
  ];

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
            onFocus={handleFocus}
            onBlur={handleBlur}
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
            onFocus={handleFocus}
            onBlur={handleBlur}
          />
        ))}
      {error ? <Text style={formStyles.fieldError}>{error}</Text> : null}
    </View>
  );
}

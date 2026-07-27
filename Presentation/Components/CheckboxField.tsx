import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Text, TouchableOpacity, View } from 'react-native';
import { ICheckboxFieldProps } from '../Interfaces/Fields/ICheckboxFieldProps';
import { checkboxFieldStyles as styles, colors, formStyles } from '../Styles';

export function CheckboxField({
  label,
  error,
  value,
  onValueChange,
  disabled,
}: ICheckboxFieldProps) {
  return (
    <View style={formStyles.field}>
      <TouchableOpacity
        style={styles.row}
        onPress={() => !disabled && onValueChange(!value)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Ionicons
          name={value ? 'checkbox' : 'square-outline'}
          size={22}
          color={value ? colors.primary : colors.textSecondary}
        />
        <Text style={styles.label}>{label}</Text>
      </TouchableOpacity>
      {error ? <Text style={formStyles.fieldError}>{error}</Text> : null}
    </View>
  );
}

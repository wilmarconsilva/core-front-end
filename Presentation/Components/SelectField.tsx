import React, { useState } from 'react';
import {
  Modal,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import type { ISelectOption } from '../Interfaces/SelectField/ISelectOption';
import { ISelectFieldProps } from '../Interfaces/SelectField/ISelectFieldProps';
import { formStyles, selectFieldStyles as styles } from '../Styles';

export type { ISelectOption } from '../Interfaces/SelectField/ISelectOption';

export function SelectField<T = string | number>({
  label,
  value,
  options,
  onValueChange,
  placeholder = 'Selecione...',
  error,
  disabled,
}: ISelectFieldProps<T>) {
  const [isOpen, setIsOpen] = useState(false);

  const selectedOption = options.find(o => o.value === value);

  const handleSelect = (option: ISelectOption<T>) => {
    onValueChange(option.value);
    setIsOpen(false);
  };

  return (
    <View style={formStyles.field}>
      <Text style={formStyles.label}>{label}</Text>
      <TouchableOpacity
        style={[styles.trigger, error ? styles.triggerError : null]}
        onPress={() => !disabled && setIsOpen(true)}
        activeOpacity={0.7}
        disabled={disabled}
      >
        <Text
          style={[styles.triggerText, !selectedOption ? styles.placeholder : null]}
          numberOfLines={1}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
        <Text style={styles.arrow}>▼</Text>
      </TouchableOpacity>
      {error ? <Text style={formStyles.fieldError}>{error}</Text> : null}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.overlay}
          activeOpacity={1}
          onPress={() => setIsOpen(false)}
        >
          <View style={styles.dropdown}>
            <View style={styles.dropdownHeader}>
              <Text style={styles.dropdownHeaderText}>{label}</Text>
            </View>
            <ScrollView keyboardShouldPersistTaps="handled">
              {options.map((option, index) => {
                const isSelected = option.value === value;
                return (
                  <TouchableOpacity
                    key={index}
                    style={[styles.option, isSelected ? styles.optionSelected : null]}
                    onPress={() => handleSelect(option)}
                    activeOpacity={0.7}
                  >
                    <Text style={[styles.optionText, isSelected ? styles.optionTextSelected : null]}>
                      {option.label}
                    </Text>
                  </TouchableOpacity>
                );
              })}
              <TouchableOpacity style={styles.cancelOption} onPress={() => setIsOpen(false)}>
                <Text style={styles.cancelText}>Cancelar</Text>
              </TouchableOpacity>
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );
}

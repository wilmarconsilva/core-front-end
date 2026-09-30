import { TextInputProps } from 'react-native';
import { ILabeledFieldBase } from './ILabeledFieldBase';

export interface IDecimalFieldProps
  extends Omit<TextInputProps, 'keyboardType' | 'value' | 'onChangeText'>,
    ILabeledFieldBase {
  value: number;
  onChangeValue?: (value: number) => void;
}

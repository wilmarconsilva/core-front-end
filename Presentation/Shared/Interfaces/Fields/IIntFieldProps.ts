import { TextInputProps } from 'react-native';
import { ILabeledFieldBase } from './ILabeledFieldBase';

export interface IIntFieldProps
  extends Omit<TextInputProps, 'keyboardType' | 'value'>,
    ILabeledFieldBase {
  value?: string | number;
}

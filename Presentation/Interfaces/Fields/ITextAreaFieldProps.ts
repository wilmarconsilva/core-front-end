import { TextInputProps } from 'react-native';
import { ILabeledFieldBase } from './ILabeledFieldBase';

export interface ITextAreaFieldProps
  extends Omit<TextInputProps, 'multiline' | 'numberOfLines'>,
    ILabeledFieldBase {
  numberOfLines?: number;
}

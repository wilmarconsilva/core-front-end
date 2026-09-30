import { TextInputProps } from 'react-native';
import { ILabeledFieldBase } from './ILabeledFieldBase';

export interface IDateFieldProps extends Omit<TextInputProps, 'keyboardType'>, ILabeledFieldBase {}

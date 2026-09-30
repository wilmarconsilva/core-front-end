import { TextInputProps } from 'react-native';
import { ILabeledFieldBase } from './ILabeledFieldBase';

export interface IPasswordFieldProps extends Omit<TextInputProps, 'secureTextEntry'>, ILabeledFieldBase {}

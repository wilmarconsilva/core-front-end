import { ReactNode } from 'react';
import type { Mask } from 'react-native-mask-input';
import { TextInputProps } from 'react-native';
import { ILabeledFieldBase } from './ILabeledFieldBase';

export interface IFormFieldProps extends TextInputProps, ILabeledFieldBase {
  children?: ReactNode;
  /** Usa `MaskInput` de `react-native-mask-input` quando informado. */
  mask?: Mask;
}

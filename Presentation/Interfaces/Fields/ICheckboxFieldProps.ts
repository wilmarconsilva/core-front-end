import { ILabeledFieldBase } from './ILabeledFieldBase';

export interface ICheckboxFieldProps extends ILabeledFieldBase {
  value: boolean;
  onValueChange: (value: boolean) => void;
  disabled?: boolean;
}

import { ISelectOption } from './ISelectOption';

export interface ISelectFieldProps<T = string | number> {
  label: string;
  value?: T;
  options: ISelectOption<T>[];
  onValueChange: (value: T) => void;
  placeholder?: string;
  error?: string;
  disabled?: boolean;
}

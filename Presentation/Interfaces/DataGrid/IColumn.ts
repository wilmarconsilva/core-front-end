import { ReactNode } from 'react';

export interface IColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode;
  flex?: number;
  minWidth?: number;
}

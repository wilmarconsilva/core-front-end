import { ReactNode } from 'react';

/** Alinhamento horizontal do conteúdo de uma coluna. */
export type ColumnAlign = 'left' | 'center' | 'right';

export interface IColumn<T> {
  key: keyof T | string;
  label: string;
  render?: (item: T) => ReactNode;
  flex?: number;
  minWidth?: number;
  /**
   * Alinhamento do conteúdo. Padrão: 'left'.
   * Use 'right' para números e moeda (alinha as vírgulas) e 'center' para datas.
   */
  align?: ColumnAlign;
}

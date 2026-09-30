import { ReactNode } from 'react';
import { IColumn } from '../DataGrid/IColumn';

export interface IEntitySelectFieldProps<TListing, TFilter> {
  label: string;
  value?: number | string;
  /** Texto exibido quando há `value` mas o registro ainda não está em `listings` (ex.: edição, página diferente). */
  selectedDisplayLabel?: string;
  placeholder?: string;
  error?: string;
  disabled?: boolean;

  listings: TListing[];
  isLoading: boolean;
  onLoadData: (filter: TFilter) => Promise<void>;

  pageSize: number;
  buildFilter: (page: number, filterValues: Record<string, any>) => TFilter;
  /** Estado dos campos de filtro (filhos); chaves devem bater com as usadas em `buildFilter`. */
  filterValues?: Record<string, any>;

  columns: IColumn<TListing>[];
  keyExtractor: (item: TListing) => string;
  labelExtractor: (item: TListing) => string;

  onValueChange: (item: TListing) => void;
  /** Campos de filtro; use `onSubmitEditing={onSubmitSearch}` nos inputs para Enter = Buscar. */
  renderFilter?: (onSubmitSearch: () => void | Promise<void>) => ReactNode;
}

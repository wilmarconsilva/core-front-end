import { ReactNode } from 'react';
import { IColumn } from './IColumn';

export interface IDataGridProps<T> {
  columns: IColumn<T>[];
  data: T[];
  isLoading: boolean;
  page: number;
  pageSize: number;
  onPageChange: (page: number) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
  canMutateItem?: (item: T) => boolean;
  onRowPress?: (item: T) => void;
  keyExtractor: (item: T) => string;
  extraActions?: (item: T) => ReactNode;
  emptyGridMessage?: string;
}

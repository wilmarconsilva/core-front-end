import { ReactNode } from 'react';

export interface IFilterActionBarProps {
  /** Filter fields to render on the left side */
  children: ReactNode;
  onSearch: () => void;
  onNew?: () => void;
  newLabel?: string;
  isSearching?: boolean;
}

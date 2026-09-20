import { ReactNode } from 'react';
import { ScrollViewProps } from 'react-native';

export interface IScreenScrollViewProps extends ScrollViewProps {
  children: ReactNode;
}

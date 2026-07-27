import { ReactNode } from 'react';

export interface IScreenTransitionProps {
  /** A unique key for the current screen; change triggers the transition animation. */
  screenKey: string;
  children: ReactNode;
}

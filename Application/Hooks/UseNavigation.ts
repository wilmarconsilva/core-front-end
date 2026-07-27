import { useState } from 'react';

export type Screen =
  | { name: 'home' }
  | { name: 'customers' }
  | { name: 'customerForm'; id?: number }
  | { name: 'products' }
  | { name: 'productForm'; id?: number }
  | { name: 'budgets' }
  | { name: 'budgetForm'; id?: number }
  | { name: 'orders' }
  | { name: 'orderForm'; id?: number }
  | { name: 'localities' }
  | { name: 'localityForm'; id?: number }
  | { name: 'reports' }
  | { name: 'budgetReport' }
  | { name: 'orderReport' }
  | { name: 'synchronizationPendencies' };

export interface IUseNavigationResult {
  currentScreen: Screen;
  navigate: (screen: Screen) => void;
  goBack: () => void;
}

export function UseNavigation(): IUseNavigationResult {
  const [stack, setStack] = useState<Screen[]>([{ name: 'home' }]);

  const currentScreen = stack[stack.length - 1];

  const navigate = (screen: Screen) => {
    setStack(prev => [...prev, screen]);
  };

  const goBack = () => {
    setStack(prev => (prev.length > 1 ? prev.slice(0, -1) : prev));
  };

  return { currentScreen, navigate, goBack };
}

import { useEffect, useMemo } from 'react';
import { UseBudgets } from '../../Budgets/Hooks/UseBudgets';
import { OrderFormService, OrderFormState } from '../Services/OrderFormService';

export interface IOrderSeedFromBudget {
  seedForm: OrderFormState | null;
  isLoadingSeed: boolean;
}

/**
 * Traduz um orçamento no estado inicial do formulário de pedido.
 * Único ponto de acoplamento entre Pedido e Orçamento.
 */
export function UseOrderSeedFromBudget(budgetId: number | undefined): IOrderSeedFromBudget {
  const { currentItem, isLoadingItem, loadById, clearCurrentItem } = UseBudgets();

  useEffect(() => {
    if (!budgetId) return;

    loadById(budgetId);

    return () => clearCurrentItem();
  }, [budgetId]);

  const seedForm = useMemo(
    () => (budgetId && currentItem ? OrderFormService.budgetToForm(currentItem) : null),
    [budgetId, currentItem],
  );

  return { seedForm, isLoadingSeed: !!budgetId && isLoadingItem };
}

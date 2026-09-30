import { useState } from 'react';
import { UseOrders } from './UseOrders';
import { UseOrderSeedFromBudget } from './UseOrderSeedFromBudget';
import { IOrderProductSaveDto } from '../DataTransferObjects/IOrderProductSaveDto';
import { IOrderDetailDto } from '../DataTransferObjects/IOrderDetailDto';
import { IOrderSaveDto } from '../DataTransferObjects/IOrderSaveDto';
import { OrderFormService, OrderFormState } from '../Services/OrderFormService';
import { UseDocumentForm } from '../../Hooks/UseDocumentForm';

export function UseOrderForm(id: number | undefined, sourceBudgetId: number | undefined, onGoBack: () => void) {
  const [budgetId, setBudgetId] = useState(() => OrderFormService.createInitialForm().budgetId);
  const { seedForm, isLoadingSeed } = UseOrderSeedFromBudget(sourceBudgetId);

  const form = UseDocumentForm<
    IOrderProductSaveDto,
    OrderFormState,
    IOrderDetailDto,
    IOrderSaveDto
  >({
    id,
    onGoBack,
    useDocument: UseOrders,
    formService: OrderFormService,
    applyExtraFormState: (form) => setBudgetId(form.budgetId),
    getExtraFormState: () => ({ budgetId }),
    seedForm,
    isLoadingSeed,
  });

  return { ...form, budgetId };
}

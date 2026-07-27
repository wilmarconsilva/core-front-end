import { useState } from 'react';
import { UseOrders } from './UseOrders';
import { IOrderProductSaveDto } from '../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderProductSaveDto';
import { IOrderDetailDto } from '../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderDetailDto';
import { IOrderSaveDto } from '../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderSaveDto';
import { OrderFormService, OrderFormState } from '../Services/Commercial/Documents/Orders/OrderFormService';
import { UseCommercialDocumentForm } from './UseCommercialDocumentForm';

export function UseOrderForm(id: number | undefined, onGoBack: () => void) {
  const [budgetId, setBudgetId] = useState(() => OrderFormService.createInitialForm().budgetId);

  return UseCommercialDocumentForm<
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
    extraReturn: { budgetId },
  });
}

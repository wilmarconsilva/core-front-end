import { UseBudgets } from './UseBudgets';
import { IBudgetProductSaveDto } from '../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetProductSaveDto';
import { IBudgetDetailDto } from '../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetDetailDto';
import { IBudgetSaveDto } from '../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetSaveDto';
import { BudgetFormService, BudgetFormState } from '../Services/Commercial/Documents/Budgets/BudgetFormService';
import { UseCommercialDocumentForm } from './UseCommercialDocumentForm';

export function UseBudgetForm(id: number | undefined, onGoBack: () => void) {
  return UseCommercialDocumentForm<
    IBudgetProductSaveDto,
    BudgetFormState,
    IBudgetDetailDto,
    IBudgetSaveDto
  >({
    id,
    onGoBack,
    useDocument: UseBudgets,
    formService: BudgetFormService,
  });
}

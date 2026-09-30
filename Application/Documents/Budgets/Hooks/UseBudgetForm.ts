import { UseBudgets } from './UseBudgets';
import { IBudgetProductSaveDto } from '../DataTransferObjects/IBudgetProductSaveDto';
import { IBudgetDetailDto } from '../DataTransferObjects/IBudgetDetailDto';
import { IBudgetSaveDto } from '../DataTransferObjects/IBudgetSaveDto';
import { BudgetFormService, BudgetFormState } from '../Services/BudgetFormService';
import { UseDocumentForm } from '../../Hooks/UseDocumentForm';

export function UseBudgetForm(id: number | undefined, onGoBack: () => void) {
  return UseDocumentForm<
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

import { useMemo } from 'react';
import { OfflineCompositionRoot } from '../../Infrastructure/Persistence/OfflineCompositionRoot';
import { IBudgetSaveDto } from '../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetSaveDto';
import { IBudgetDetailDto } from '../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetDetailDto';
import { IBudgetListing } from '../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetListing';
import { IBudgetListingFilter } from '../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetListingFilter';
import { UseCrud, UseCrudResult } from './UseCrud';

const budgetService = OfflineCompositionRoot.createBudgetService();

export type UseBudgetsResult = UseCrudResult<IBudgetSaveDto, IBudgetDetailDto, IBudgetListing, IBudgetListingFilter>;

export function UseBudgets(): UseBudgetsResult {
  const service = useMemo(() => budgetService, []);

  return UseCrud(service);
}

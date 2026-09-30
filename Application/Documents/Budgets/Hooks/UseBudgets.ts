import { UseApplicationServices } from '../../../DependencyInjection/UseApplicationServices';
import { IBudgetSaveDto } from '../DataTransferObjects/IBudgetSaveDto';
import { IBudgetDetailDto } from '../DataTransferObjects/IBudgetDetailDto';
import { IBudgetListing } from '../DataTransferObjects/IBudgetListing';
import { IBudgetListingFilter } from '../DataTransferObjects/IBudgetListingFilter';
import { UseCrud, UseCrudResult } from '../../../Shared/Hooks/UseCrud';

export type UseBudgetsResult = UseCrudResult<IBudgetSaveDto, IBudgetDetailDto, IBudgetListing, IBudgetListingFilter>;

export function UseBudgets(): UseBudgetsResult {
  const { budgetService } = UseApplicationServices();

  return UseCrud(budgetService);
}

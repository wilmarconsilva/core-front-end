import { CrudService } from '../../../Shared/Services/CrudService';
import { IBudgetService } from './Interfaces/IBudgetService';
import { IBudgetSaveDto } from '../DataTransferObjects/IBudgetSaveDto';
import { IBudgetDetailDto } from '../DataTransferObjects/IBudgetDetailDto';
import { IBudgetListing } from '../DataTransferObjects/IBudgetListing';
import { IBudgetListingFilter } from '../DataTransferObjects/IBudgetListingFilter';

export class BudgetService
  extends CrudService<IBudgetSaveDto, IBudgetDetailDto, IBudgetListing, IBudgetListingFilter>
  implements IBudgetService
{
  constructor() {
    super('/budgets');
  }
}

import { DocumentService } from '../DocumentService';
import { DocumentTemplateMapper } from '../DocumentTemplateMapper';
import { IBudgetService } from '../../../../Interfaces/Services/IBudgetService';
import { IBudgetSaveDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetSaveDto';
import { IBudgetDetailDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetDetailDto';
import { IBudgetListing } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetListing';
import { IBudgetListingFilter } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetListingFilter';
import { IDocumentTemplate } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/IDocumentTemplate';
import { BudgetTemplateService } from './BudgetTemplateService';

export class BudgetService
  extends DocumentService<IBudgetSaveDto, IBudgetDetailDto, IBudgetListing, IBudgetListingFilter>
  implements IBudgetService
{
  protected readonly templateService = new BudgetTemplateService();

  constructor() {
    super('/budgets');
  }

  protected getTemplate(detail: IBudgetDetailDto): IDocumentTemplate {
    return DocumentTemplateMapper.fromDetail(detail, 'Orçamento');
  }
}

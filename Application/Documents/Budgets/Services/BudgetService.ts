import { DocumentService } from '../../Services/DocumentService';
import { DocumentTemplateMapper } from '../../Services/DocumentTemplateMapper';
import { IBudgetService } from './Interfaces/IBudgetService';
import { IBudgetSaveDto } from '../DataTransferObjects/IBudgetSaveDto';
import { IBudgetDetailDto } from '../DataTransferObjects/IBudgetDetailDto';
import { IBudgetListing } from '../DataTransferObjects/IBudgetListing';
import { IBudgetListingFilter } from '../DataTransferObjects/IBudgetListingFilter';
import { IDocumentTemplate } from '../../DataTransferObjects/IDocumentTemplate';
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

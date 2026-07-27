import { DocumentService } from '../DocumentService';
import { DocumentTemplateMapper } from '../DocumentTemplateMapper';
import { IBudgetService } from '../../../../Interfaces/Services/IBudgetService';
import { IBudgetSaveDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetSaveDto';
import { IBudgetDetailDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetDetailDto';
import { IBudgetListing } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetListing';
import { IBudgetListingFilter } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetListingFilter';
import { IOrderByBudgetDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderByBudgetDto';
import { IOrderDetailDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderDetailDto';
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

  async createOrderByBudget(id: number, dto: IOrderByBudgetDto): Promise<IOrderDetailDto> {
    return this.request<IOrderDetailDto>(`/budgets/${id}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(dto),
    });
  }

  protected getTemplate(detail: IBudgetDetailDto): IDocumentTemplate {
    return DocumentTemplateMapper.fromDetail(detail, 'Orçamento');
  }
}

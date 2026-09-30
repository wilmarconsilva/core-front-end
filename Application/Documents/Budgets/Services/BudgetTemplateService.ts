import { ITemplateService } from '../../Services/Interfaces/ITemplateService';
import { IDocumentTemplate } from '../../DataTransferObjects/IDocumentTemplate';
import { get } from '../../Templates/DocumentHtmlTemplate';

export class BudgetTemplateService implements ITemplateService {
  render(data: IDocumentTemplate): string {
    return get({ ...data, documentTitle: 'Orçamento' });
  }
}

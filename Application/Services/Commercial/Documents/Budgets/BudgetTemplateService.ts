import { ITemplateService } from '../../../../Interfaces/DataTransferObjects/Templates/ITemplateService';
import { IDocumentTemplate } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/IDocumentTemplate';
import { get } from '../../../../../Presentation/Templates/DocumentHtmlTemplate';

export class BudgetTemplateService implements ITemplateService {
  render(data: IDocumentTemplate): string {
    return get({ ...data, documentTitle: 'Orçamento' });
  }
}

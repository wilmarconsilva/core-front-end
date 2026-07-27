import { ITemplateService } from '../../../../Interfaces/DataTransferObjects/Templates/ITemplateService';
import { IDocumentTemplate } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/IDocumentTemplate';
import { get } from '../../../../../Presentation/Templates/DocumentHtmlTemplate';

export class OrderTemplateService implements ITemplateService {
  render(data: IDocumentTemplate): string {
    return get({ ...data, documentTitle: 'Pedido' });
  }
}

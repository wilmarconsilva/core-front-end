import { IDocumentTemplate } from '../../DataTransferObjects/IDocumentTemplate';

export interface ITemplateService {
  render(data: IDocumentTemplate): string;
}

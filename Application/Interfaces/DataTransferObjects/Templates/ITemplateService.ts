import { IDocumentTemplate } from '../Commercial/Documents/IDocumentTemplate';

export interface ITemplateService {
  render(data: IDocumentTemplate): string;
}

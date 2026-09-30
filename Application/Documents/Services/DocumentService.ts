import { Platform } from 'react-native';
import { CrudService } from '../../Shared/Services/CrudService';
import { DocumentPrintFn } from '../Hooks/UseDocumentPrint';
import { ITemplateService } from './Interfaces/ITemplateService';
import { IDocumentTemplate } from '../DataTransferObjects/IDocumentTemplate';

export abstract class DocumentService<
  TSaveDto,
  TDetailDto,
  TListing,
  TFilter,
> extends CrudService<TSaveDto, TDetailDto, TListing, TFilter> {
  protected abstract readonly templateService: ITemplateService;

  protected abstract getTemplate(detail: TDetailDto): IDocumentTemplate;

  async generatePdf(detail: TDetailDto, printHtml: DocumentPrintFn): Promise<void> {
    if (Platform.OS !== 'web') return;
    try {
      const html = this.templateService.render(this.getTemplate(detail));
      await printHtml(html);
    } catch {
      // Handled by service
    }
  }
}

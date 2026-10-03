import { IDocumentDetailDto } from '../DocumentFormService';
import { ITemplateService } from './ITemplateService';

/** Documento a imprimir: o detalhe montado a partir do formulário (pode ainda não estar salvo). */
export type DocumentPdfDetail = IDocumentDetailDto & { id: number; budgetId?: number };

export interface IDocumentPdfService {
  /** Reúne os dados complementares (cliente, vendedor) e devolve o HTML pronto para impressão. */
  render(detail: DocumentPdfDetail, templateService: ITemplateService): Promise<string>;
}

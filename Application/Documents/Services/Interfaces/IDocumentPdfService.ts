import { IDocumentDetailDto } from '../../DataTransferObjects/IDocumentDetailDto';

/** Documento a imprimir: o detalhe montado a partir do formulário (pode ainda não estar salvo). */
export type DocumentPdfDetail = IDocumentDetailDto & { id: number; budgetId?: number };

export interface IDocumentPdfFile {
  fileName: string;
  content: Blob;
}

export interface IDocumentPdfService {
  /** Reúne os dados complementares (cliente, vendedor) e devolve o PDF pronto para salvar/compartilhar. */
  generate(detail: DocumentPdfDetail, documentTitle: string): Promise<IDocumentPdfFile>;
}

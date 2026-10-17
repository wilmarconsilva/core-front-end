import pdfMake from 'pdfmake';
import { IDocumentTemplate } from '../../../Application/Documents/DataTransferObjects/IDocumentTemplate';
import { IDocumentPdfRenderer } from '../../../Application/Documents/Services/Interfaces/IDocumentPdfRenderer';
import { DOCUMENT_PDF_FONT_FAMILY, get } from './DocumentPdfDefinition';

/**
 * Arquivos servidos de `public/` e pré-carregados pelo service worker, para gerar o PDF também offline.
 * A versão da fonte faz parte do caminho: o service worker os serve do cache, então trocar os arquivos
 * exige um caminho novo (e a atualização da lista em `public/service-worker.js`).
 */
export const DOCUMENT_PDF_FONT_BASE_PATH = '/fonts/arimo-1.33/';

export const DocumentPdfFontFiles = {
  normal: 'Arimo-Regular.ttf',
  bold: 'Arimo-Bold.ttf',
  italics: 'Arimo-Italic.ttf',
} as const;

/** Adapter do pdfmake: registra a fonte (baixada sob demanda pelo próprio pdfmake) e gera o PDF. */
export class PdfMakeDocumentRenderer implements IDocumentPdfRenderer {
  private isConfigured = false;

  async render(data: IDocumentTemplate): Promise<Blob> {
    this.configure();
    return pdfMake.createPdf(get(data)).getBlob();
  }

  private configure(): void {
    if (this.isConfigured) return;

    const fontBaseUrl = new URL(DOCUMENT_PDF_FONT_BASE_PATH, window.location.origin).href;
    const font = (fileName: string) => `${fontBaseUrl}${fileName}`;

    pdfMake.addFonts({
      [DOCUMENT_PDF_FONT_FAMILY]: {
        normal: font(DocumentPdfFontFiles.normal),
        bold: font(DocumentPdfFontFiles.bold),
        italics: font(DocumentPdfFontFiles.italics),
        // Not used by the layout; reuses the bold file to avoid shipping a fourth font.
        bolditalics: font(DocumentPdfFontFiles.bold),
      },
    });
    pdfMake.setUrlAccessPolicy((url) => url.startsWith(fontBaseUrl));

    this.isConfigured = true;
  }
}

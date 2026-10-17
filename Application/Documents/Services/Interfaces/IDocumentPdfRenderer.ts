import { IDocumentTemplate } from '../../DataTransferObjects/IDocumentTemplate';

/**
 * Porta de geração do arquivo PDF a partir do modelo de impressão. O PDF é montado pela aplicação,
 * e não pela impressão do navegador, para ter o mesmo layout em qualquer plataforma (o Safari do iOS,
 * por exemplo, sempre acrescenta URL e data ao imprimir e reduz a página para caber nas margens).
 */
export interface IDocumentPdfRenderer {
  render(data: IDocumentTemplate): Promise<Blob>;
}

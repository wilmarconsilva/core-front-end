/** Os dados do documento foram obtidos, mas o arquivo PDF não pôde ser montado. */
export class DocumentPdfGenerationError extends Error {
  constructor(cause: unknown) {
    super('Não foi possível gerar o PDF.', { cause });
    this.name = 'DocumentPdfGenerationError';
  }
}

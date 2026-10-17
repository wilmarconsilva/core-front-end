import { DocumentTemplateBuilder } from '../../Builders/DocumentTemplateBuilder';
import { PublicFolderHost } from '../../Fixtures/PublicFolderHost';
import {
  DOCUMENT_PDF_FONT_BASE_PATH,
  DocumentPdfFontFiles,
  type PdfMakeDocumentRenderer,
} from '../../../../Infrastructure/Documents/Pdf/PdfMakeDocumentRenderer';

type RendererModule = typeof import('../../../../Infrastructure/Documents/Pdf/PdfMakeDocumentRenderer');

const FONT_PATHS = Object.values(DocumentPdfFontFiles).map((fileName) => `${DOCUMENT_PDF_FONT_BASE_PATH}${fileName}`);

async function readPdf(blob: Blob): Promise<string> {
  return Buffer.from(await blob.arrayBuffer()).toString('latin1');
}

function countPages(pdf: string): number {
  return pdf.match(/\/Type \/Page\b(?!s)/g)?.length ?? 0;
}

/**
 * Geração do PDF com o build de navegador do pdfmake (o mesmo que o Metro empacota) e as fontes
 * reais de `public/`: um defeito no arquivo da fonte só aparece ao medir os caracteres impressos.
 */
describe('PdfMakeDocumentRenderer', () => {
  let host: PublicFolderHost;
  let renderer: PdfMakeDocumentRenderer;

  beforeEach(() => {
    host = new PublicFolderHost().install();

    // O pdfmake guarda as fontes baixadas num sistema de arquivos virtual global: cada teste parte do zero.
    jest.isolateModules(() => {
      const { PdfMakeDocumentRenderer: Renderer } = require('../../../../Infrastructure/Documents/Pdf/PdfMakeDocumentRenderer') as RendererModule;
      renderer = new Renderer();
    });
  });

  it('Render_DocumentWithCurrencyValues_ReturnsSinglePagePdf', async () => {
    const blob = await renderer.render(new DocumentTemplateBuilder().build());
    const pdf = await readPdf(blob);

    expect(blob.type).toBe('application/pdf');
    expect(pdf.startsWith('%PDF-')).toBe(true);
    expect(countPages(pdf)).toBe(1);
  });

  it('Render_DocumentWithManyProductsDiscountAndSignatures_ReturnsMultiPagePdf', async () => {
    const template = new DocumentTemplateBuilder().withProducts(30).withDiscount(250).signed().build();

    const pdf = await readPdf(await renderer.render(template));

    expect(countPages(pdf)).toBeGreaterThan(1);
  });

  it('Render_DocumentWithoutProducts_ReturnsPdf', async () => {
    const pdf = await readPdf(await renderer.render(new DocumentTemplateBuilder().withoutProducts().build()));

    expect(countPages(pdf)).toBe(1);
  });

  it('Render_FirstDocument_FetchesOnlyTheFontFilesFromPublicFolder', async () => {
    await renderer.render(new DocumentTemplateBuilder().build());

    expect(new Set(host.requestedPaths)).toEqual(new Set(FONT_PATHS));
  });
});

/** As fontes são baixadas pelo `fetch` do pdfmake: só ficam disponíveis offline se o service worker as pré-carregar. */
describe('Service worker', () => {
  it('Precache_DocumentPdfFontFiles_AreListed', () => {
    const serviceWorker = PublicFolderHost.readPublicFile('service-worker.js');

    for (const fontPath of FONT_PATHS) {
      expect(serviceWorker).toContain(`'${fontPath}'`);
    }
  });
});

import { useCallback } from 'react';
import { Platform } from 'react-native';
import { UseApplicationServices } from '../../DependencyInjection/UseApplicationServices';
import { DocumentPdfDetail } from '../Services/Interfaces/IDocumentPdfService';
import { ITemplateService } from '../Services/Interfaces/ITemplateService';
import { UseDocumentPrint } from './UseDocumentPrint';

export interface UseDocumentPdfResult {
  generatePdf: (detail: DocumentPdfDetail) => Promise<void>;
}

export function UseDocumentPdf(templateService: ITemplateService): UseDocumentPdfResult {
  const { documentPdfService } = UseApplicationServices();
  const { printHtml } = UseDocumentPrint();

  const generatePdf = useCallback(async (detail: DocumentPdfDetail) => {
    if (Platform.OS !== 'web') return;

    try {
      const html = await documentPdfService.render(detail, templateService);
      await printHtml(html);
    } catch {
      // Handled by services
    }
  }, [documentPdfService, templateService, printHtml]);

  return { generatePdf };
}

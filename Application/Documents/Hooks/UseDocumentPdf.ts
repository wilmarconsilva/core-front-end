import { useCallback } from 'react';
import { Platform } from 'react-native';
import Toast from 'react-native-toast-message';
import { RequiredDataUnavailableError } from '../../../Domain/Shared/Exceptions/RequiredDataUnavailableError';
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
    } catch (error) {
      // API and offline-mode errors are already notified by the services.
      if (error instanceof RequiredDataUnavailableError) {
        Toast.show({ type: 'info', text1: error.message });
      }
    }
  }, [documentPdfService, templateService, printHtml]);

  return { generatePdf };
}

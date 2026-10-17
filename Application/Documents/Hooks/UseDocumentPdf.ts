import { useCallback } from 'react';
import Toast from 'react-native-toast-message';
import { DocumentPdfGenerationError } from '../../../Domain/Documents/Exceptions/DocumentPdfGenerationError';
import { RequiredDataUnavailableError } from '../../../Domain/Shared/Exceptions/RequiredDataUnavailableError';
import { UseApplicationServices } from '../../DependencyInjection/UseApplicationServices';
import { UseFileSave } from '../../Shared/Hooks/UseFileSave';
import { DocumentPdfDetail } from '../Services/Interfaces/IDocumentPdfService';

export interface UseDocumentPdfResult {
  generatePdf: (detail: DocumentPdfDetail) => Promise<void>;
}

/** `documentTitle`: tipo do documento impresso no título e no nome do arquivo (ex.: "Orçamento"). */
export function UseDocumentPdf(documentTitle: string): UseDocumentPdfResult {
  const { documentPdfService } = UseApplicationServices();
  const { saveFile } = UseFileSave();

  const generatePdf = useCallback(async (detail: DocumentPdfDetail) => {
    try {
      const file = await documentPdfService.generate(detail, documentTitle);
      saveFile(file.content, file.fileName);
    } catch (error) {
      // API and offline-mode errors are already notified by the services.
      if (error instanceof RequiredDataUnavailableError) {
        Toast.show({ type: 'info', text1: error.message });
      } else if (error instanceof DocumentPdfGenerationError) {
        Toast.show({ type: 'error', text1: error.message });
      }
    }
  }, [documentPdfService, documentTitle, saveFile]);

  return { generatePdf };
}

import { DocumentPdfGenerationError } from '../../../Domain/Documents/Exceptions/DocumentPdfGenerationError';
import { RequiredDataUnavailableError } from '../../../Domain/Shared/Exceptions/RequiredDataUnavailableError';
import { ICustomerDetailDto } from '../../Persons/Customers/DataTransferObjects/ICustomerDetailDto';
import { ICurrentUserService } from '../../Persons/Users/Services/Interfaces/ICurrentUserService';
import { ILocalityDetailDto } from '../../Territories/Localities/DataTransferObjects/ILocalityDetailDto';
import { DocumentTemplateMapper } from './DocumentTemplateMapper';
import { IDocumentPdfRenderer } from './Interfaces/IDocumentPdfRenderer';
import { DocumentPdfDetail, IDocumentPdfFile, IDocumentPdfService } from './Interfaces/IDocumentPdfService';

interface IDetailReader<TDetailDto> {
  getById(id: number): Promise<TDetailDto>;
}

interface DocumentPdfDependencies {
  customerService: IDetailReader<ICustomerDetailDto>;
  localityService: IDetailReader<ILocalityDetailDto>;
  currentUserService: ICurrentUserService;
  pdfRenderer: IDocumentPdfRenderer;
}

/**
 * Facade da impressão: reúne o cliente, a localidade do cliente e o vendedor. Todos estão
 * disponíveis online (API) e offline (snapshot da sincronização); uma falha interrompe a impressão.
 */
export class DocumentPdfService implements IDocumentPdfService {
  constructor(private readonly dependencies: DocumentPdfDependencies) {}

  async generate(detail: DocumentPdfDetail, documentTitle: string): Promise<IDocumentPdfFile> {
    const [customer, seller] = await Promise.all([
      this.dependencies.customerService.getById(detail.customer.id),
      this.dependencies.currentUserService.get(),
    ]);

    const address = customer.addresses[0];
    if (!address) throw new RequiredDataUnavailableError(`O cliente ${customer.name} não possui endereço.`);

    const customerLocality = await this.dependencies.localityService.getById(address.locality.id);

    const template = DocumentTemplateMapper.fromDetail(detail, { customer, customerLocality, seller }, documentTitle);

    try {
      return {
        fileName: `${template.title}.pdf`,
        content: await this.dependencies.pdfRenderer.render(template),
      };
    } catch (error) {
      throw new DocumentPdfGenerationError(error);
    }
  }
}

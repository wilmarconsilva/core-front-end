import { RequiredDataUnavailableError } from '../../../Domain/Shared/Exceptions/RequiredDataUnavailableError';
import { ICustomerDetailDto } from '../../Persons/Customers/DataTransferObjects/ICustomerDetailDto';
import { ICurrentUserService } from '../../Persons/Users/Services/Interfaces/ICurrentUserService';
import { ILocalityDetailDto } from '../../Territories/Localities/DataTransferObjects/ILocalityDetailDto';
import { DocumentTemplateMapper } from './DocumentTemplateMapper';
import { DocumentPdfDetail, IDocumentPdfService } from './Interfaces/IDocumentPdfService';
import { ITemplateService } from './Interfaces/ITemplateService';

interface IDetailReader<TDetailDto> {
  getById(id: number): Promise<TDetailDto>;
}

interface DocumentPdfDependencies {
  customerService: IDetailReader<ICustomerDetailDto>;
  localityService: IDetailReader<ILocalityDetailDto>;
  currentUserService: ICurrentUserService;
}

/**
 * Facade da impressão: reúne o cliente, a localidade do cliente e o vendedor. Todos estão
 * disponíveis online (API) e offline (snapshot da sincronização); uma falha interrompe a impressão.
 */
export class DocumentPdfService implements IDocumentPdfService {
  constructor(private readonly dependencies: DocumentPdfDependencies) {}

  async render(detail: DocumentPdfDetail, templateService: ITemplateService): Promise<string> {
    const [customer, seller] = await Promise.all([
      this.dependencies.customerService.getById(detail.customer.id),
      this.dependencies.currentUserService.get(),
    ]);

    const address = customer.addresses[0];
    if (!address) throw new RequiredDataUnavailableError(`O cliente ${customer.name} não possui endereço.`);

    const customerLocality = await this.dependencies.localityService.getById(address.locality.id);

    return templateService.render(
      DocumentTemplateMapper.fromDetail(detail, { customer, customerLocality, seller }),
    );
  }
}

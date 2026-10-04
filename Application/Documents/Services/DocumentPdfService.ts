import { ICustomerDetailDto } from '../../Persons/Customers/DataTransferObjects/ICustomerDetailDto';
import { ICurrentUserDto } from '../../Persons/Users/DataTransferObjects/ICurrentUserDto';
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
 * Facade da impressão: os dados complementares são opcionais, então qualquer falha
 * (ex.: offline sem o snapshot completo) apenas omite a informação no documento.
 */
export class DocumentPdfService implements IDocumentPdfService {
  constructor(private readonly dependencies: DocumentPdfDependencies) {}

  async render(detail: DocumentPdfDetail, templateService: ITemplateService): Promise<string> {
    detail.products.forEach((product) => {
      console.log(`Product: ${product.product.description}`);
    });
    const [customer, seller] = await Promise.all([
      this.tryGet(() => this.dependencies.customerService.getById(detail.customer.id)),
      this.tryGet<ICurrentUserDto | undefined>(() => this.dependencies.currentUserService.get()),
    ]);

    const localityId = customer?.addresses[0]?.locality.id;
    const customerLocality = localityId
      ? await this.tryGet(() => this.dependencies.localityService.getById(localityId))
      : undefined;

    return templateService.render(
      DocumentTemplateMapper.fromDetail(detail, { customer, customerLocality, seller }),
    );
  }

  private async tryGet<T>(read: () => Promise<T>): Promise<T | undefined> {
    try {
      return await read();
    } catch {
      return undefined;
    }
  }
}

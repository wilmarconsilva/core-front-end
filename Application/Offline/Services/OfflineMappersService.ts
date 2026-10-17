import { MeasureUnit } from '../../../Domain/Products/Enums/MeasureUnit';
import { IDocumentListing } from '../../Documents/DataTransferObjects/IDocumentListing';
import { IDocumentListingFilter } from '../../Documents/DataTransferObjects/IDocumentListingFilter';
import { IDocumentProductSaveDto } from '../../Documents/DataTransferObjects/IDocumentProductSaveDto';
import { IDocumentSaveDto } from '../../Documents/DataTransferObjects/IDocumentSaveDto';
import { IBudgetDetailDto } from '../../Documents/Budgets/DataTransferObjects/IBudgetDetailDto';
import { IBudgetListing } from '../../Documents/Budgets/DataTransferObjects/IBudgetListing';
import { IBudgetSaveDto } from '../../Documents/Budgets/DataTransferObjects/IBudgetSaveDto';
import { IOrderDetailDto } from '../../Documents/Orders/DataTransferObjects/IOrderDetailDto';
import { IOrderListing } from '../../Documents/Orders/DataTransferObjects/IOrderListing';
import { IOrderSaveDto } from '../../Documents/Orders/DataTransferObjects/IOrderSaveDto';
import { ICustomerDetailDto } from '../../Persons/Customers/DataTransferObjects/ICustomerDetailDto';
import { ICustomerListing } from '../../Persons/Customers/DataTransferObjects/ICustomerListing';
import { ICustomerSaveDto } from '../../Persons/Customers/DataTransferObjects/ICustomerSaveDto';
import { IProductDetailDto } from '../../Products/DataTransferObjects/IProductDetailDto';
import { IProductListing } from '../../Products/DataTransferObjects/IProductListing';
import { IProductSaveDto } from '../../Products/DataTransferObjects/IProductSaveDto';
import { IProductListingFilter } from '../../Products/DataTransferObjects/IProductListingFilter';
import { ICustomerListingFilter } from '../../Persons/Customers/DataTransferObjects/ICustomerListingFilter';
import { ILocalityDetailDto } from '../../Territories/Localities/DataTransferObjects/ILocalityDetailDto';
import { ILocalityListing } from '../../Territories/Localities/DataTransferObjects/ILocalityListing';
import { ILocalityListingFilter } from '../../Territories/Localities/DataTransferObjects/ILocalityListingFilter';
import { ILocalitySaveDto } from '../../Territories/Localities/DataTransferObjects/ILocalitySaveDto';
import { IOfflineRepository } from '../Repositories/Interfaces/IOfflineRepository';
import { DocumentFormService } from '../../Documents/Services/DocumentFormService';
import { toApiDateTime, toTimestamp } from '../../Shared/Utilities/DateTimeUtilities';

function containsIgnoreCase(value: string, term?: string): boolean {
  if (!term) return true;
  return value.toLowerCase().includes(term.toLowerCase());
}

function matchesEntityId(id: number, filterId?: number): boolean {
  return filterId === undefined || id === filterId;
}

export function matchesProductFilter(listing: IProductListing, filter: IProductListingFilter): boolean {
  return matchesEntityId(listing.id, filter.id) && containsIgnoreCase(listing.description, filter.description);
}

export function matchesCustomerFilter(listing: ICustomerListing, filter: ICustomerListingFilter): boolean {
  return matchesEntityId(listing.id, filter.id) && containsIgnoreCase(listing.name, filter.name);
}

/**
 * A comparação é feita por instante, e não lexicograficamente: filtro e listagem
 * chegam em ISO 8601 mas com precisões e fusos diferentes, o que torna a ordem
 * textual das strings não confiável.
 */
function isWithinPeriod(value: string, start?: string, end?: string): boolean {
  const startInstant = toTimestamp(start);
  const endInstant = toTimestamp(end);
  if (startInstant === undefined && endInstant === undefined) return true;

  const instant = toTimestamp(value);
  if (instant === undefined) return false;

  return (startInstant === undefined || instant >= startInstant) &&
          (endInstant === undefined || instant <= endInstant);
}

export function matchesDocumentListingFilter(
  listing: IDocumentListing,
  filter: IDocumentListingFilter,
): boolean {
  return matchesEntityId(listing.id, filter.id) &&
          isWithinPeriod(listing.creationDateTime, filter.creationDateTimeStart, filter.creationDateTimeEnd);
}

export function matchesLocalityFilter(listing: ILocalityListing, filter: ILocalityListingFilter): boolean {
  return (
    matchesEntityId(listing.id, filter.id) &&
    containsIgnoreCase(listing.description, filter.description) &&
    (filter.stateId === undefined || listing.stateId === filter.stateId)
  );
}

export function localitySaveToDetail(dto: ILocalitySaveDto): ILocalityDetailDto {
  return {
    id: dto.id,
    description: dto.description,
    // The snapshot keeps only the state id and acronym (the synchronization carries no state name).
    state: { id: dto.stateId ?? 0, description: '', acronym: dto.stateAcronym ?? '' },
  };
}

export function localitySaveToListing(dto: ILocalitySaveDto): ILocalityListing {
  return {
    id: dto.id,
    description: dto.description,
    stateId: dto.stateId,
  };
}

export function productSaveToDetail(dto: IProductSaveDto): IProductDetailDto {
  return {
    id: dto.id,
    description: dto.description,
    measureUnit: dto.measureUnit,
  };
}

export function customerSaveToDetail(dto: ICustomerSaveDto): ICustomerDetailDto {
  return {
    id: dto.id,
    name: dto.name,
    personType: dto.personType,
    document: dto.document,
    email: dto.email,
    stateRegistration: dto.stateRegistration,
    addresses: dto.addresses.map((address) => ({
      id: address.id,
      neighborhood: address.neighborhood,
      street: address.street,
      locality: {
        id: address.localityId,
        description: address.localityDescription ?? '',
      },
      complement: address.complement,
      postalCode: address.postalCode,
      number: address.number,
    })),
  };
}

export function listingToProductSaveDto(listing: IProductListing): IProductSaveDto {
  return {
    id: listing.id,
    description: listing.description,
    measureUnit: MeasureUnit.Meters,
  };
}

/**
 * Human-readable identification of a document for the synchronization
 * pendencies grid (customer name + creation date).
 */
export async function describeDocument(
  dto: IDocumentSaveDto<IDocumentProductSaveDto>,
  customerRepository: IOfflineRepository<ICustomerSaveDto, ICustomerListing, unknown>,
): Promise<string> {
  const customer = await customerRepository.getById(dto.customerId);
  const creationDate = new Date(toApiDateTime(dto.creationDateTime)).toLocaleDateString('pt-BR');
  const customerName = customer?.name ?? 'Cliente não identificado';

  return `${customerName} - ${creationDate}`;
}

export async function buildDocumentListing(
  dto: IDocumentSaveDto<IDocumentProductSaveDto>,
  customerRepository: IOfflineRepository<ICustomerSaveDto, ICustomerListing, unknown>,
): Promise<IDocumentListing> {
  const customer = await customerRepository.getById(dto.customerId);

  return {
    id: dto.id,
    custormerName: customer?.name ?? '',
    customerLocalityState: '',
    creationDateTime: toApiDateTime(dto.creationDateTime),
    valueTotal: DocumentFormService.calculateTotal(dto.products, dto.payment.discountValue),
  };
}

export async function buildOrderListing(
  dto: IOrderSaveDto,
  customerRepository: IOfflineRepository<ICustomerSaveDto, ICustomerListing, unknown>,
): Promise<IOrderListing> {
  const base = await buildDocumentListing(dto, customerRepository);
  return { ...base, budgetId: dto.budgetId };
}

export async function buildBudgetListing(
  dto: IBudgetSaveDto,
  customerRepository: IOfflineRepository<ICustomerSaveDto, ICustomerListing, unknown>,
): Promise<IBudgetListing> {
  return buildDocumentListing(dto, customerRepository);
}

export async function buildDocumentDetail(
  dto: IDocumentSaveDto<IDocumentProductSaveDto>,
  customerRepository: IOfflineRepository<ICustomerSaveDto, ICustomerListing, unknown>,
  productRepository: IOfflineRepository<IProductSaveDto, IProductListing, unknown>,
): Promise<IOrderDetailDto> {
  const customer = await customerRepository.getById(dto.customerId);

  const products = await Promise.all(
    dto.products.map(async (line) => {
      const product = await productRepository.getById(line.productId);

      return {
        id: line.id,
        product: {
          id: line.productId,
          description: product?.description ?? '',
        },
        quantity: line.quantity,
        valueUnit: line.valueUnit,
      };
    }),
  );

  return {
    id: dto.id,
    userId: 0,
    creationDateTime: toApiDateTime(dto.creationDateTime),
    customer: {
      id: dto.customerId,
      description: customer?.name ?? '',
    },
    payment: dto.payment,
    observations: dto.observations,
    customerSignatureImage: dto.customerSignatureImage,
    products,
  };
}

export async function buildOrderDetail(
  dto: IOrderSaveDto,
  customerRepository: IOfflineRepository<ICustomerSaveDto, ICustomerListing, unknown>,
  productRepository: IOfflineRepository<IProductSaveDto, IProductListing, unknown>,
): Promise<IOrderDetailDto> {
  const detail = await buildDocumentDetail(dto, customerRepository, productRepository);
  return { ...detail, budgetId: dto.budgetId };
}

export async function buildBudgetDetail(
  dto: IBudgetSaveDto,
  customerRepository: IOfflineRepository<ICustomerSaveDto, ICustomerListing, unknown>,
  productRepository: IOfflineRepository<IProductSaveDto, IProductListing, unknown>,
): Promise<IBudgetDetailDto> {
  return buildDocumentDetail(dto, customerRepository, productRepository);
}

export function remapId(id: number, idMap: Map<number, number>): number {
  if (id > 0) {
    return id;
  }
  return idMap.get(id) ?? id;
}

export function remapDocumentReferences<T extends IDocumentSaveDto<IDocumentProductSaveDto>>(
  dto: T,
  customerIdMap: Map<number, number>,
  productIdMap: Map<number, number>,
): T {
  return {
    ...dto,
    customerId: remapId(dto.customerId, customerIdMap),
    products: dto.products.map((line) => ({
      ...line,
      productId: remapId(line.productId, productIdMap),
    })),
  };
}

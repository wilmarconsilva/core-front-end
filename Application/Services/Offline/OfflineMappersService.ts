import { MeasureUnit } from '../../../Domain/ValueObjects/Enums/Products/MeasureUnit';
import { PersonType } from '../../Interfaces/DataTransferObjects/Persons/PersonType';
import { IDocumentListing } from '../../Interfaces/DataTransferObjects/Commercial/Documents/IDocumentListing';
import { IDocumentListingFilter } from '../../Interfaces/DataTransferObjects/Commercial/Documents/IDocumentListingFilter';
import { IDocumentProductSaveDto } from '../../Interfaces/DataTransferObjects/Commercial/Documents/IDocumentProductSaveDto';
import { IDocumentSaveDto } from '../../Interfaces/DataTransferObjects/Commercial/Documents/IDocumentSaveDto';
import { IBudgetDetailDto } from '../../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetDetailDto';
import { IBudgetListing } from '../../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetListing';
import { IBudgetSaveDto } from '../../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetSaveDto';
import { IOrderDetailDto } from '../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderDetailDto';
import { IOrderListing } from '../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderListing';
import { IOrderSaveDto } from '../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderSaveDto';
import { ICustomerDetailDto } from '../../Interfaces/DataTransferObjects/Persons/Customers/ICustomerDetailDto';
import { ICustomerListing } from '../../Interfaces/DataTransferObjects/Persons/Customers/ICustomerListing';
import { ICustomerSaveDto } from '../../Interfaces/DataTransferObjects/Persons/Customers/ICustomerSaveDto';
import { IProductDetailDto } from '../../Interfaces/DataTransferObjects/Products/IProductDetailDto';
import { IProductListing } from '../../Interfaces/DataTransferObjects/Products/IProductListing';
import { IProductSaveDto } from '../../Interfaces/DataTransferObjects/Products/IProductSaveDto';
import { IProductListingFilter } from '../../Interfaces/DataTransferObjects/Products/IProductListingFilter';
import { ICustomerListingFilter } from '../../Interfaces/DataTransferObjects/Persons/Customers/ICustomerListingFilter';
import { ILocalityDetailDto } from '../../Interfaces/DataTransferObjects/Localities/ILocalityDetailDto';
import { ILocalityListing } from '../../Interfaces/DataTransferObjects/Localities/ILocalityListing';
import { ILocalityListingFilter } from '../../Interfaces/DataTransferObjects/Localities/ILocalityListingFilter';
import { ILocalitySaveDto } from '../../Interfaces/DataTransferObjects/Localities/ILocalitySaveDto';
import { IOfflineRepository } from '../../../Infrastructure/Persistence/Interfaces/IOfflineRepository';
import { CommercialDocumentFormService } from '../Commercial/Documents/CommercialDocumentFormService';

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

export function matchesDocumentListingFilter(
  listing: IDocumentListing,
  filter: IDocumentListingFilter,
): boolean {
  if (!matchesEntityId(listing.id, filter.id)) return false;
  if (filter.creationDateTimeStart && listing.creationDateTime < filter.creationDateTimeStart) return false;
  if (filter.creationDateTimeEnd && listing.creationDateTime > filter.creationDateTimeEnd) return false;
  return true;
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
    state: dto.stateId !== undefined ? { id: dto.stateId, description: '' } : undefined,
  };
}

export function listingToLocalitySaveDto(listing: ILocalityListing): ILocalitySaveDto {
  return {
    id: listing.id,
    description: listing.description,
    stateId: listing.stateId,
  };
}

function toIsoDateTime(value: Date | string): string {
  if (value instanceof Date) {
    return value.toISOString();
  }
  return String(value);
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

export function listingToCustomerSaveDto(listing: ICustomerListing): ICustomerSaveDto {
  return {
    id: listing.id,
    name: listing.name,
    personType: PersonType.Natural,
    document: '',
    addresses: [],
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
  const creationDate = new Date(toIsoDateTime(dto.creationDateTime)).toLocaleDateString('pt-BR');
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
    creationDateTime: toIsoDateTime(dto.creationDateTime),
    valueTotal: CommercialDocumentFormService.calculateTotal(dto.products, dto.payment.discountValue),
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
        valueTotal: line.valueTotal,
      };
    }),
  );

  return {
    id: dto.id,
    userId: 0,
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

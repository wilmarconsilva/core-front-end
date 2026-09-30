import { ICrudService } from '../../Application/Interfaces/Services/ICrudService';
import { IOfflineRepository } from './Interfaces/IOfflineRepository';
import { OfflineCrudService } from '../../Application/Services/Offline/OfflineCrudService';
import { DataSynchronizationService } from '../../Application/Services/Offline/DataSynchronizationService';
import { IDataSynchronizationService } from '../../Application/Interfaces/Services/IDataSynchronizationService';
import {
  buildBudgetDetail,
  buildBudgetListing,
  buildOrderDetail,
  buildOrderListing,
  customerSaveToDetail,
  listingToCustomerSaveDto,
  listingToLocalitySaveDto,
  listingToProductSaveDto,
  localitySaveToDetail,
  matchesCustomerFilter,
  matchesDocumentListingFilter,
  matchesLocalityFilter,
  matchesProductFilter,
  productSaveToDetail,
  remapDocumentReferences,
} from '../../Application/Services/Offline/OfflineMappersService';
import { ProductService } from '../../Application/Services/Products/ProductService';
import { CustomerService } from '../../Application/Services/Customers/CustomerService';
import { LocalityService } from '../../Application/Services/Localities/LocalityService';
import { OrderService } from '../../Application/Services/Commercial/Documents/Orders/OrderService';
import { BudgetService } from '../../Application/Services/Commercial/Documents/Budgets/BudgetService';
import { IProductListing } from '../../Application/Interfaces/DataTransferObjects/Products/IProductListing';
import { IProductListingFilter } from '../../Application/Interfaces/DataTransferObjects/Products/IProductListingFilter';
import { IProductSaveDto } from '../../Application/Interfaces/DataTransferObjects/Products/IProductSaveDto';
import { IProductDetailDto } from '../../Application/Interfaces/DataTransferObjects/Products/IProductDetailDto';
import { ICustomerListing } from '../../Application/Interfaces/DataTransferObjects/Persons/Customers/ICustomerListing';
import { ICustomerListingFilter } from '../../Application/Interfaces/DataTransferObjects/Persons/Customers/ICustomerListingFilter';
import { ICustomerSaveDto } from '../../Application/Interfaces/DataTransferObjects/Persons/Customers/ICustomerSaveDto';
import { ICustomerDetailDto } from '../../Application/Interfaces/DataTransferObjects/Persons/Customers/ICustomerDetailDto';
import { IOrderSaveDto } from '../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderSaveDto';
import { IOrderDetailDto } from '../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderDetailDto';
import { IOrderListing } from '../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderListing';
import { IOrderListingFilter } from '../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderListingFilter';
import { IBudgetSaveDto } from '../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetSaveDto';
import { IBudgetDetailDto } from '../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetDetailDto';
import { IBudgetListing } from '../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetListing';
import { IBudgetListingFilter } from '../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetListingFilter';
import { ILocalityDetailDto } from '../../Application/Interfaces/DataTransferObjects/Localities/ILocalityDetailDto';
import { ILocalityListing } from '../../Application/Interfaces/DataTransferObjects/Localities/ILocalityListing';
import { ILocalityListingFilter } from '../../Application/Interfaces/DataTransferObjects/Localities/ILocalityListingFilter';
import { ILocalitySaveDto } from '../../Application/Interfaces/DataTransferObjects/Localities/ILocalitySaveDto';
import { IDocumentProductSaveDto } from '../../Application/Interfaces/DataTransferObjects/Commercial/Documents/IDocumentProductSaveDto';
import { IDocumentSaveDto } from '../../Application/Interfaces/DataTransferObjects/Commercial/Documents/IDocumentSaveDto';
import { SynchronizationEntityType } from '../../Application/Interfaces/DataTransferObjects/Offline/SynchronizationEntityType';
import { ISynchronizationPendencyService } from '../../Application/Interfaces/Services/ISynchronizationPendencyService';
import { SynchronizationPendencyService } from '../../Application/Services/Offline/SynchronizationPendencyService';
import { IndexedDbContext } from './IndexedDb/IndexedDbContext';
import { IndexedDbOfflineRepository } from './Repositories/IndexedDbOfflineRepository';
import { OfflineStoreNames } from './IndexedDb/IndexedDbSchema';
import { ILocalityOfflineRepository } from './Repositories/Localities/Interfaces/ILocalityOfflineRepository';
import { LocalityOfflineRepository } from './Repositories/Localities/LocalityOfflineRepository';
import { ISynchronizationPendencyRepository } from './Repositories/SynchronizationPendencies/Interfaces/ISynchronizationPendencyRepository';
import { SynchronizationPendencyRepository } from './Repositories/SynchronizationPendencies/SynchronizationPendencyRepository';

/**
 * Composition root that wires the IndexedDB persistence into the offline-aware
 * services. The repositories are exposed so the synchronization service can
 * reuse the very same instances. Everything is created once (singletons).
 */
class OfflineCompositionRootImpl {
  private readonly context = IndexedDbContext.getInstance();

  readonly productRepository: IOfflineRepository<IProductSaveDto, IProductListing, IProductListingFilter> =
    new IndexedDbOfflineRepository(
      this.context,
      OfflineStoreNames.products,
      (dto) => ({ id: dto.id, description: dto.description }),
      matchesProductFilter,
      listingToProductSaveDto,
    );

  readonly customerRepository: IOfflineRepository<ICustomerSaveDto, ICustomerListing, ICustomerListingFilter> =
    new IndexedDbOfflineRepository(
      this.context,
      OfflineStoreNames.customers,
      (dto) => ({ id: dto.id, name: dto.name }),
      matchesCustomerFilter,
      listingToCustomerSaveDto,
    );

  readonly orderRepository: IOfflineRepository<IOrderSaveDto, IOrderListing, IOrderListingFilter> =
    new IndexedDbOfflineRepository(
      this.context,
      OfflineStoreNames.orders,
      (dto) => buildOrderListing(dto, this.customerRepository),
      matchesDocumentListingFilter,
      () => {
        throw new Error('Orders store does not accept synced listings.');
      },
    );

  readonly budgetRepository: IOfflineRepository<IBudgetSaveDto, IBudgetListing, IBudgetListingFilter> =
    new IndexedDbOfflineRepository(
      this.context,
      OfflineStoreNames.budgets,
      (dto) => buildBudgetListing(dto, this.customerRepository),
      matchesDocumentListingFilter,
      () => {
        throw new Error('Budgets store does not accept synced listings.');
      },
    );

  readonly localityRepository: ILocalityOfflineRepository =
    new LocalityOfflineRepository(
      this.context,
      OfflineStoreNames.localities,
      (dto) => ({ id: dto.id, description: dto.description, stateId: dto.stateId }),
      matchesLocalityFilter,
      listingToLocalitySaveDto,
    );

  private readonly synchronizationPendencyRepository: ISynchronizationPendencyRepository =
    new SynchronizationPendencyRepository(this.context);

  readonly synchronizationPendencyService: ISynchronizationPendencyService =
    new SynchronizationPendencyService(this.synchronizationPendencyRepository);

  readonly dataSynchronizationService: IDataSynchronizationService =
    new DataSynchronizationService({
      productApi: new ProductService(),
      customerApi: new CustomerService(),
      orderApi: new OrderService(),
      budgetApi: new BudgetService(),
      localityApi: new LocalityService(),
      productRepository: this.productRepository,
      customerRepository: this.customerRepository,
      orderRepository: this.orderRepository,
      budgetRepository: this.budgetRepository,
      localityRepository: this.localityRepository,
      synchronizationPendencyService: this.synchronizationPendencyService,
    });

  createProductService(): ICrudService<IProductSaveDto, IProductDetailDto, IProductListing, IProductListingFilter> {
    return new OfflineCrudService(new ProductService(), {
      repository: this.productRepository,
      toListing: (dto) => ({ id: dto.id, description: dto.description }),
      toDetail: async (dto) => productSaveToDetail(dto),
      listingScope: 'snapshot',
      onLocalRecordSynchronized: async (localId, serverId) => {
        await this.synchronizationPendencyService.resolve(SynchronizationEntityType.Product, localId);
        await this.remapStoredDocumentReferences(new Map(), new Map([[localId, serverId]]));
      },
    });
  }

  createCustomerService(): ICrudService<ICustomerSaveDto, ICustomerDetailDto, ICustomerListing, ICustomerListingFilter> {
    return new OfflineCrudService(new CustomerService(), {
      repository: this.customerRepository,
      toListing: (dto) => ({ id: dto.id, name: dto.name }),
      toDetail: async (dto) => customerSaveToDetail(dto),
      listingScope: 'snapshot',
      onLocalRecordSynchronized: async (localId, serverId) => {
        await this.synchronizationPendencyService.resolve(SynchronizationEntityType.Customer, localId);
        await this.remapStoredDocumentReferences(new Map([[localId, serverId]]), new Map());
      },
    });
  }

  createOrderService(): ICrudService<IOrderSaveDto, IOrderDetailDto, IOrderListing, IOrderListingFilter> {
    return new OfflineCrudService(new OrderService(), {
      repository: this.orderRepository,
      toListing: (dto) => buildOrderListing(dto, this.customerRepository),
      toDetail: (dto) => buildOrderDetail(dto, this.customerRepository, this.productRepository),
      listingScope: 'localOnly',
      onLocalRecordSynchronized: (localId) =>
        this.synchronizationPendencyService.resolve(SynchronizationEntityType.Order, localId),
    });
  }

  createBudgetService(): ICrudService<IBudgetSaveDto, IBudgetDetailDto, IBudgetListing, IBudgetListingFilter> {
    return new OfflineCrudService(new BudgetService(), {
      repository: this.budgetRepository,
      toListing: (dto) => buildBudgetListing(dto, this.customerRepository),
      toDetail: (dto) => buildBudgetDetail(dto, this.customerRepository, this.productRepository),
      listingScope: 'localOnly',
      onLocalRecordSynchronized: (localId) =>
        this.synchronizationPendencyService.resolve(SynchronizationEntityType.Budget, localId),
    });
  }

  createLocalityService(): ICrudService<ILocalitySaveDto, ILocalityDetailDto, ILocalityListing, ILocalityListingFilter> {
    return new OfflineCrudService(new LocalityService(), {
      repository: this.localityRepository,
      toListing: (dto) => ({ id: dto.id, description: dto.description, stateId: dto.stateId }),
      toDetail: async (dto) => localitySaveToDetail(dto),
      listingScope: 'snapshot',
    });
  }

  /**
   * After a local Customer/Product is resubmitted online, the local documents
   * that still reference its local (negative) id must point to the server id.
   */
  private async remapStoredDocumentReferences(
    customerIdMap: Map<number, number>,
    productIdMap: Map<number, number>,
  ): Promise<void> {
    await this.remapStoredDocuments(this.orderRepository, customerIdMap, productIdMap);
    await this.remapStoredDocuments(this.budgetRepository, customerIdMap, productIdMap);
  }

  private async remapStoredDocuments<T extends IDocumentSaveDto<IDocumentProductSaveDto>>(
    repository: IOfflineRepository<T, unknown, unknown>,
    customerIdMap: Map<number, number>,
    productIdMap: Map<number, number>,
  ): Promise<void> {
    const records = await repository.getLocalRecords();

    for (const record of records) {
      await repository.upsert(remapDocumentReferences(record, customerIdMap, productIdMap));
    }
  }
}

export const OfflineCompositionRoot = new OfflineCompositionRootImpl();

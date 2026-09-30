import { IApplicationServices } from '../../Application/DependencyInjection/IApplicationServices';
import { ICrudService } from '../../Application/Shared/Services/Interfaces/ICrudService';
import { IOfflineRepository } from '../../Application/Offline/Repositories/Interfaces/IOfflineRepository';
import { OfflineCrudService } from '../../Application/Offline/Services/OfflineCrudService';
import { DataSynchronizationService } from '../../Application/Offline/Services/DataSynchronizationService';
import { IDataSynchronizationService } from '../../Application/Offline/Services/Interfaces/IDataSynchronizationService';
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
} from '../../Application/Offline/Services/OfflineMappersService';
import { ProductService } from '../../Application/Products/Services/ProductService';
import { CustomerService } from '../../Application/Persons/Customers/Services/CustomerService';
import { LocalityService } from '../../Application/Territories/Localities/Services/LocalityService';
import { OrderService } from '../../Application/Documents/Orders/Services/OrderService';
import { BudgetService } from '../../Application/Documents/Budgets/Services/BudgetService';
import { IProductListing } from '../../Application/Products/DataTransferObjects/IProductListing';
import { IProductListingFilter } from '../../Application/Products/DataTransferObjects/IProductListingFilter';
import { IProductSaveDto } from '../../Application/Products/DataTransferObjects/IProductSaveDto';
import { IProductDetailDto } from '../../Application/Products/DataTransferObjects/IProductDetailDto';
import { ICustomerListing } from '../../Application/Persons/Customers/DataTransferObjects/ICustomerListing';
import { ICustomerListingFilter } from '../../Application/Persons/Customers/DataTransferObjects/ICustomerListingFilter';
import { ICustomerSaveDto } from '../../Application/Persons/Customers/DataTransferObjects/ICustomerSaveDto';
import { ICustomerDetailDto } from '../../Application/Persons/Customers/DataTransferObjects/ICustomerDetailDto';
import { IOrderSaveDto } from '../../Application/Documents/Orders/DataTransferObjects/IOrderSaveDto';
import { IOrderDetailDto } from '../../Application/Documents/Orders/DataTransferObjects/IOrderDetailDto';
import { IOrderListing } from '../../Application/Documents/Orders/DataTransferObjects/IOrderListing';
import { IOrderListingFilter } from '../../Application/Documents/Orders/DataTransferObjects/IOrderListingFilter';
import { IBudgetSaveDto } from '../../Application/Documents/Budgets/DataTransferObjects/IBudgetSaveDto';
import { IBudgetDetailDto } from '../../Application/Documents/Budgets/DataTransferObjects/IBudgetDetailDto';
import { IBudgetListing } from '../../Application/Documents/Budgets/DataTransferObjects/IBudgetListing';
import { IBudgetListingFilter } from '../../Application/Documents/Budgets/DataTransferObjects/IBudgetListingFilter';
import { ILocalityDetailDto } from '../../Application/Territories/Localities/DataTransferObjects/ILocalityDetailDto';
import { ILocalityListing } from '../../Application/Territories/Localities/DataTransferObjects/ILocalityListing';
import { ILocalityListingFilter } from '../../Application/Territories/Localities/DataTransferObjects/ILocalityListingFilter';
import { ILocalitySaveDto } from '../../Application/Territories/Localities/DataTransferObjects/ILocalitySaveDto';
import { IDocumentProductSaveDto } from '../../Application/Documents/DataTransferObjects/IDocumentProductSaveDto';
import { IDocumentSaveDto } from '../../Application/Documents/DataTransferObjects/IDocumentSaveDto';
import { SynchronizationEntityType } from '../../Application/Offline/DataTransferObjects/SynchronizationEntityType';
import { ISynchronizationPendencyService } from '../../Application/Offline/Services/Interfaces/ISynchronizationPendencyService';
import { SynchronizationPendencyService } from '../../Application/Offline/Services/SynchronizationPendencyService';
import { IndexedDbContext } from '../../Infrastructure/Shared/Persistence/IndexedDb/IndexedDbContext';
import { IndexedDbOfflineRepository } from '../../Infrastructure/Offline/Repositories/IndexedDbOfflineRepository';
import { OfflineStoreNames } from '../../Infrastructure/Shared/Persistence/IndexedDb/IndexedDbSchema';
import { ILocalityOfflineRepository } from '../../Application/Territories/Localities/Repositories/Interfaces/ILocalityOfflineRepository';
import { LocalityOfflineRepository } from '../../Infrastructure/Territories/Localities/Repositories/LocalityOfflineRepository';
import { ISynchronizationPendencyRepository } from '../../Application/Offline/Repositories/Interfaces/ISynchronizationPendencyRepository';
import { SynchronizationPendencyRepository } from '../../Infrastructure/Offline/Repositories/SynchronizationPendencyRepository';

/**
 * Composition root (the only place that knows Infrastructure): wires the
 * IndexedDB persistence into the offline-aware services and exposes them
 * through IApplicationServices. The CRUD services and the synchronization
 * service share the very same repository instances. Everything is created
 * once (singletons).
 */
class ApplicationCompositionRootImpl implements IApplicationServices {
  private readonly context = IndexedDbContext.getInstance();

  private readonly productRepository: IOfflineRepository<IProductSaveDto, IProductListing, IProductListingFilter> =
    new IndexedDbOfflineRepository(
      this.context,
      OfflineStoreNames.products,
      (dto) => ({ id: dto.id, description: dto.description }),
      matchesProductFilter,
      listingToProductSaveDto,
    );

  private readonly customerRepository: IOfflineRepository<ICustomerSaveDto, ICustomerListing, ICustomerListingFilter> =
    new IndexedDbOfflineRepository(
      this.context,
      OfflineStoreNames.customers,
      (dto) => ({ id: dto.id, name: dto.name }),
      matchesCustomerFilter,
      listingToCustomerSaveDto,
    );

  private readonly orderRepository: IOfflineRepository<IOrderSaveDto, IOrderListing, IOrderListingFilter> =
    new IndexedDbOfflineRepository(
      this.context,
      OfflineStoreNames.orders,
      (dto) => buildOrderListing(dto, this.customerRepository),
      matchesDocumentListingFilter,
      () => {
        throw new Error('Orders store does not accept synced listings.');
      },
    );

  private readonly budgetRepository: IOfflineRepository<IBudgetSaveDto, IBudgetListing, IBudgetListingFilter> =
    new IndexedDbOfflineRepository(
      this.context,
      OfflineStoreNames.budgets,
      (dto) => buildBudgetListing(dto, this.customerRepository),
      matchesDocumentListingFilter,
      () => {
        throw new Error('Budgets store does not accept synced listings.');
      },
    );

  private readonly localityRepository: ILocalityOfflineRepository =
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

  readonly productService = this.createProductService();
  readonly customerService = this.createCustomerService();
  readonly orderService = this.createOrderService();
  readonly budgetService = this.createBudgetService();
  readonly localityService = this.createLocalityService();

  private createProductService(): ICrudService<IProductSaveDto, IProductDetailDto, IProductListing, IProductListingFilter> {
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

  private createCustomerService(): ICrudService<ICustomerSaveDto, ICustomerDetailDto, ICustomerListing, ICustomerListingFilter> {
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

  private createOrderService(): ICrudService<IOrderSaveDto, IOrderDetailDto, IOrderListing, IOrderListingFilter> {
    return new OfflineCrudService(new OrderService(), {
      repository: this.orderRepository,
      toListing: (dto) => buildOrderListing(dto, this.customerRepository),
      toDetail: (dto) => buildOrderDetail(dto, this.customerRepository, this.productRepository),
      listingScope: 'localOnly',
      onLocalRecordSynchronized: (localId) =>
        this.synchronizationPendencyService.resolve(SynchronizationEntityType.Order, localId),
    });
  }

  private createBudgetService(): ICrudService<IBudgetSaveDto, IBudgetDetailDto, IBudgetListing, IBudgetListingFilter> {
    return new OfflineCrudService(new BudgetService(), {
      repository: this.budgetRepository,
      toListing: (dto) => buildBudgetListing(dto, this.customerRepository),
      toDetail: (dto) => buildBudgetDetail(dto, this.customerRepository, this.productRepository),
      listingScope: 'localOnly',
      onLocalRecordSynchronized: (localId) =>
        this.synchronizationPendencyService.resolve(SynchronizationEntityType.Budget, localId),
    });
  }

  private createLocalityService(): ICrudService<ILocalitySaveDto, ILocalityDetailDto, ILocalityListing, ILocalityListingFilter> {
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

export const ApplicationCompositionRoot: IApplicationServices = new ApplicationCompositionRootImpl();

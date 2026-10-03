import { IListingFilter } from '../../Shared/DataTransferObjects/Listings/IListingFilter';
import { IDocumentSaveDto } from '../../Documents/DataTransferObjects/IDocumentSaveDto';
import { IDocumentProductSaveDto } from '../../Documents/DataTransferObjects/IDocumentProductSaveDto';
import { IOfflineRepository } from '../Repositories/Interfaces/IOfflineRepository';
import {
  IDataSynchronizationService,
  SynchronizationListener,
  SynchronizationStatus,
} from './Interfaces/IDataSynchronizationService';
import { IProductListing } from '../../Products/DataTransferObjects/IProductListing';
import { IProductListingFilter } from '../../Products/DataTransferObjects/IProductListingFilter';
import { IProductSaveDto } from '../../Products/DataTransferObjects/IProductSaveDto';
import { ICustomerListing } from '../../Persons/Customers/DataTransferObjects/ICustomerListing';
import { ICustomerListingFilter } from '../../Persons/Customers/DataTransferObjects/ICustomerListingFilter';
import { ICustomerSaveDto } from '../../Persons/Customers/DataTransferObjects/ICustomerSaveDto';
import { IOrderSaveDto } from '../../Documents/Orders/DataTransferObjects/IOrderSaveDto';
import { IBudgetSaveDto } from '../../Documents/Budgets/DataTransferObjects/IBudgetSaveDto';
import { ILocalityOfflineRepository } from '../../Territories/Localities/Repositories/Interfaces/ILocalityOfflineRepository';
import { ILocalityService } from '../../Territories/Localities/Services/Interfaces/ILocalityService';
import { ISynchronizationPendencyService } from './Interfaces/ISynchronizationPendencyService';
import { SynchronizationEntityType } from '../DataTransferObjects/SynchronizationEntityType';
import { IApiError } from '../../Shared/DataTransferObjects/APIConsumer/IApiError';
import { toApiCreatePayload } from '../Utilities/OfflineUtilities';
import { describeDocument, remapDocumentReferences } from './OfflineMappersService';
import { APIConsumerUtility } from '../../Shared/Utilities/APIConsumerUtility';
import { ICurrentUserService } from '../../Persons/Users/Services/Interfaces/ICurrentUserService';

const FETCH_PAGE_SIZE = 50;

interface ICreatePushService<TSaveDto> {
  create(dto: TSaveDto): Promise<TSaveDto>;
}

interface IListingFetchService<TListing, IListingFilter> {
  getAll(filter: IListingFilter): Promise<TListing[]>;
}

interface DataSynchronizationDependencies {
  productApi: IListingFetchService<IProductListing, IProductListingFilter> & ICreatePushService<IProductSaveDto>;
  customerApi: IListingFetchService<ICustomerListing, ICustomerListingFilter> & ICreatePushService<ICustomerSaveDto>;
  orderApi: ICreatePushService<IOrderSaveDto>;
  budgetApi: ICreatePushService<IBudgetSaveDto>;
  localityApi: ILocalityService;
  productRepository: IOfflineRepository<IProductSaveDto, IProductListing, IProductListingFilter>;
  customerRepository: IOfflineRepository<ICustomerSaveDto, ICustomerListing, ICustomerListingFilter>;
  orderRepository: IOfflineRepository<IOrderSaveDto, unknown, unknown>;
  budgetRepository: IOfflineRepository<IBudgetSaveDto, unknown, unknown>;
  localityRepository: ILocalityOfflineRepository;
  synchronizationPendencyService: ISynchronizationPendencyService;
  currentUserService: ICurrentUserService;
}

/**
 * Orchestrates startup synchronization following a fixed sequence:
 *   1. push local Products    2. push local Customers
 *   3. remap FKs              4. push local Orders
 *   5. push local Budgets     6. refresh Products
 *   7. refresh Customers      8. refresh Localities
 *   9. refresh current User
 */
export class DataSynchronizationService implements IDataSynchronizationService {
  private status: SynchronizationStatus = 'idle';
  private readonly listeners = new Set<SynchronizationListener>();
  private hasRun = false;
  private hadFailure = false;

  constructor(private readonly dependencies: DataSynchronizationDependencies) {}

  getStatus(): SynchronizationStatus {
    return this.status;
  }

  subscribe(listener: SynchronizationListener): () => void {
    this.listeners.add(listener);
    listener(this.status);
    return () => {
      this.listeners.delete(listener);
    };
  }

  async synchronize(): Promise<void> {
    if (this.hasRun || this.status === 'syncing') {
      return;
    }
    this.hasRun = true;
    this.hadFailure = false;
    this.setStatus('syncing');

    const runStep = async (step: () => Promise<void>): Promise<void> => {
      try {
        await step();
      } catch {
        this.hadFailure = true;
      }
    };

    let productIdMap = new Map<number, number>();
    let customerIdMap = new Map<number, number>();

    await runStep(async () => {
      productIdMap = await this.pushLocalRecords(
        this.dependencies.productRepository,
        this.dependencies.productApi,
        SynchronizationEntityType.Product,
        (record) => record.description,
      );
    });
    await runStep(async () => {
      customerIdMap = await this.pushLocalRecords(
        this.dependencies.customerRepository,
        this.dependencies.customerApi,
        SynchronizationEntityType.Customer,
        (record) => record.name,
      );
    });
    await runStep(() => this.pushLocalDocuments(
      this.dependencies.orderRepository,
      this.dependencies.orderApi,
      SynchronizationEntityType.Order,
      customerIdMap,
      productIdMap,
    ));
    await runStep(() => this.pushLocalDocuments(
      this.dependencies.budgetRepository,
      this.dependencies.budgetApi,
      SynchronizationEntityType.Budget,
      customerIdMap,
      productIdMap,
    ));
    await runStep(() => this.refreshProducts());
    await runStep(() => this.refreshCustomers());
    await runStep(() => this.refreshLocalitiesIfQuantityIsNotEqual());
    await runStep(() => this.dependencies.currentUserService.synchronize());

    this.setStatus(this.hadFailure ? 'error' : 'success');
  }

  private async pushLocalRecords<T extends { id: number }>(
    repository: IOfflineRepository<T, unknown, unknown>,
    api: ICreatePushService<T>,
    entityType: SynchronizationEntityType,
    describe: (record: T) => string,
  ): Promise<Map<number, number>> {
    const idMap = new Map<number, number>();
    const pending = await repository.getLocalRecords();

    for (const record of pending) {
      try {
        const created = await api.create(toApiCreatePayload(record));
        idMap.set(record.id, created.id);
        await repository.remove(record.id);
        await this.dependencies.synchronizationPendencyService.resolve(entityType, record.id);
      } catch (error) {
        this.hadFailure = true;
        await this.registerPendencyIfRejected(entityType, record.id, describe(record), error);
      }
    }

    return idMap;
  }

  private async pushLocalDocuments<T extends IDocumentSaveDto<IDocumentProductSaveDto>>(
    repository: IOfflineRepository<T, unknown, unknown>,
    api: ICreatePushService<T>,
    entityType: SynchronizationEntityType,
    customerIdMap: Map<number, number>,
    productIdMap: Map<number, number>,
  ): Promise<void> {
    const pending = await repository.getLocalRecords();

    for (const record of pending) {
      const remapped = remapDocumentReferences(record, customerIdMap, productIdMap);
      try {
        await api.create(toApiCreatePayload(remapped));
        await repository.remove(record.id);
        await this.dependencies.synchronizationPendencyService.resolve(entityType, record.id);
      } catch (error) {
        this.hadFailure = true;
        // Keep the remapped references so the record stays editable online.
        await repository.upsert(remapped);
        const description = await describeDocument(remapped, this.dependencies.customerRepository);
        await this.registerPendencyIfRejected(entityType, record.id, description, error);
      }
    }
  }

  /**
   * Only back-end rejections (4xx) become pendencies; network/server outages
   * leave the record untouched to be retried on the next synchronization.
   */
  private async registerPendencyIfRejected(
    entityType: SynchronizationEntityType,
    recordId: number,
    description: string,
    error: unknown,
  ): Promise<void> {
    const apiError = error as IApiError;

    await this.dependencies.synchronizationPendencyService.register({
      entityType,
      recordId,
      description,
      failureMessage: APIConsumerUtility.GetErrorMessage(apiError),
    });
  }

  private async refreshProducts(): Promise<void> {
    const products = await this.fetchAll(this.dependencies.productApi);
    await this.dependencies.productRepository.replaceSynced(products);
  }

  private async refreshCustomers(): Promise<void> {
    const customers = await this.fetchAll(this.dependencies.customerApi);
    await this.dependencies.customerRepository.replaceSynced(customers);
  }

  private async refreshLocalitiesIfQuantityIsNotEqual(): Promise<void> {
    const localitiesOfflineQuantity = await this.dependencies.localityRepository.getQuantity();
    const localitiesApiQuantity = await this.dependencies.localityApi.getQuantity();

    if (localitiesOfflineQuantity !== localitiesApiQuantity) 
    {
      const localities = await this.fetchAll(this.dependencies.localityApi);
      await this.dependencies.localityRepository.replaceSynced(localities);
    }
  }

  private async fetchAll<TListing, TFilter extends IListingFilter>(
    service: IListingFetchService<TListing, TFilter>,
  ): Promise<TListing[]> {
    const all: TListing[] = [];
    let start = 0;
    let page: TListing[] | null = null;

    while(page === null || page.length === FETCH_PAGE_SIZE) {
      page = await service.getAll({
        registersStart: start,
        registersEnd: start + FETCH_PAGE_SIZE,
      } as TFilter);

      all.push(...page);

      start += FETCH_PAGE_SIZE;
    }

    return all;
  }

  private setStatus(status: SynchronizationStatus): void {
    this.status = status;
    this.listeners.forEach((listener) => listener(status));
  }
}

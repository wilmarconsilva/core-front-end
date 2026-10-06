import { ICrudService } from '../Shared/Services/Interfaces/ICrudService';
import { IProductSaveDto } from '../Products/DataTransferObjects/IProductSaveDto';
import { IProductDetailDto } from '../Products/DataTransferObjects/IProductDetailDto';
import { IProductListing } from '../Products/DataTransferObjects/IProductListing';
import { IProductListingFilter } from '../Products/DataTransferObjects/IProductListingFilter';
import { ICustomerSaveDto } from '../Persons/Customers/DataTransferObjects/ICustomerSaveDto';
import { ICustomerDetailDto } from '../Persons/Customers/DataTransferObjects/ICustomerDetailDto';
import { ICustomerListing } from '../Persons/Customers/DataTransferObjects/ICustomerListing';
import { ICustomerListingFilter } from '../Persons/Customers/DataTransferObjects/ICustomerListingFilter';
import { IOrderSaveDto } from '../Documents/Orders/DataTransferObjects/IOrderSaveDto';
import { IOrderDetailDto } from '../Documents/Orders/DataTransferObjects/IOrderDetailDto';
import { IOrderListing } from '../Documents/Orders/DataTransferObjects/IOrderListing';
import { IOrderListingFilter } from '../Documents/Orders/DataTransferObjects/IOrderListingFilter';
import { IBudgetSaveDto } from '../Documents/Budgets/DataTransferObjects/IBudgetSaveDto';
import { IBudgetDetailDto } from '../Documents/Budgets/DataTransferObjects/IBudgetDetailDto';
import { IBudgetListing } from '../Documents/Budgets/DataTransferObjects/IBudgetListing';
import { IBudgetListingFilter } from '../Documents/Budgets/DataTransferObjects/IBudgetListingFilter';
import { ILocalitySaveDto } from '../Territories/Localities/DataTransferObjects/ILocalitySaveDto';
import { ILocalityDetailDto } from '../Territories/Localities/DataTransferObjects/ILocalityDetailDto';
import { ILocalityListing } from '../Territories/Localities/DataTransferObjects/ILocalityListing';
import { ILocalityListingFilter } from '../Territories/Localities/DataTransferObjects/ILocalityListingFilter';
import { IDataSynchronizationService } from '../Offline/Services/Interfaces/IDataSynchronizationService';
import { ISynchronizationPendencyService } from '../Offline/Services/Interfaces/ISynchronizationPendencyService';
import { IDocumentPdfService } from '../Documents/Services/Interfaces/IDocumentPdfService';

/**
 * Contract of the services the application layer needs at runtime.
 * The application depends only on this abstraction; the concrete wiring
 * (IndexedDB, HTTP, offline decorators) is provided by the composition root.
 */
export interface IApplicationServices {
  readonly productService: ICrudService<IProductSaveDto, IProductDetailDto, IProductListing, IProductListingFilter>;
  readonly customerService: ICrudService<ICustomerSaveDto, ICustomerDetailDto, ICustomerListing, ICustomerListingFilter>;
  readonly orderService: ICrudService<IOrderSaveDto, IOrderDetailDto, IOrderListing, IOrderListingFilter>;
  readonly budgetService: ICrudService<IBudgetSaveDto, IBudgetDetailDto, IBudgetListing, IBudgetListingFilter>;
  readonly localityService: ICrudService<ILocalitySaveDto, ILocalityDetailDto, ILocalityListing, ILocalityListingFilter>;
  readonly dataSynchronizationService: IDataSynchronizationService;
  readonly synchronizationPendencyService: ISynchronizationPendencyService;
  readonly documentPdfService: IDocumentPdfService;
}

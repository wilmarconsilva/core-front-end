import { CrudService } from '../../../Shared/Services/CrudService';
import { buildQueryParams } from '../../../Shared/Utilities/QueryUtilities';
import { ICustomerService } from './Interfaces/ICustomerService';
import { ICustomerSaveDto } from '../DataTransferObjects/ICustomerSaveDto';
import { ICustomerDetailDto } from '../DataTransferObjects/ICustomerDetailDto';
import { ICustomerListing } from '../DataTransferObjects/ICustomerListing';
import { ICustomerListingFilter } from '../DataTransferObjects/ICustomerListingFilter';
import { ICustomerSynchronizationDto } from '../DataTransferObjects/ICustomerSynchronizationDto';

export class CustomerService
  extends CrudService<ICustomerSaveDto, ICustomerDetailDto, ICustomerListing, ICustomerListingFilter>
  implements ICustomerService
{
  constructor() {
    super('/customers');
  }

  async getSynchronization(filter: ICustomerListingFilter): Promise<ICustomerSynchronizationDto[]> {
    return this.request<ICustomerSynchronizationDto[]>(`${this.basePath}/synchronization?${buildQueryParams(filter)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }, { toastsConfiguration: { doNotShowSuccess: true } });
  }
}

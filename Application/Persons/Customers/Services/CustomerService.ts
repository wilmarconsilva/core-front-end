import { CrudService } from '../../../Shared/Services/CrudService';
import { ICustomerService } from './Interfaces/ICustomerService';
import { ICustomerSaveDto } from '../DataTransferObjects/ICustomerSaveDto';
import { ICustomerDetailDto } from '../DataTransferObjects/ICustomerDetailDto';
import { ICustomerListing } from '../DataTransferObjects/ICustomerListing';
import { ICustomerListingFilter } from '../DataTransferObjects/ICustomerListingFilter';

export class CustomerService
  extends CrudService<ICustomerSaveDto, ICustomerDetailDto, ICustomerListing, ICustomerListingFilter>
  implements ICustomerService
{
  constructor() {
    super('/customers');
  }
}

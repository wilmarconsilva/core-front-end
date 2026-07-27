import { CrudService } from '../CrudService';
import { ICustomerService } from '../../Interfaces/Services/ICustomerService';
import { ICustomerSaveDto } from '../../Interfaces/DataTransferObjects/Persons/Customers/ICustomerSaveDto';
import { ICustomerDetailDto } from '../../Interfaces/DataTransferObjects/Persons/Customers/ICustomerDetailDto';
import { ICustomerListing } from '../../Interfaces/DataTransferObjects/Persons/Customers/ICustomerListing';
import { ICustomerListingFilter } from '../../Interfaces/DataTransferObjects/Persons/Customers/ICustomerListingFilter';

export class CustomerService
  extends CrudService<ICustomerSaveDto, ICustomerDetailDto, ICustomerListing, ICustomerListingFilter>
  implements ICustomerService
{
  constructor() {
    super('/customers');
  }
}

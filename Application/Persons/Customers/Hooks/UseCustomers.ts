import { UseApplicationServices } from '../../../DependencyInjection/UseApplicationServices';
import { ICustomerSaveDto } from '../DataTransferObjects/ICustomerSaveDto';
import { ICustomerDetailDto } from '../DataTransferObjects/ICustomerDetailDto';
import { ICustomerListing } from '../DataTransferObjects/ICustomerListing';
import { ICustomerListingFilter } from '../DataTransferObjects/ICustomerListingFilter';
import { UseCrud, UseCrudResult } from '../../../Shared/Hooks/UseCrud';

export function UseCustomers(): UseCrudResult<ICustomerSaveDto, ICustomerDetailDto, ICustomerListing, ICustomerListingFilter> {
  const { customerService } = UseApplicationServices();
  return UseCrud(customerService);
}

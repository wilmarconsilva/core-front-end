import { IEntityListingFilter } from '../../../Shared/DataTransferObjects/Listings/IEntityListingFilter';

export interface ICustomerListingFilter extends IEntityListingFilter {
  name?: string;
}

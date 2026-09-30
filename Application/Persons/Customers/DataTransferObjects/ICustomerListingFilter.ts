import { IEntityListingFilter } from '../../IEntityListingFilter';

export interface ICustomerListingFilter extends IEntityListingFilter {
  name?: string;
}

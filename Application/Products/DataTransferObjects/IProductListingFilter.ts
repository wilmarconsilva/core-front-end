import { IEntityListingFilter } from '../../Shared/DataTransferObjects/Listings/IEntityListingFilter';

export interface IProductListingFilter extends IEntityListingFilter {
  description?: string;
}

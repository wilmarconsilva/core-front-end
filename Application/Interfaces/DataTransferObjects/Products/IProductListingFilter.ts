import { IEntityListingFilter } from '../IEntityListingFilter';

export interface IProductListingFilter extends IEntityListingFilter {
  description?: string;
}

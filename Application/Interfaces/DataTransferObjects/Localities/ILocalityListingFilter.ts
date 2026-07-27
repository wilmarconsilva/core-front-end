import { IEntityListingFilter } from '../IEntityListingFilter';

export interface ILocalityListingFilter extends IEntityListingFilter {
  description?: string;
  stateId?: number;
}

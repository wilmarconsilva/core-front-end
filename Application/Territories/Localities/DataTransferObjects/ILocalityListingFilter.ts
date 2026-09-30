import { IEntityListingFilter } from '../../../Shared/DataTransferObjects/Listings/IEntityListingFilter';

export interface ILocalityListingFilter extends IEntityListingFilter {
  description?: string;
  stateId?: number;
}

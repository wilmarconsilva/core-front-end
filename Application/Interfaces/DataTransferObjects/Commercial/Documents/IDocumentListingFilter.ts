import { IEntityListingFilter } from '../../IEntityListingFilter';

export interface IDocumentListingFilter extends IEntityListingFilter {
  creationDateTimeStart?: string;
  creationDateTimeEnd?: string;
  customerId?: number;
  localityId?: number;
}

import { IEntityListing } from '../../../Shared/DataTransferObjects/Listings/IEntityListing';

export interface ILocalityListing extends IEntityListing {
  description: string;
  stateId?: number;
}

import { IEntityListing } from '../../Shared/DataTransferObjects/Listings/IEntityListing';

export interface IProductListing extends IEntityListing {
  description: string;
}

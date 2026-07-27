import { IEntityListing } from '../IEntityListing';

export interface ILocalityListing extends IEntityListing {
  description: string;
  stateId?: number;
}

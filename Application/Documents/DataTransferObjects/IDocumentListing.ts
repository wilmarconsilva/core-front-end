import { IEntityListing } from '../../Shared/DataTransferObjects/Listings/IEntityListing';

export interface IDocumentListing extends IEntityListing {
  custormerName: string;
  customerLocalityState: string;
  creationDateTime: string;
  valueTotal: number;
}

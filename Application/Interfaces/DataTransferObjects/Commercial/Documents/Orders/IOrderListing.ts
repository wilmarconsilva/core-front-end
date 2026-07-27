import { IDocumentListing } from '../IDocumentListing';

export interface IOrderListing extends IDocumentListing {
  budgetId?: number;
}

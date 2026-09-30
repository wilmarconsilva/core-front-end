import { IDocumentListing } from '../../DataTransferObjects/IDocumentListing';

export interface IOrderListing extends IDocumentListing {
  budgetId?: number;
}

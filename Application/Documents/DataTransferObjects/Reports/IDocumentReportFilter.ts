import { IListingFilter } from '../../../Shared/DataTransferObjects/Listings/IListingFilter';

export interface IDocumentReportFilter extends IListingFilter {
  creationDateTimeStart?: string;
  creationDateTimeEnd?: string;
  lastUpdateDateTimeStart?: string;
  lastUpdateDateTimeEnd?: string;
}

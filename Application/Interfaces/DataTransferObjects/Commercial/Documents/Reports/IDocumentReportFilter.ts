import { IListingFilter } from '../../../IListingFilter';

export interface IDocumentReportFilter extends IListingFilter {
  creationDateTimeStart?: string;
  creationDateTimeEnd?: string;
  lastUpdateDateTimeStart?: string;
  lastUpdateDateTimeEnd?: string;
}

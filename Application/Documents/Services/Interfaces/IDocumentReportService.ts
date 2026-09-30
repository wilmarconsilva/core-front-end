import { IDocumentReport } from '../../DataTransferObjects/Reports/IDocumentReport';
import { IDocumentReportFilter } from '../../DataTransferObjects/Reports/IDocumentReportFilter';
import { IDocumentReportListing } from '../../DataTransferObjects/Reports/IDocumentReportListing';
import { IDocumentReportSummary } from '../../DataTransferObjects/Reports/IDocumentReportSummary';

export interface IDocumentReportService {
  get(filter: IDocumentReportFilter, basePath: string): Promise<IDocumentReportListing<IDocumentReport, IDocumentReportSummary>>;
}
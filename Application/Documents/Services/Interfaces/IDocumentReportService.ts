import { IDocumentReport } from '../DataTransferObjects/Commercial/Documents/Reports/IDocumentReport';
import { IDocumentReportFilter } from '../DataTransferObjects/Commercial/Documents/Reports/IDocumentReportFilter';
import { IDocumentReportListing } from '../DataTransferObjects/Commercial/Documents/Reports/IDocumentReportListing';
import { IDocumentReportSummary } from '../DataTransferObjects/Commercial/Documents/Reports/IDocumentReportSummary';

export interface IDocumentReportService {
  get(filter: IDocumentReportFilter, basePath: string): Promise<IDocumentReportListing<IDocumentReport, IDocumentReportSummary>>;
}
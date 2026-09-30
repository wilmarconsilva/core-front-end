import { IDocumentReportListing } from '../../../DataTransferObjects/Reports/IDocumentReportListing';
import { IDocumentReport } from '../../../DataTransferObjects/Reports/IDocumentReport';
import { IDocumentReportSummary } from '../../../DataTransferObjects/Reports/IDocumentReportSummary';

export interface IBudgetReportListing extends IDocumentReportListing<IDocumentReport, IDocumentReportSummary> {}

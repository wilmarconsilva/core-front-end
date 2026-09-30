import { IDocumentReportListing } from '../../Reports/IDocumentReportListing';
import { IDocumentReport } from '../../Reports/IDocumentReport';
import { IDocumentReportSummary } from '../../Reports/IDocumentReportSummary';

export interface IBudgetReportListing extends IDocumentReportListing<IDocumentReport, IDocumentReportSummary> {}

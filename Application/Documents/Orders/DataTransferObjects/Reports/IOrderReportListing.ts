import { IDocumentReportListing } from '../../../DataTransferObjects/Reports/IDocumentReportListing';
import { IOrderReport } from './IOrderReport';
import { IOrderReportSummary } from './IOrderReportSummary';

export interface IOrderReportListing extends IDocumentReportListing<IOrderReport, IOrderReportSummary> {}

import { IDocumentReport } from '../../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Reports/IDocumentReport';
import { IDocumentReportFilter } from '../../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Reports/IDocumentReportFilter';
import { IDocumentReportListing } from '../../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Reports/IDocumentReportListing';
import { IDocumentReportSummary } from '../../../Application/Interfaces/DataTransferObjects/Commercial/Documents/Reports/IDocumentReportSummary';
import { IBackOnlyScreenProps } from './IBackOnlyScreenProps';

/** Contrato mínimo que a tela de relatório precisa do service injetado (ex.: OrderReportService, BudgetReportService). */
export interface IDocumentReportSource<TReport extends IDocumentReport, TSummary extends IDocumentReportSummary> {
  get(filter: IDocumentReportFilter): Promise<IDocumentReportListing<TReport, TSummary>>;
}

export interface IDocumentReportScreenProps<TReport extends IDocumentReport, TSummary extends IDocumentReportSummary>
  extends IBackOnlyScreenProps {
  title: string;
  breadcrumbLabel: string;
  service: IDocumentReportSource<TReport, TSummary>;
}

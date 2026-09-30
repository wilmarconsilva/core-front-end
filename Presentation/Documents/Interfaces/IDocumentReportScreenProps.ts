import { IDocumentReport } from '../../../Application/Documents/DataTransferObjects/Reports/IDocumentReport';
import { IDocumentReportFilter } from '../../../Application/Documents/DataTransferObjects/Reports/IDocumentReportFilter';
import { IDocumentReportListing } from '../../../Application/Documents/DataTransferObjects/Reports/IDocumentReportListing';
import { IDocumentReportSummary } from '../../../Application/Documents/DataTransferObjects/Reports/IDocumentReportSummary';
import { IBackOnlyScreenProps } from '../../Shared/Interfaces/Screens/IBackOnlyScreenProps';

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

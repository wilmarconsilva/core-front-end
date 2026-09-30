export interface IDocumentReportListing<IDocumentReport, IDocumentReportSummary> {
  registers: IDocumentReport[];
  summary?: IDocumentReportSummary;
}
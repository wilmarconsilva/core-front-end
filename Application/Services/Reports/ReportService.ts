import { IDocumentReport } from "../../Interfaces/DataTransferObjects/Commercial/Documents/Reports/IDocumentReport";
import { IDocumentReportListing } from "../../Interfaces/DataTransferObjects/Commercial/Documents/Reports/IDocumentReportListing";
import { IDocumentReportSummary } from "../../Interfaces/DataTransferObjects/Commercial/Documents/Reports/IDocumentReportSummary";
import { buildQueryParams } from '../Utilities/QueryUtilities';
import { APIConsumerService } from '../APIConsumerService';

export class ReportService extends APIConsumerService {
    async get(filter: any, url: string): Promise<IDocumentReportListing<IDocumentReport, IDocumentReportSummary>> {
      const params = buildQueryParams(filter);
      return this.request<IDocumentReportListing<IDocumentReport, IDocumentReportSummary>>(`${url}?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }, { toastsConfiguration: { doNotShowSuccess: true } });
    }
  }
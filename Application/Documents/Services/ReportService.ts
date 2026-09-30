import { IDocumentReport } from "../DataTransferObjects/Reports/IDocumentReport";
import { IDocumentReportListing } from "../DataTransferObjects/Reports/IDocumentReportListing";
import { IDocumentReportSummary } from "../DataTransferObjects/Reports/IDocumentReportSummary";
import { buildQueryParams } from '../../Shared/Utilities/QueryUtilities';
import { APIConsumerService } from '../../Shared/Services/APIConsumerService';

export class ReportService extends APIConsumerService {
    async get(filter: any, url: string): Promise<IDocumentReportListing<IDocumentReport, IDocumentReportSummary>> {
      const params = buildQueryParams(filter);
      return this.request<IDocumentReportListing<IDocumentReport, IDocumentReportSummary>>(`${url}?${params}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }, { toastsConfiguration: { doNotShowSuccess: true } });
    }
  }
import { IDocumentReportService } from '../../Services/Interfaces/IDocumentReportService';
import { IOrderReportFilter } from '../DataTransferObjects/Reports/IOrderReportFilter';
import { IOrderReportListing } from '../DataTransferObjects/Reports/IOrderReportListing';
import { ReportService } from '../../Services/ReportService';

export class OrderReportService extends ReportService implements IDocumentReportService {
  async get(filter: IOrderReportFilter): Promise<IOrderReportListing> {
    return super.get(filter, '/ordersreport');
  }
}

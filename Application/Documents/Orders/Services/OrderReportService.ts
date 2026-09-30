import { IDocumentReportService } from '../../../../Interfaces/Services/IDocumentReportService';
import { IOrderReportFilter } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/Reports/IOrderReportFilter';
import { IOrderReportListing } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/Reports/IOrderReportListing';
import { ReportService } from '../../../Reports/ReportService';

export class OrderReportService extends ReportService implements IDocumentReportService {
  async get(filter: IOrderReportFilter): Promise<IOrderReportListing> {
    return super.get(filter, '/ordersreport');
  }
}

import { IDocumentReportService } from '../../Services/Interfaces/IDocumentReportService';
import { ReportService } from '../../Services/ReportService';
import { IBudgetReportFilter } from '../DataTransferObjects/Reports/IBudgetReportFilter';
import { IBudgetReportListing } from '../DataTransferObjects/Reports/IBudgetReportListing';
  
export class BudgetReportService extends ReportService implements IDocumentReportService {
  async get(filter: IBudgetReportFilter): Promise<IBudgetReportListing> {
    return super.get(filter, '/budgetsreport');
  }
}

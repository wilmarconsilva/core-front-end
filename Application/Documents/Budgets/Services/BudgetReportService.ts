import { IDocumentReportService } from '../../../../Interfaces/Services/IDocumentReportService';
import { ReportService } from '../../../Reports/ReportService';
import { IBudgetReportFilter } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/Reports/IBudgetReportFilter';
import { IBudgetReportListing } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/Reports/IBudgetReportListing';
  
export class BudgetReportService extends ReportService implements IDocumentReportService {
  async get(filter: IBudgetReportFilter): Promise<IBudgetReportListing> {
    return super.get(filter, '/budgetsreport');
  }
}

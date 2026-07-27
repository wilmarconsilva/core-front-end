import { ICrudService } from './ICrudService';
import { IBudgetSaveDto } from '../DataTransferObjects/Commercial/Documents/Budgets/IBudgetSaveDto';
import { IBudgetDetailDto } from '../DataTransferObjects/Commercial/Documents/Budgets/IBudgetDetailDto';
import { IBudgetListing } from '../DataTransferObjects/Commercial/Documents/Budgets/IBudgetListing';
import { IBudgetListingFilter } from '../DataTransferObjects/Commercial/Documents/Budgets/IBudgetListingFilter';
import { IOrderByBudgetDto } from '../DataTransferObjects/Commercial/Documents/Orders/IOrderByBudgetDto';
import { IOrderDetailDto } from '../DataTransferObjects/Commercial/Documents/Orders/IOrderDetailDto';
import { DocumentPrintFn } from '../../Hooks/UseDocumentPrint';

export interface IBudgetService extends ICrudService<IBudgetSaveDto, IBudgetDetailDto, IBudgetListing, IBudgetListingFilter> {
  createOrderByBudget(id: number, dto: IOrderByBudgetDto): Promise<IOrderDetailDto>;
  generatePdf(detail: IBudgetDetailDto, printHtml: DocumentPrintFn): Promise<void>;
}

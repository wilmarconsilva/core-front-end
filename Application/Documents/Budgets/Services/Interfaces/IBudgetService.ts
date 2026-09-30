import { ICrudService } from '../../../../Shared/Services/Interfaces/ICrudService';
import { IBudgetSaveDto } from '../../DataTransferObjects/IBudgetSaveDto';
import { IBudgetDetailDto } from '../../DataTransferObjects/IBudgetDetailDto';
import { IBudgetListing } from '../../DataTransferObjects/IBudgetListing';
import { IBudgetListingFilter } from '../../DataTransferObjects/IBudgetListingFilter';
import { DocumentPrintFn } from '../../../Hooks/UseDocumentPrint';

export interface IBudgetService extends ICrudService<IBudgetSaveDto, IBudgetDetailDto, IBudgetListing, IBudgetListingFilter> {
  generatePdf(detail: IBudgetDetailDto, printHtml: DocumentPrintFn): Promise<void>;
}

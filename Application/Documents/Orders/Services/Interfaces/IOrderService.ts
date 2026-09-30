import { ICrudService } from '../../../../Shared/Services/Interfaces/ICrudService';
import { IOrderSaveDto } from '../../DataTransferObjects/IOrderSaveDto';
import { IOrderDetailDto } from '../../DataTransferObjects/IOrderDetailDto';
import { IOrderListing } from '../../DataTransferObjects/IOrderListing';
import { IOrderListingFilter } from '../../DataTransferObjects/IOrderListingFilter';
import { DocumentPrintFn } from '../../../Hooks/UseDocumentPrint';

export interface IOrderService extends ICrudService<IOrderSaveDto, IOrderDetailDto, IOrderListing, IOrderListingFilter> {
  generatePdf(detail: IOrderDetailDto, printHtml: DocumentPrintFn): Promise<void>;
}

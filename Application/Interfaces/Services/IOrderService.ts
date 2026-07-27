import { ICrudService } from './ICrudService';
import { IOrderSaveDto } from '../DataTransferObjects/Commercial/Documents/Orders/IOrderSaveDto';
import { IOrderDetailDto } from '../DataTransferObjects/Commercial/Documents/Orders/IOrderDetailDto';
import { IOrderListing } from '../DataTransferObjects/Commercial/Documents/Orders/IOrderListing';
import { IOrderListingFilter } from '../DataTransferObjects/Commercial/Documents/Orders/IOrderListingFilter';
import { DocumentPrintFn } from '../../Hooks/UseDocumentPrint';

export interface IOrderService extends ICrudService<IOrderSaveDto, IOrderDetailDto, IOrderListing, IOrderListingFilter> {
  generatePdf(detail: IOrderDetailDto, printHtml: DocumentPrintFn): Promise<void>;
}

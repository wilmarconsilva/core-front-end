import { DocumentService } from '../DocumentService';
import { DocumentTemplateMapper } from '../DocumentTemplateMapper';
import { IOrderService } from '../../../../Interfaces/Services/IOrderService';
import { IOrderSaveDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderSaveDto';
import { IOrderDetailDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderDetailDto';
import { IOrderListing } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderListing';
import { IOrderListingFilter } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderListingFilter';
import { IDocumentTemplate } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/IDocumentTemplate';
import { OrderTemplateService } from './OrderTemplateService';

export class OrderService
  extends DocumentService<IOrderSaveDto, IOrderDetailDto, IOrderListing, IOrderListingFilter>
  implements IOrderService
{
  protected readonly templateService = new OrderTemplateService();

  constructor() {
    super('/orders');
  }

  protected getTemplate(detail: IOrderDetailDto): IDocumentTemplate {
    return DocumentTemplateMapper.fromDetail(detail, 'Pedido');
  }
}

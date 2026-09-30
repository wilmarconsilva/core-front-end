import { DocumentService } from '../../Services/DocumentService';
import { DocumentTemplateMapper } from '../../Services/DocumentTemplateMapper';
import { IOrderService } from './Interfaces/IOrderService';
import { IOrderSaveDto } from '../DataTransferObjects/IOrderSaveDto';
import { IOrderDetailDto } from '../DataTransferObjects/IOrderDetailDto';
import { IOrderListing } from '../DataTransferObjects/IOrderListing';
import { IOrderListingFilter } from '../DataTransferObjects/IOrderListingFilter';
import { IDocumentTemplate } from '../../DataTransferObjects/IDocumentTemplate';
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

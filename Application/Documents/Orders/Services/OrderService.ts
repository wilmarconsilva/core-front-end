import { CrudService } from '../../../Shared/Services/CrudService';
import { IOrderService } from './Interfaces/IOrderService';
import { IOrderSaveDto } from '../DataTransferObjects/IOrderSaveDto';
import { IOrderDetailDto } from '../DataTransferObjects/IOrderDetailDto';
import { IOrderListing } from '../DataTransferObjects/IOrderListing';
import { IOrderListingFilter } from '../DataTransferObjects/IOrderListingFilter';

export class OrderService
  extends CrudService<IOrderSaveDto, IOrderDetailDto, IOrderListing, IOrderListingFilter>
  implements IOrderService
{
  constructor() {
    super('/orders');
  }
}

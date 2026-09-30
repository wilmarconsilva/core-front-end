import { UseApplicationServices } from '../../../DependencyInjection/UseApplicationServices';
import { IOrderSaveDto } from '../DataTransferObjects/IOrderSaveDto';
import { IOrderDetailDto } from '../DataTransferObjects/IOrderDetailDto';
import { IOrderListing } from '../DataTransferObjects/IOrderListing';
import { IOrderListingFilter } from '../DataTransferObjects/IOrderListingFilter';
import { UseCrud, UseCrudResult } from '../../../Shared/Hooks/UseCrud';

export function UseOrders(): UseCrudResult<IOrderSaveDto, IOrderDetailDto, IOrderListing, IOrderListingFilter> {
  const { orderService } = UseApplicationServices();
  return UseCrud(orderService);
}

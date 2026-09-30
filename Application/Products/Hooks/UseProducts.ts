import { UseApplicationServices } from '../../DependencyInjection/UseApplicationServices';
import { IProductSaveDto } from '../DataTransferObjects/IProductSaveDto';
import { IProductDetailDto } from '../DataTransferObjects/IProductDetailDto';
import { IProductListing } from '../DataTransferObjects/IProductListing';
import { IProductListingFilter } from '../DataTransferObjects/IProductListingFilter';
import { UseCrud, UseCrudResult } from '../../Shared/Hooks/UseCrud';

export function UseProducts(): UseCrudResult<IProductSaveDto, IProductDetailDto, IProductListing, IProductListingFilter> {
  const { productService } = UseApplicationServices();
  return UseCrud(productService);
}

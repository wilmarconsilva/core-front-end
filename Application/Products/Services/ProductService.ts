import { CrudService } from '../../Shared/Services/CrudService';
import { IProductService } from './Interfaces/IProductService';
import { IProductSaveDto } from '../DataTransferObjects/IProductSaveDto';
import { IProductDetailDto } from '../DataTransferObjects/IProductDetailDto';
import { IProductListing } from '../DataTransferObjects/IProductListing';
import { IProductListingFilter } from '../DataTransferObjects/IProductListingFilter';

export class ProductService
  extends CrudService<IProductSaveDto, IProductDetailDto, IProductListing, IProductListingFilter>
  implements IProductService
{
  constructor() {
    super('/products');
  }
}

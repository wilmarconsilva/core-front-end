import { ICrudService } from '../../../Shared/Services/Interfaces/ICrudService';
import { IProductSaveDto } from '../../DataTransferObjects/IProductSaveDto';
import { IProductDetailDto } from '../../DataTransferObjects/IProductDetailDto';
import { IProductListing } from '../../DataTransferObjects/IProductListing';
import { IProductListingFilter } from '../../DataTransferObjects/IProductListingFilter';

export interface IProductService extends ICrudService<IProductSaveDto, IProductDetailDto, IProductListing, IProductListingFilter> {}

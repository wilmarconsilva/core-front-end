import { ICrudService } from './ICrudService';
import { ILocalitySaveDto } from '../DataTransferObjects/Localities/ILocalitySaveDto';
import { ILocalityDetailDto } from '../DataTransferObjects/Localities/ILocalityDetailDto';
import { ILocalityListing } from '../DataTransferObjects/Localities/ILocalityListing';
import { ILocalityListingFilter } from '../DataTransferObjects/Localities/ILocalityListingFilter';

export interface ILocalityService extends ICrudService<ILocalitySaveDto, ILocalityDetailDto, ILocalityListing, ILocalityListingFilter> 
{
    getQuantity(): Promise<number>;
}

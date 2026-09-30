import { IOfflineRepository } from '../../../Interfaces/IOfflineRepository';
import { ILocalitySaveDto } from '../../../../../Application/Interfaces/DataTransferObjects/Localities/ILocalitySaveDto';
import { ILocalityListing } from '../../../../../Application/Interfaces/DataTransferObjects/Localities/ILocalityListing';
import { ILocalityListingFilter } from '../../../../../Application/Interfaces/DataTransferObjects/Localities/ILocalityListingFilter';

export interface ILocalityOfflineRepository extends IOfflineRepository<ILocalitySaveDto, ILocalityListing, ILocalityListingFilter> {
    getQuantity(): Promise<number>
}
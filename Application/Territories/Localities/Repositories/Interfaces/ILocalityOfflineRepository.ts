import { IOfflineRepository } from '../../../../Offline/Repositories/Interfaces/IOfflineRepository';
import { ILocalitySaveDto } from '../../DataTransferObjects/ILocalitySaveDto';
import { ILocalityListing } from '../../DataTransferObjects/ILocalityListing';
import { ILocalityListingFilter } from '../../DataTransferObjects/ILocalityListingFilter';

export interface ILocalityOfflineRepository extends IOfflineRepository<ILocalitySaveDto, ILocalityListing, ILocalityListingFilter> {
    getQuantity(): Promise<number>
}
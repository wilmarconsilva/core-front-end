import { IndexedDbOfflineRepository } from '../IndexedDbOfflineRepository';
import { ILocalitySaveDto } from '../../../../Application/Interfaces/DataTransferObjects/Localities/ILocalitySaveDto';
import { ILocalityListing } from '../../../../Application/Interfaces/DataTransferObjects/Localities/ILocalityListing';
import { ILocalityListingFilter } from '../../../../Application/Interfaces/DataTransferObjects/Localities/ILocalityListingFilter';
import { IIndexedDbContext } from '../../IndexedDb/IIndexedDbContext';
import { ILocalityOfflineRepository } from './Interfaces/ILocalityOfflineRepository';
import { OfflineStoreName } from '../../IndexedDb/IndexedDbSchema';
import { OfflineListingMapper, OfflineFilterPredicate } from '../IndexedDbOfflineRepository';

export class LocalityOfflineRepository 
    extends IndexedDbOfflineRepository<ILocalitySaveDto, ILocalityListing, ILocalityListingFilter>
    implements ILocalityOfflineRepository 
{

    constructor(
    context: IIndexedDbContext,
    storeName: OfflineStoreName,
    toListing: OfflineListingMapper<ILocalitySaveDto, ILocalityListing>,
    matches: OfflineFilterPredicate<ILocalityListing, ILocalityListingFilter>,
    listingToSaveDto: (listing: ILocalityListing) => ILocalitySaveDto,
    ) 
    {
        super(context, storeName, toListing, matches, listingToSaveDto);
    }

    async getQuantity(): Promise<number> {
        const database = await this.context.getDatabase();
        return (await database.count(this.storeName));
    }
}
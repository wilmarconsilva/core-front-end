import { IndexedDbOfflineRepository } from '../../../Offline/Repositories/IndexedDbOfflineRepository';
import { ILocalitySaveDto } from '../../../../Application/Territories/Localities/DataTransferObjects/ILocalitySaveDto';
import { ILocalityListing } from '../../../../Application/Territories/Localities/DataTransferObjects/ILocalityListing';
import { ILocalityListingFilter } from '../../../../Application/Territories/Localities/DataTransferObjects/ILocalityListingFilter';
import { IIndexedDbContext } from '../../../Shared/Persistence/IndexedDb/IIndexedDbContext';
import { ILocalityOfflineRepository } from '../../../../Application/Territories/Localities/Repositories/Interfaces/ILocalityOfflineRepository';
import { OfflineStoreName } from '../../../Shared/Persistence/IndexedDb/IndexedDbSchema';
import { OfflineListingMapper, OfflineFilterPredicate } from '../../../Offline/Repositories/IndexedDbOfflineRepository';

export class LocalityOfflineRepository 
    extends IndexedDbOfflineRepository<ILocalitySaveDto, ILocalityListing, ILocalityListingFilter, ILocalitySaveDto>
    implements ILocalityOfflineRepository 
{

    constructor(
    context: IIndexedDbContext,
    storeName: OfflineStoreName,
    toListing: OfflineListingMapper<ILocalitySaveDto, ILocalityListing>,
    matches: OfflineFilterPredicate<ILocalityListing, ILocalityListingFilter>,
    syncedToSaveDto: (item: ILocalitySaveDto) => ILocalitySaveDto,
    ) 
    {
        super(context, storeName, toListing, matches, syncedToSaveDto);
    }

    async getQuantity(): Promise<number> {
        const database = await this.context.getDatabase();
        return (await database.count(this.storeName));
    }
}
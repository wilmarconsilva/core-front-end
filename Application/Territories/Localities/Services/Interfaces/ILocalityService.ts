import { ICrudService } from '../../../../Shared/Services/Interfaces/ICrudService';
import { ILocalitySaveDto } from '../../DataTransferObjects/ILocalitySaveDto';
import { ILocalityDetailDto } from '../../DataTransferObjects/ILocalityDetailDto';
import { ILocalityListing } from '../../DataTransferObjects/ILocalityListing';
import { ILocalityListingFilter } from '../../DataTransferObjects/ILocalityListingFilter';

export interface ILocalityService extends ICrudService<ILocalitySaveDto, ILocalityDetailDto, ILocalityListing, ILocalityListingFilter> 
{
    getQuantity(): Promise<number>;
    /** Localidades com a sigla do estado para o snapshot offline. */
    getSynchronization(filter: ILocalityListingFilter): Promise<ILocalitySaveDto[]>;
}

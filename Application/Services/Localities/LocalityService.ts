import { CrudService } from '../CrudService';
import { ILocalityService } from '../../Interfaces/Services/ILocalityService';
import { ILocalitySaveDto } from '../../Interfaces/DataTransferObjects/Localities/ILocalitySaveDto';
import { ILocalityDetailDto } from '../../Interfaces/DataTransferObjects/Localities/ILocalityDetailDto';
import { ILocalityListing } from '../../Interfaces/DataTransferObjects/Localities/ILocalityListing';
import { ILocalityListingFilter } from '../../Interfaces/DataTransferObjects/Localities/ILocalityListingFilter';

export class LocalityService
  extends CrudService<ILocalitySaveDto, ILocalityDetailDto, ILocalityListing, ILocalityListingFilter>
  implements ILocalityService
{
  constructor() {
    super('/localities');
  }

  async getQuantity(): Promise<number> {
      return this.request<number>(`/localities/quantity`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }, { toastsConfiguration: { doNotShowSuccess: true } });
    }
}

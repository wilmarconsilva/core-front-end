import { CrudService } from '../../../Shared/Services/CrudService';
import { buildQueryParams } from '../../../Shared/Utilities/QueryUtilities';
import { ILocalityService } from './Interfaces/ILocalityService';
import { ILocalitySaveDto } from '../DataTransferObjects/ILocalitySaveDto';
import { ILocalityDetailDto } from '../DataTransferObjects/ILocalityDetailDto';
import { ILocalityListing } from '../DataTransferObjects/ILocalityListing';
import { ILocalityListingFilter } from '../DataTransferObjects/ILocalityListingFilter';

export class LocalityService
  extends CrudService<ILocalitySaveDto, ILocalityDetailDto, ILocalityListing, ILocalityListingFilter>
  implements ILocalityService
{
  constructor() {
    super('/localities');
  }

  async getSynchronization(filter: ILocalityListingFilter): Promise<ILocalitySaveDto[]> {
    return this.request<ILocalitySaveDto[]>(`${this.basePath}/synchronization?${buildQueryParams(filter)}`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
    }, { toastsConfiguration: { doNotShowSuccess: true } });
  }

  async getQuantity(): Promise<number> {
      return this.request<number>(`/localities/quantity`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
      }, { toastsConfiguration: { doNotShowSuccess: true } });
    }
}

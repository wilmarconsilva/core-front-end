import { UseApplicationServices } from '../../../DependencyInjection/UseApplicationServices';
import { ILocalitySaveDto } from '../DataTransferObjects/ILocalitySaveDto';
import { ILocalityDetailDto } from '../DataTransferObjects/ILocalityDetailDto';
import { ILocalityListing } from '../DataTransferObjects/ILocalityListing';
import { ILocalityListingFilter } from '../DataTransferObjects/ILocalityListingFilter';
import { UseCrud, UseCrudResult } from '../../../Shared/Hooks/UseCrud';

export function UseLocalities(): UseCrudResult<ILocalitySaveDto, ILocalityDetailDto, ILocalityListing, ILocalityListingFilter> {
  const { localityService } = UseApplicationServices();
  return UseCrud(localityService);
}

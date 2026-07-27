import { useMemo } from 'react';
import { OfflineCompositionRoot } from '../../Infrastructure/Persistence/OfflineCompositionRoot';
import { ILocalitySaveDto } from '../Interfaces/DataTransferObjects/Localities/ILocalitySaveDto';
import { ILocalityDetailDto } from '../Interfaces/DataTransferObjects/Localities/ILocalityDetailDto';
import { ILocalityListing } from '../Interfaces/DataTransferObjects/Localities/ILocalityListing';
import { ILocalityListingFilter } from '../Interfaces/DataTransferObjects/Localities/ILocalityListingFilter';
import { UseCrud, UseCrudResult } from './UseCrud';

const localityService = OfflineCompositionRoot.createLocalityService();

export function UseLocalities(): UseCrudResult<ILocalitySaveDto, ILocalityDetailDto, ILocalityListing, ILocalityListingFilter> {
  const service = useMemo(() => localityService, []);
  return UseCrud(service);
}

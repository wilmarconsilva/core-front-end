import { useMemo } from 'react';
import { OfflineCompositionRoot } from '../../Infrastructure/Persistence/OfflineCompositionRoot';
import { ICustomerSaveDto } from '../Interfaces/DataTransferObjects/Persons/Customers/ICustomerSaveDto';
import { ICustomerDetailDto } from '../Interfaces/DataTransferObjects/Persons/Customers/ICustomerDetailDto';
import { ICustomerListing } from '../Interfaces/DataTransferObjects/Persons/Customers/ICustomerListing';
import { ICustomerListingFilter } from '../Interfaces/DataTransferObjects/Persons/Customers/ICustomerListingFilter';
import { UseCrud, UseCrudResult } from './UseCrud';

const customerService = OfflineCompositionRoot.createCustomerService();

export function UseCustomers(): UseCrudResult<ICustomerSaveDto, ICustomerDetailDto, ICustomerListing, ICustomerListingFilter> {
  const service = useMemo(() => customerService, []);
  return UseCrud(service);
}

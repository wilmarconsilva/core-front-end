import { ICrudService } from '../../../../Shared/Services/Interfaces/ICrudService';
import { ICustomerSaveDto } from '../../DataTransferObjects/ICustomerSaveDto';
import { ICustomerDetailDto } from '../../DataTransferObjects/ICustomerDetailDto';
import { ICustomerListing } from '../../DataTransferObjects/ICustomerListing';
import { ICustomerListingFilter } from '../../DataTransferObjects/ICustomerListingFilter';
import { ICustomerSynchronizationDto } from '../../DataTransferObjects/ICustomerSynchronizationDto';

export interface ICustomerService extends ICrudService<ICustomerSaveDto, ICustomerDetailDto, ICustomerListing, ICustomerListingFilter> {
  /** Clientes completos (com endereços) para o snapshot offline. */
  getSynchronization(filter: ICustomerListingFilter): Promise<ICustomerSynchronizationDto[]>;
}

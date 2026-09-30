import { ICrudService } from '../../../../Shared/Services/Interfaces/ICrudService';
import { ICustomerSaveDto } from '../../DataTransferObjects/ICustomerSaveDto';
import { ICustomerDetailDto } from '../../DataTransferObjects/ICustomerDetailDto';
import { ICustomerListing } from '../../DataTransferObjects/ICustomerListing';
import { ICustomerListingFilter } from '../../DataTransferObjects/ICustomerListingFilter';

export interface ICustomerService extends ICrudService<ICustomerSaveDto, ICustomerDetailDto, ICustomerListing, ICustomerListingFilter> {}

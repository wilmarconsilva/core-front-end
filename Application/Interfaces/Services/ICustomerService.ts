import { ICrudService } from './ICrudService';
import { ICustomerSaveDto } from '../DataTransferObjects/Persons/Customers/ICustomerSaveDto';
import { ICustomerDetailDto } from '../DataTransferObjects/Persons/Customers/ICustomerDetailDto';
import { ICustomerListing } from '../DataTransferObjects/Persons/Customers/ICustomerListing';
import { ICustomerListingFilter } from '../DataTransferObjects/Persons/Customers/ICustomerListingFilter';

export interface ICustomerService extends ICrudService<ICustomerSaveDto, ICustomerDetailDto, ICustomerListing, ICustomerListingFilter> {}

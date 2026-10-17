import { IEntityReferenceDto } from '../../../Shared/DataTransferObjects/Entities/IEntityReferenceDto';

export interface ICustomerAddressDetailDto {
  id: number;
  neighborhood?: string;
  street?: string;
  locality: IEntityReferenceDto;
  complement?: string;
  postalCode?: string;
  number?: string;
}

import { PersonType } from '../../../../Domain/Persons/Enums/PersonType';
import { ICustomerAddressDetailDto } from './ICustomerAddressDetailDto';

export interface ICustomerDetailDto {
  id: number;
  name: string;
  personType: PersonType;
  document: string;
  addresses: ICustomerAddressDetailDto[];
  email?: string;
  stateRegistration?: string;
}

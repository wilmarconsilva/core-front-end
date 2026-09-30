import { PersonType } from '../../../../Domain/Persons/Enums/PersonType';
import { ICustomerAddressSaveDto } from './ICustomerAddressSaveDto';

export interface ICustomerSaveDto {
  id: number;
  name: string;
  personType: PersonType;
  document: string;
  addresses: ICustomerAddressSaveDto[];
  email?: string;
  stateRegistration?: string;
}

import { PersonType } from '../../../../Domain/Persons/Enums/PersonType';
import { ICustomerAddressSaveDto } from './ICustomerAddressSaveDto';

/** Cliente para o snapshot offline, no mesmo formato do ICustomerSaveDto. */
export interface ICustomerSynchronizationDto {
  id: number;
  name: string;
  personType: PersonType;
  document: string;
  addresses: ICustomerAddressSaveDto[];
  email?: string;
  stateRegistration?: string;
}

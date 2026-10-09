import { ICustomerSaveDto } from '../../../Application/Persons/Customers/DataTransferObjects/ICustomerSaveDto';
import { PersonType } from '../../../Domain/Persons/Enums/PersonType';

export class CustomerSaveDtoBuilder {
  static customer(name = 'Maria da Silva', id = 0, localityId = 1): ICustomerSaveDto {
    return {
      id,
      name,
      personType: PersonType.Natural,
      document: '52998224725',
      email: 'maria@email.com',
      addresses: [{ id: 0, street: 'Rua das Flores', neighborhood: 'Centro', number: '100', localityId }],
    };
  }
}

import { ILocalitySaveDto } from '../../../Application/Territories/Localities/DataTransferObjects/ILocalitySaveDto';

export class LocalitySaveDtoBuilder {
  static locality(description = 'Blumenau', id = 0, stateId = 24, stateAcronym = 'SC'): ILocalitySaveDto {
    return { id, description, stateId, stateAcronym };
  }
}

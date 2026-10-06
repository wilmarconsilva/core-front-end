import { IStateReferenceDto } from '../../States/DataTransferObjects/IStateReferenceDto';

export interface ILocalityDetailDto {
  id: number;
  description: string;
  state: IStateReferenceDto;
}

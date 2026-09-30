import { IEntityReferenceDto } from '../../../Shared/DataTransferObjects/Entities/IEntityReferenceDto';

export interface ILocalityDetailDto {
  id: number;
  description: string;
  state?: IEntityReferenceDto;
}

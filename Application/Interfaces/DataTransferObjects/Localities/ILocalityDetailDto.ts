import { IEntityReferenceDto } from '../Entities/IEntityReferenceDto';

export interface ILocalityDetailDto {
  id: number;
  description: string;
  state?: IEntityReferenceDto;
}

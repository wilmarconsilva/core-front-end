import { IEntityReferenceDto } from '../../../Shared/DataTransferObjects/Entities/IEntityReferenceDto';

export interface IOrderProductDetailDto {
  id: number;
  product: IEntityReferenceDto;
  quantity: number;
  valueUnit: number;
  valueTotal: number;
}

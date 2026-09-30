import { IEntityReferenceDto } from '../../../Shared/DataTransferObjects/Entities/IEntityReferenceDto';

export interface IBudgetProductDetailDto {
  id: number;
  product: IEntityReferenceDto;
  quantity: number;
  valueUnit: number;
  valueTotal: number;
}

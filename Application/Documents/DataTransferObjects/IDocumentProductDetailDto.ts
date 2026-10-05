import { IEntityReferenceDto } from '../../Shared/DataTransferObjects/Entities/IEntityReferenceDto';

export interface IDocumentProductDetailDto {
  id: number;
  product: IEntityReferenceDto;
  quantity: number;
  valueUnit: number;
  valueTotal: number;
}

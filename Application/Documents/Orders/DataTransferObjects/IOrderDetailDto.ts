import { IEntityReferenceDto } from '../../../Shared/DataTransferObjects/Entities/IEntityReferenceDto';
import { IOrderPaymentSaveDto } from './IOrderPaymentSaveDto';
import { IOrderProductDetailDto } from './IOrderProductDetailDto';

export interface IOrderDetailDto {
  id: number;
  userId: number;
  creationDateTime: string;
  customer: IEntityReferenceDto;
  budgetId?: number;
  payment: IOrderPaymentSaveDto;
  observations?: string;
  customerSignatureImage?: string;
  products: IOrderProductDetailDto[];
}

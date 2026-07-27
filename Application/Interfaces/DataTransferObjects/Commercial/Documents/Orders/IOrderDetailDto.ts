import { IEntityReferenceDto } from '../../../Entities/IEntityReferenceDto';
import { IPaymentSaveDto } from '../Payments/IPaymentSaveDto';
import { IOrderProductDetailDto } from './IOrderProductDetailDto';

export interface IOrderDetailDto {
  id: number;
  userId: number;
  customer: IEntityReferenceDto;
  budgetId?: number;
  payment: IPaymentSaveDto;
  observations?: string;
  customerSignatureImage?: string;
  products: IOrderProductDetailDto[];
}

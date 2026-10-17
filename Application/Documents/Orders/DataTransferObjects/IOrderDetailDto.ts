import { IEntityReferenceDto } from '../../../Shared/DataTransferObjects/Entities/IEntityReferenceDto';
import { IPaymentSaveDto } from '../../DataTransferObjects/Payments/IPaymentSaveDto';
import { IOrderProductDetailDto } from './IOrderProductDetailDto';

export interface IOrderDetailDto {
  id: number;
  userId: number;
  creationDateTime: string;
  customer: IEntityReferenceDto;
  budgetId?: number;
  payment: IPaymentSaveDto;
  observations?: string;
  customerSignatureImage?: string;
  products: IOrderProductDetailDto[];
}

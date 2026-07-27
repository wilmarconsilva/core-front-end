import { IEntityReferenceDto } from '../../../Entities/IEntityReferenceDto';
import { IPaymentSaveDto } from '../Payments/IPaymentSaveDto';
import { IBudgetProductDetailDto } from './IBudgetProductDetailDto';

export interface IBudgetDetailDto {
  id: number;
  userId: number;
  customer: IEntityReferenceDto;
  payment: IPaymentSaveDto;
  observations?: string;
  customerSignatureImage?: string;
  products: IBudgetProductDetailDto[];
}

import { IEntityReferenceDto } from '../../../Entities/IEntityReferenceDto';
import { IBudgetPaymentSaveDto } from './IBudgetPaymentSaveDto';
import { IBudgetProductDetailDto } from './IBudgetProductDetailDto';

export interface IBudgetDetailDto {
  id: number;
  userId: number;
  customer: IEntityReferenceDto;
  payment: IBudgetPaymentSaveDto;
  observations?: string;
  customerSignatureImage?: string;
  products: IBudgetProductDetailDto[];
}

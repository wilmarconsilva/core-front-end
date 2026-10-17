import { IEntityReferenceDto } from '../../../Shared/DataTransferObjects/Entities/IEntityReferenceDto';
import { IPaymentSaveDto } from '../../DataTransferObjects/Payments/IPaymentSaveDto';
import { IBudgetProductDetailDto } from './IBudgetProductDetailDto';

export interface IBudgetDetailDto {
  id: number;
  userId: number;
  creationDateTime: string;
  customer: IEntityReferenceDto;
  payment: IPaymentSaveDto;
  observations?: string;
  customerSignatureImage?: string;
  products: IBudgetProductDetailDto[];
}

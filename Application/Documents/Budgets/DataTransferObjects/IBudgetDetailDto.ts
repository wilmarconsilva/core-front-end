import { IEntityReferenceDto } from '../../../Shared/DataTransferObjects/Entities/IEntityReferenceDto';
import { IBudgetPaymentSaveDto } from './IBudgetPaymentSaveDto';
import { IBudgetProductDetailDto } from './IBudgetProductDetailDto';

export interface IBudgetDetailDto {
  id: number;
  userId: number;
  creationDateTime: string;
  customer: IEntityReferenceDto;
  payment: IBudgetPaymentSaveDto;
  observations?: string;
  customerSignatureImage?: string;
  products: IBudgetProductDetailDto[];
}

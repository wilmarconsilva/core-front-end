import { IPaymentSaveDto } from './Payments/IPaymentSaveDto';
import { IDocumentProductSaveDto } from './IDocumentProductSaveDto';

export interface IDocumentSaveDto<TProduct extends IDocumentProductSaveDto> {
  id: number;
  creationDateTime: Date;
  customerId: number;
  budgetId?: number;
  payment: IPaymentSaveDto;
  observations?: string;
  customerSignatureImage?: string;
  products: TProduct[];
}

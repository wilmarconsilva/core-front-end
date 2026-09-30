import { IPaymentSaveDto } from './Payments/IPaymentSaveDto';
import { IDocumentProductSaveDto } from './IDocumentProductSaveDto';

export interface IDocumentSaveDto<
  TProduct extends IDocumentProductSaveDto,
  TPayment extends IPaymentSaveDto = IPaymentSaveDto,
> {
  id: number;
  creationDateTime: Date;
  customerId: number;
  budgetId?: number;
  payment: TPayment;
  observations?: string;
  customerSignatureImage?: string;
  products: TProduct[];
}

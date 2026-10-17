import { IEntityReferenceDto } from '../../Shared/DataTransferObjects/Entities/IEntityReferenceDto';
import { IDocumentProductDetailDto } from './IDocumentProductDetailDto';
import { IPaymentSaveDto } from './Payments/IPaymentSaveDto';

export interface IDocumentDetailDto {
  /** ISO 8601 (como vem da API). */
  creationDateTime: string;
  customer: IEntityReferenceDto;
  payment: IPaymentSaveDto;
  observations?: string;
  customerSignatureImage?: string;
  products: IDocumentProductDetailDto[];
}

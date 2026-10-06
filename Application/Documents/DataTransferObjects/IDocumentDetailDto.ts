import { IEntityReferenceDto } from '../../Shared/DataTransferObjects/Entities/IEntityReferenceDto';
import { IDocumentProductDetailDto } from './IDocumentProductDetailDto';
import { IDocumentPaymentDto } from './Payments/IDocumentPaymentDto';

export interface IDocumentDetailDto {
  /** ISO 8601 (como vem da API). */
  creationDateTime: string;
  customer: IEntityReferenceDto;
  payment: IDocumentPaymentDto;
  observations?: string;
  customerSignatureImage?: string;
  products: IDocumentProductDetailDto[];
}

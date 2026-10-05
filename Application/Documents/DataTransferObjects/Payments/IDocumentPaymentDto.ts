import { PaymentMethod } from '../../../../Domain/Documents/ValueObjects/Payments/Enums/PaymentMethod';
import { IPaymentSaveDto } from './IPaymentSaveDto';

/** Pagamento comum aos documentos: cada documento restringe o método no seu próprio DTO. */
export interface IDocumentPaymentDto extends IPaymentSaveDto {
  method: PaymentMethod | null;
}

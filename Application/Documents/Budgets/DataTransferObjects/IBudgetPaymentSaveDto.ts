import { PaymentMethod } from '../../../../Domain/Documents/ValueObjects/Payments/Enums/PaymentMethod';
import { IPaymentSaveDto } from '../../DataTransferObjects/Payments/IPaymentSaveDto';

export interface IBudgetPaymentSaveDto extends IPaymentSaveDto {
  method: PaymentMethod | null;
}

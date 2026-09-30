import { PaymentMethod } from '../../../../../../Domain/ValueObjects/Enums/Commercial/Documents/Payments/PaymentMethod';
import { IPaymentSaveDto } from '../Payments/IPaymentSaveDto';

export interface IBudgetPaymentSaveDto extends IPaymentSaveDto {
  method: PaymentMethod | null;
}

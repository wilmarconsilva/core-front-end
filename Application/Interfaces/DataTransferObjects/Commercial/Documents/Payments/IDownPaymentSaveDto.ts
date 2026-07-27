import { PaymentMethod } from '../../../../../../Domain/ValueObjects/Enums/Commercial/Documents/Payments/PaymentMethod';

export interface IDownPaymentSaveDto {
  value: number;
  percentage: number;
  method: PaymentMethod;
}

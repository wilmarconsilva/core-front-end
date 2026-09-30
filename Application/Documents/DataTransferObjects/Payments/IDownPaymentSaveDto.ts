import { PaymentMethod } from '../../../../Domain/Documents/ValueObjects/Payments/Enums/PaymentMethod';

export interface IDownPaymentSaveDto {
  value: number;
  percentage: number;
  method: PaymentMethod;
}

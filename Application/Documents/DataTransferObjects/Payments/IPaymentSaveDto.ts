import { PaymentMethod } from '../../../../Domain/Documents/ValueObjects/Payments/Enums/PaymentMethod';
import { InstallmentSaveDto } from './IInstallmentSaveDto';

export interface IPaymentSaveDto {
  method: PaymentMethod | null;
  discountValue: number;
  installment?: InstallmentSaveDto;
}

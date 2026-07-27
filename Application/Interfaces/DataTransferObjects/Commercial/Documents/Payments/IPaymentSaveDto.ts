import { PaymentMethod } from '../../../../../../Domain/ValueObjects/Enums/Commercial/Documents/Payments/PaymentMethod';
import { InstallmentSaveDto } from './IInstallmentSaveDto';

export interface IPaymentSaveDto {
  method: PaymentMethod;
  discountValue: number;
  installment?: InstallmentSaveDto;
}

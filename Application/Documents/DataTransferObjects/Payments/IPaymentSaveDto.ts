import { InstallmentSaveDto } from './IInstallmentSaveDto';

export interface IPaymentSaveDto {
  discountValue: number;
  installment?: InstallmentSaveDto;
}

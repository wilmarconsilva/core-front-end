import { IDownPaymentSaveDto } from './IDownPaymentSaveDto';

export interface InstallmentSaveDto {
  quantity: number;
  downPayment?: IDownPaymentSaveDto;
}

import { PaymentMethod } from '../../../../Domain/Documents/ValueObjects/Payments/Enums/PaymentMethod';

export interface IDocumentReport {
  id: number;
  creationDateTime: string;
  lastUpdateDateTime: string;
  valueSubtotal: number;
  valueTotal: number;
  paymentMethod: PaymentMethod | null;
  paymentMethodDescription: string;
  paymentDiscountValue: number;
  paymentInstallmentQuantity?: number;
  paymentInstallmentValue?: number;
  paymentInstallmentDownPaymentValue?: number;
  paymentInstallmentDownPaymentPercentage?: number;
  paymentInstallmentDownPaymentMethod?: PaymentMethod;
  paymentInstallmentDownPaymentMethodDescription?: string;
  observations?: string;
  userName: string;
  customerName: string;
  customerLocalityState: string;
}

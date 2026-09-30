import { Dispatch, SetStateAction, useEffect } from 'react';
import { PaymentMethod } from '../../Domain/ValueObjects/Enums/Commercial/Documents/Payments/PaymentMethod';
import {
  DocumentInstallmentFormState,
  InstallmentFormService,
} from '../Services/Commercial/Documents/Payments/InstallmentFormService';
export function UseDocumentInstallmentForm(
  valueTotal: number,
  installment: DocumentInstallmentFormState,
  setInstallment: Dispatch<SetStateAction<DocumentInstallmentFormState>>,
  clearError: (key: string) => void,
) {
  useEffect(() => {
    setInstallment((previous) => InstallmentFormService.recalculateOnTotalChange(previous, valueTotal));
  }, [valueTotal, setInstallment]);

  const installmentValue = InstallmentFormService.calculateInstallmentValue(
    valueTotal,
    installment.installmentQty,
    installment.downPaymentValue,
    installment.hasDownPayment,
  );

  const setHasInstallment = (hasInstallment: boolean) => {
    setInstallment((previous) => InstallmentFormService.applyHasInstallment(previous, hasInstallment));
    clearError('installmentQty');
    clearError('downPaymentMethod');
    clearError('downPaymentValue');
    clearError('downPaymentPercentage');
  };

  const setInstallmentQty = (text: string) => {
    const installmentQty = parseInt(text, 10) || 0;
    setInstallment((previous) => ({ ...previous, installmentQty }));
    clearError('installmentQty');
  };

  const setHasDownPayment = (hasDownPayment: boolean) => {
    setInstallment((previous) => InstallmentFormService.applyHasDownPayment(previous, hasDownPayment));
    clearError('downPaymentMethod');
    clearError('downPaymentValue');
    clearError('downPaymentPercentage');
  };

  const setDownPaymentMethod = (downPaymentMethod: PaymentMethod) => {
    setInstallment((previous) => ({ ...previous, downPaymentMethod }));
    clearError('downPaymentMethod');
  };

  const setDownPaymentValue = (downPaymentValue: number) => {
    setInstallment((previous) =>
      InstallmentFormService.syncFromDownPaymentValue(previous, downPaymentValue, valueTotal),
    );
    clearError('downPaymentValue');
    clearError('downPaymentPercentage');
  };

  const setDownPaymentPercentage = (downPaymentPercentage: number) => {
    setInstallment((previous) =>
      InstallmentFormService.syncFromDownPaymentPercentage(
        previous,
        downPaymentPercentage,
        valueTotal,
      ),
    );
    clearError('downPaymentPercentage');
    clearError('downPaymentValue');
  };

  return {
    hasInstallment: installment.hasInstallment,
    setHasInstallment,
    installmentQty: installment.installmentQty,
    setInstallmentQty,
    installmentValue,
    hasDownPayment: installment.hasDownPayment,
    setHasDownPayment,
    downPaymentMethod: installment.downPaymentMethod,
    setDownPaymentMethod,
    downPaymentValue: installment.downPaymentValue,
    setDownPaymentValue,
    downPaymentPercentage: installment.downPaymentPercentage,
    setDownPaymentPercentage,
  };
}

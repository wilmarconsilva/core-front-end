import { IValidationRule } from '../../../../Hooks/UseFormValidation';
import { PaymentMethod } from '../../../../../Domain/ValueObjects/Enums/Commercial/Documents/Payments/PaymentMethod';
import { InstallmentSaveDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Payments/IInstallmentSaveDto';
import { IPaymentSaveDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Payments/IPaymentSaveDto';
export type DownPaymentSyncSource = 'value' | 'percentage';

export interface DocumentInstallmentFormState {
  hasInstallment: boolean;
  installmentQty: number;
  hasDownPayment: boolean;
  downPaymentMethod: PaymentMethod;
  downPaymentValue: number;
  downPaymentPercentage: number;
  downPaymentSyncSource: DownPaymentSyncSource;
}

export class InstallmentFormService {
  static createInitialState(): DocumentInstallmentFormState {
    return {
      hasInstallment: false,
      installmentQty: 0,
      hasDownPayment: false,
      downPaymentMethod: PaymentMethod.Check,
      downPaymentValue: 0,
      downPaymentPercentage: 0,
      downPaymentSyncSource: 'percentage',
    };
  }

  static fromPayment(payment: IPaymentSaveDto): DocumentInstallmentFormState {
    const installment = payment.installment;
    const downPayment = installment?.downPayment;

    return {
      hasInstallment: !!installment,
      installmentQty: installment?.quantity ?? 0,
      hasDownPayment: !!downPayment,
      downPaymentMethod: downPayment?.method ?? PaymentMethod.Check,
      downPaymentValue: downPayment?.value ?? 0,
      downPaymentPercentage: downPayment?.percentage ?? 0,
      downPaymentSyncSource: 'percentage',
    };
  }

  static buildValidationRules(state: DocumentInstallmentFormState): IValidationRule[] {
    if (!state.hasInstallment) return [];

    const rules: IValidationRule[] = [
      { key: 'installmentQty', isValid: state.installmentQty > 0 },
    ];

    if (state.hasDownPayment) {
      rules.push(
        { key: 'downPaymentMethod', isValid: !!state.downPaymentMethod },
        { key: 'downPaymentValue', isValid: state.downPaymentValue > 0 },
        { key: 'downPaymentPercentage', isValid: state.downPaymentPercentage > 0 },
      );
    }

    return rules;
  }

  static toInstallmentSaveDto(
    state: DocumentInstallmentFormState,
  ): InstallmentSaveDto | undefined {
    if (!state.hasInstallment) return undefined;

    const quantity = state.installmentQty;
    const downPayment = state.hasDownPayment
      ? {
        value: state.downPaymentValue,
        percentage: state.downPaymentPercentage,
        method: state.downPaymentMethod,
      }
      : undefined;

    return { quantity, downPayment };
  }

  static applyHasInstallment(
    state: DocumentInstallmentFormState,
    hasInstallment: boolean,
  ): DocumentInstallmentFormState {
    if (!hasInstallment) {
      return InstallmentFormService.createInitialState();
    }

    return {
      ...state,
      hasInstallment: true,
      installmentQty: state.installmentQty ?? 0,
    };
  }

  static applyHasDownPayment(
    state: DocumentInstallmentFormState,
    hasDownPayment: boolean,
  ): DocumentInstallmentFormState {
    if (!hasDownPayment) {
      return {
        ...state,
        hasDownPayment: false,
        downPaymentValue: 0,
        downPaymentPercentage: 0,
        downPaymentSyncSource: 'percentage',
      };
    }

    return { ...state, hasDownPayment: true };
  }

  static calculateInstallmentValue(
    valueTotal: number,
    installmentQty: number,
    downPaymentValue: number,
    hasDownPayment: boolean,
  ): number {
    const quantity = installmentQty;
    const downPayment = hasDownPayment ? downPaymentValue : 0;
    const remaining = Math.max(0, valueTotal - downPayment);

    return quantity > 0 ? remaining / quantity : 0;
  }

  static syncFromDownPaymentValue(
    state: DocumentInstallmentFormState,
    downPaymentValue: number,
    valueTotal: number,
  ): DocumentInstallmentFormState {
    const percentage = InstallmentFormService.calculatePercentageFromValue(downPaymentValue, valueTotal);

    return {
      ...state,
      downPaymentValue,
      downPaymentPercentage: percentage,
      downPaymentSyncSource: 'value',
    };
  }

  static syncFromDownPaymentPercentage(
    state: DocumentInstallmentFormState,
    downPaymentPercentage: number,
    valueTotal: number,
  ): DocumentInstallmentFormState {
    const value = InstallmentFormService.calculateValueFromPercentage(downPaymentPercentage, valueTotal);

    return {
      ...state,
      downPaymentPercentage,
      downPaymentValue: value,
      downPaymentSyncSource: 'percentage',
    };
  }

  static recalculateOnTotalChange(
    state: DocumentInstallmentFormState,
    valueTotal: number,
  ): DocumentInstallmentFormState {
    if (!state.hasDownPayment) return state;

    if (state.downPaymentSyncSource === 'value') {
      return InstallmentFormService.syncFromDownPaymentValue(
        state,
        state.downPaymentValue,
        valueTotal,
      );
    }

    return InstallmentFormService.syncFromDownPaymentPercentage(
      state,
      state.downPaymentPercentage,
      valueTotal,
    );
  }

  private static calculateValueFromPercentage(percentage: number, valueTotal: number): number {
    return valueTotal * (percentage / 100);
  }

  private static calculatePercentageFromValue(value: number, valueTotal: number): number {
    if (valueTotal <= 0) return 0;

    return (value / valueTotal) * 100;
  }
}

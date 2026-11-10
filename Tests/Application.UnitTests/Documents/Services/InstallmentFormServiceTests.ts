import { PaymentMethod } from '../../../../Domain/Documents/ValueObjects/Payments/Enums/PaymentMethod';
import { InstallmentFormService } from '../../../../Application/Documents/Services/Payments/InstallmentFormService';
import { IPaymentSaveDto } from '../../../../Application/Documents/DataTransferObjects/Payments/IPaymentSaveDto';

describe('InstallmentFormService', () => {
  // Documento salvo no back-end: total 26.000,00, entrada 15.000,00 e percentual persistido em numeric(5,2).
  const VALUE_TOTAL = 26000;
  const savedPayment: IPaymentSaveDto = {
    method: null,
    discountValue: 0,
    installment: {
      quantity: 1,
      downPayment: { value: 15000, percentage: 57.69, method: PaymentMethod.PIX },
    },
  };

  it('RecalculateOnTotalChange_DocumentoSalvoComPercentualArredondado_PreservaOValorDaEntrada', () => {
    const state = InstallmentFormService.recalculateOnTotalChange(
      InstallmentFormService.fromPayment(savedPayment),
      VALUE_TOTAL,
    );

    expect(state.downPaymentValue).toBe(15000);
    expect(
      InstallmentFormService.calculateInstallmentValue(VALUE_TOTAL, state.installmentQty, state.downPaymentValue, state.hasDownPayment),
    ).toBe(11000);
  });

  it('SyncFromDownPaymentValue_ValorInformado_ArredondaOPercentualComoOBackEnd', () => {
    const state = InstallmentFormService.syncFromDownPaymentValue(
      InstallmentFormService.createInitialState(),
      15000,
      VALUE_TOTAL,
    );

    expect(state.downPaymentPercentage).toBe(57.69);
  });

  it('SyncFromDownPaymentPercentage_PercentualInformado_ArredondaOValorEmCentavos', () => {
    const state = InstallmentFormService.syncFromDownPaymentPercentage(
      InstallmentFormService.createInitialState(),
      33.333,
      100,
    );

    expect(state.downPaymentValue).toBe(33.33);
  });

  it('CalculateInstallmentValue_SaldoNaoDivisivel_ArredondaAParcelaEmCentavos', () => {
    expect(InstallmentFormService.calculateInstallmentValue(100, 3, 0, false)).toBe(33.33);
  });

  it('CalculateInstallmentValue_ComEntrada_DescontaAEntradaAntesDeDividir', () => {
    expect(InstallmentFormService.calculateInstallmentValue(1000, 3, 100, true)).toBe(300);
  });
});

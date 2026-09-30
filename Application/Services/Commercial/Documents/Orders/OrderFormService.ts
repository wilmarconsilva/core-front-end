import { IBudgetDetailDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetDetailDto';
import { IOrderDetailDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderDetailDto';
import { IOrderProductSaveDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderProductSaveDto';
import { IOrderSaveDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderSaveDto';
import { IOrderPaymentSaveDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderPaymentSaveDto';
import {
  CommercialDocumentFormService,
  CommercialDocumentFormState,
  IDocumentPaymentDto,
} from '../CommercialDocumentFormService';

export interface OrderFormState extends CommercialDocumentFormState<IOrderProductSaveDto> {
  budgetId: string;
}

export class OrderFormService {
  static readonly paymentMethodPolicy = CommercialDocumentFormService.requiredPaymentMethodPolicy;

  static createInitialForm(): OrderFormState {
    return {
      ...CommercialDocumentFormService.createInitialFormState<IOrderProductSaveDto>(
        OrderFormService.paymentMethodPolicy,
      ),
      budgetId: '',
    };
  }

  static detailToForm(detail: IOrderDetailDto): OrderFormState {
    return {
      ...CommercialDocumentFormService.detailToFormState<IOrderProductSaveDto>(detail),
      budgetId: detail.budgetId ? String(detail.budgetId) : '',
    };
  }

  /**
   * Estado inicial de um pedido novo copiado de um orçamento: o usuário confere e ajusta
   * antes de salvar. A assinatura não é herdada — ela é dada para o documento que o cliente
   * assinou — e as linhas são desvinculadas dos itens do orçamento.
   */
  static budgetToForm(budget: IBudgetDetailDto): OrderFormState {
    const form = CommercialDocumentFormService.detailToFormState<IOrderProductSaveDto>(budget);

    return {
      ...form,
      signature: null,
      productLines: CommercialDocumentFormService.detachProductLines(form.productLines),
      budgetId: String(budget.id),
    };
  }

  static buildSaveDto(id: number | undefined, form: OrderFormState): IOrderSaveDto {
    const fields = CommercialDocumentFormService.buildSaveDtoFields(id, form);

    return {
      ...fields,
      payment: OrderFormService.toOrderPayment(fields.payment),
      budgetId: form.budgetId ? parseInt(form.budgetId, 10) : undefined,
    };
  }

  static buildValidationRules(form: OrderFormState) {
    return CommercialDocumentFormService.buildValidationRules(form, OrderFormService.paymentMethodPolicy);
  }

  static formToDetail(id: number | undefined, form: OrderFormState): IOrderDetailDto {
    return {
      ...(CommercialDocumentFormService.formToDetailDto(id, form) as IOrderDetailDto),
      budgetId: form.budgetId ? parseInt(form.budgetId, 10) : undefined,
    };
  }

  /** O pedido exige método de pagamento: a validação do formulário garante que ele foi informado. */
  private static toOrderPayment(payment: IDocumentPaymentDto): IOrderPaymentSaveDto {
    if (payment.method === null) throw new Error('O método de pagamento do pedido é obrigatório.');

    return { ...payment, method: payment.method };
  }
}

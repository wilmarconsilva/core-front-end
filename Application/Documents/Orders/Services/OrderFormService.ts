import { IBudgetDetailDto } from '../../Budgets/DataTransferObjects/IBudgetDetailDto';
import { IOrderDetailDto } from '../DataTransferObjects/IOrderDetailDto';
import { IOrderProductSaveDto } from '../DataTransferObjects/IOrderProductSaveDto';
import { IOrderSaveDto } from '../DataTransferObjects/IOrderSaveDto';
import { DocumentFormService, DocumentFormState } from '../../Services/DocumentFormService';

export interface OrderFormState extends DocumentFormState<IOrderProductSaveDto> {
  budgetId: string;
}

export class OrderFormService {
  static createInitialForm(): OrderFormState {
    return {
      ...DocumentFormService.createInitialFormState<IOrderProductSaveDto>(),
      budgetId: '',
    };
  }

  static detailToForm(detail: IOrderDetailDto): OrderFormState {
    return {
      ...DocumentFormService.detailToFormState<IOrderProductSaveDto>(detail),
      budgetId: detail.budgetId ? String(detail.budgetId) : '',
    };
  }

  /**
   * Estado inicial de um pedido novo copiado de um orçamento: o usuário confere e ajusta
   * antes de salvar. A assinatura não é herdada — ela é dada para o documento que o cliente
   * assinou — e as linhas são desvinculadas dos itens do orçamento.
   */
  static budgetToForm(budget: IBudgetDetailDto): OrderFormState {
    const form = DocumentFormService.detailToFormState<IOrderProductSaveDto>(budget);

    return {
      ...form,
      signature: null,
      productLines: DocumentFormService.detachProductLines(form.productLines),
      budgetId: String(budget.id),
    };
  }

  static buildSaveDto(id: number | undefined, form: OrderFormState): IOrderSaveDto {
    return {
      ...DocumentFormService.buildSaveDtoFields(id, form),
      budgetId: form.budgetId ? parseInt(form.budgetId, 10) : undefined,
    };
  }

  static buildValidationRules(form: OrderFormState) {
    return DocumentFormService.buildValidationRules(form);
  }

  static formToDetail(id: number | undefined, form: OrderFormState, creationDateTime?: string): IOrderDetailDto {
    return {
      ...(DocumentFormService.formToDetailDto(id, form, creationDateTime) as IOrderDetailDto),
      budgetId: form.budgetId ? parseInt(form.budgetId, 10) : undefined,
    };
  }
}

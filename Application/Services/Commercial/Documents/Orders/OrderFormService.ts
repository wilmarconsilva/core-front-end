import { IOrderDetailDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderDetailDto';
import { IOrderProductSaveDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderProductSaveDto';
import { IOrderSaveDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Orders/IOrderSaveDto';
import {
  CommercialDocumentFormService,
  CommercialDocumentFormState,
} from '../CommercialDocumentFormService';

export interface OrderFormState extends CommercialDocumentFormState<IOrderProductSaveDto> {
  budgetId: string;
}

export class OrderFormService {
  static createInitialForm(): OrderFormState {
    return {
      ...CommercialDocumentFormService.createInitialFormState<IOrderProductSaveDto>(),
      budgetId: '',
    };
  }

  static detailToForm(detail: IOrderDetailDto): OrderFormState {
    return {
      ...CommercialDocumentFormService.detailToFormState<IOrderProductSaveDto>(detail),
      budgetId: detail.budgetId ? String(detail.budgetId) : '',
    };
  }

  static buildSaveDto(id: number | undefined, form: OrderFormState): IOrderSaveDto {
    return {
      ...CommercialDocumentFormService.buildSaveDtoFields(id, form),
      budgetId: form.budgetId ? parseInt(form.budgetId, 10) : undefined,
    };
  }

  static buildValidationRules(form: OrderFormState) {
    return CommercialDocumentFormService.buildValidationRules(form);
  }

  static formToDetail(id: number | undefined, form: OrderFormState): IOrderDetailDto {
    return {
      ...(CommercialDocumentFormService.formToDetailDto(id, form) as IOrderDetailDto),
      budgetId: form.budgetId ? parseInt(form.budgetId, 10) : undefined,
    };
  }
}

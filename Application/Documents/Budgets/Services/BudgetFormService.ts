import { IBudgetDetailDto } from '../DataTransferObjects/IBudgetDetailDto';
import { IBudgetProductSaveDto } from '../DataTransferObjects/IBudgetProductSaveDto';
import { IBudgetSaveDto } from '../DataTransferObjects/IBudgetSaveDto';
import {
  DocumentFormService,
  DocumentFormState,
} from '../../Services/DocumentFormService';

export type BudgetFormState = DocumentFormState<IBudgetProductSaveDto>;

export class BudgetFormService {
  static readonly paymentMethodPolicy = DocumentFormService.optionalPaymentMethodPolicy;

  static createInitialForm(): BudgetFormState {
    return DocumentFormService.createInitialFormState<IBudgetProductSaveDto>(
      BudgetFormService.paymentMethodPolicy,
    );
  }

  static detailToForm(detail: IBudgetDetailDto): BudgetFormState {
    return DocumentFormService.detailToFormState<IBudgetProductSaveDto>(detail);
  }

  static buildSaveDto(id: number | undefined, form: BudgetFormState): IBudgetSaveDto {
    return DocumentFormService.buildSaveDtoFields(id, form);
  }

  static buildValidationRules(form: BudgetFormState) {
    return DocumentFormService.buildValidationRules(form, BudgetFormService.paymentMethodPolicy);
  }

  static formToDetail(id: number | undefined, form: BudgetFormState): IBudgetDetailDto {
    return DocumentFormService.formToDetailDto(id, form) as IBudgetDetailDto;
  }
}

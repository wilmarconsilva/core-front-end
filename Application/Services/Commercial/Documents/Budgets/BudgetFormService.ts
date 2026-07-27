import { IBudgetDetailDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetDetailDto';
import { IBudgetProductSaveDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetProductSaveDto';
import { IBudgetSaveDto } from '../../../../Interfaces/DataTransferObjects/Commercial/Documents/Budgets/IBudgetSaveDto';
import {
  CommercialDocumentFormService,
  CommercialDocumentFormState,
} from '../CommercialDocumentFormService';

export type BudgetFormState = CommercialDocumentFormState<IBudgetProductSaveDto>;

export class BudgetFormService {
  static createInitialForm(): BudgetFormState {
    return CommercialDocumentFormService.createInitialFormState<IBudgetProductSaveDto>();
  }

  static detailToForm(detail: IBudgetDetailDto): BudgetFormState {
    return CommercialDocumentFormService.detailToFormState<IBudgetProductSaveDto>(detail);
  }

  static buildSaveDto(id: number | undefined, form: BudgetFormState): IBudgetSaveDto {
    return CommercialDocumentFormService.buildSaveDtoFields(id, form);
  }

  static buildValidationRules(form: BudgetFormState) {
    return CommercialDocumentFormService.buildValidationRules(form);
  }

  static formToDetail(id: number | undefined, form: BudgetFormState): IBudgetDetailDto {
    return CommercialDocumentFormService.formToDetailDto(id, form) as IBudgetDetailDto;
  }
}

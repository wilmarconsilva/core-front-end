import { IValidationRule } from '../../../Shared/Hooks/UseFormValidation';
import { ILocalityDetailDto } from '../DataTransferObjects/ILocalityDetailDto';
import { ILocalitySaveDto } from '../DataTransferObjects/ILocalitySaveDto';

export interface LocalityFormState {
  description: string;
  stateId: string;
}

export class LocalityFormService {
  static createInitialForm(): LocalityFormState {
    return {
      description: '',
      stateId: '',
    };
  }

  static detailToForm(detail: ILocalityDetailDto): LocalityFormState {
    const stateId = detail.state.id;

    return {
      description: detail.description ?? '',
      stateId: stateId !== undefined && stateId !== null ? String(stateId) : '',
    };
  }

  static buildSaveDto(id: number | undefined, form: LocalityFormState): ILocalitySaveDto {
    return {
      id: id ?? 0,
      description: form.description.trim(),
      stateId: form.stateId.trim() ? parseInt(form.stateId, 10) : undefined,
    };
  }

  static buildValidationRules(form: LocalityFormState): IValidationRule[] {
    return [
      { key: 'description', isValid: !!form.description.trim() },
    ];
  }
}

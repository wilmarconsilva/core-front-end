import { IValidationRule } from '../../Hooks/UseFormValidation';
import { MeasureUnit, MeasureUnitLabels } from '../../../Domain/ValueObjects/Enums/Products/MeasureUnit';
import { IProductDetailDto } from '../../Interfaces/DataTransferObjects/Products/IProductDetailDto';
import { IProductSaveDto } from '../../Interfaces/DataTransferObjects/Products/IProductSaveDto';

export interface ProductFormState {
  description: string;
  measureUnit: MeasureUnit;
}

export class ProductFormService {
  static readonly measureUnitOptions = Object.values(MeasureUnit)
    .filter((v) => typeof v === 'number')
    .map((v) => ({ label: MeasureUnitLabels[v as MeasureUnit], value: v as MeasureUnit }));

  static createInitialForm(): ProductFormState {
    return {
      description: '',
      measureUnit: MeasureUnit.Meters,
    };
  }

  static detailToForm(detail: IProductDetailDto): ProductFormState {
    return {
      description: detail.description ?? '',
      measureUnit: detail.measureUnit,
    };
  }

  static buildSaveDto(id: number | undefined, form: ProductFormState): IProductSaveDto {
    return {
      id: id ?? 0,
      description: form.description.trim(),
      measureUnit: form.measureUnit,
    };
  }

  static buildValidationRules(form: ProductFormState): IValidationRule[] {
    return [
      { key: 'description', isValid: !!form.description.trim() },
    ];
  }
}

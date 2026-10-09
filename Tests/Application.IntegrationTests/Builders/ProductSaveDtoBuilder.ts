import { IProductSaveDto } from '../../../Application/Products/DataTransferObjects/IProductSaveDto';
import { MeasureUnit } from '../../../Domain/Products/Enums/MeasureUnit';

export class ProductSaveDtoBuilder {
  static product(description = 'Cimento', id = 0): IProductSaveDto {
    return { id, description, measureUnit: MeasureUnit.Kilograms };
  }
}

import { MeasureUnit } from '../../../../Domain/ValueObjects/Enums/Products/MeasureUnit';

export interface IProductSaveDto {
  id: number;
  description: string;
  measureUnit: MeasureUnit;
}

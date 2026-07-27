import { MeasureUnit } from '../../../../Domain/ValueObjects/Enums/Products/MeasureUnit';

export interface IProductDetailDto {
  id: number;
  description: string;
  measureUnit: MeasureUnit;
}

import { MeasureUnit } from '../../../Domain/Products/Enums/MeasureUnit';

export interface IProductDetailDto {
  id: number;
  description: string;
  measureUnit: MeasureUnit;
}

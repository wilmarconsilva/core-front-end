import { MeasureUnit } from '../../../Domain/Products/Enums/MeasureUnit';

export interface IProductSaveDto {
  id: number;
  description: string;
  measureUnit: MeasureUnit;
}

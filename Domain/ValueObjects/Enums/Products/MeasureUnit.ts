export enum MeasureUnit {
  Meters = 1,
  MetersSquared = 2,
  MetersCubed = 3,
  Kilograms = 4,
}

export const MeasureUnitLabels: Record<MeasureUnit, string> = {
  [MeasureUnit.Meters]: 'Metros (m)',
  [MeasureUnit.MetersSquared]: 'Metros Quadrados (m²)',
  [MeasureUnit.MetersCubed]: 'Metros Cúbicos (m³)',
  [MeasureUnit.Kilograms]: 'Quilogramas (kg)',
};

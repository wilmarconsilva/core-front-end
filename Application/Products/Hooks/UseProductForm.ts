import { useEffect, useState } from 'react';
import { UseFormValidation } from './UseFormValidation';
import { UseProducts } from './UseProducts';
import { ProductFormService } from '../Services/Products/ProductFormService';
import { MeasureUnit } from '../../Domain/ValueObjects/Enums/Products/MeasureUnit';

export function UseProductForm(id: number | undefined, onGoBack: () => void) {
  const { currentItem, isLoadingItem, isSaving, loadById, save, clearCurrentItem } = UseProducts();
  const { errors, validate, bindChange } = UseFormValidation();
  const isEditing = !!id;

  const initialForm = ProductFormService.createInitialForm();
  const [description, setDescription] = useState(initialForm.description);
  const [measureUnit, setMeasureUnit] = useState<MeasureUnit>(initialForm.measureUnit);

  useEffect(() => {
    if (isEditing) loadById(id);

    return () => clearCurrentItem();
  }, [id]);

  useEffect(() => {
    if (!currentItem) return;

    const form = ProductFormService.detailToForm(currentItem);
    setDescription(form.description);
    setMeasureUnit(form.measureUnit);
  }, [currentItem]);

  const handleSave = async () => {
    const form = { description, measureUnit };
    const isValid = validate(ProductFormService.buildValidationRules(form));

    if (!isValid) return;

    const success = await save(id ?? null, ProductFormService.buildSaveDto(id, form));
    if (success) onGoBack();
  };

  return {
    isEditing,
    isLoadingItem,
    isSaving,
    errors,
    description,
    setDescription: bindChange('description', setDescription),
    measureUnit,
    setMeasureUnit,
    measureUnitOptions: ProductFormService.measureUnitOptions,
    handleSave,
  };
}

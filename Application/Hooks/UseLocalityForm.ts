import { useEffect, useState } from 'react';
import { UseFormValidation } from './UseFormValidation';
import { UseLocalities } from './UseLocalities';
import { LocalityFormService } from '../Services/Localities/LocalityFormService';

export function UseLocalityForm(id: number | undefined, onGoBack: () => void) {
  const { currentItem, isLoadingItem, isSaving, loadById, save, clearCurrentItem } = UseLocalities();
  const { errors, validate, bindChange } = UseFormValidation();
  const isEditing = !!id;

  const initialForm = LocalityFormService.createInitialForm();
  const [description, setDescription] = useState(initialForm.description);
  const [stateId, setStateId] = useState(initialForm.stateId);

  useEffect(() => {
    if (isEditing) loadById(id);

    return () => clearCurrentItem();
  }, [id]);

  useEffect(() => {
    if (!currentItem) return;

    const form = LocalityFormService.detailToForm(currentItem);
    setDescription(form.description);
    setStateId(form.stateId);
  }, [currentItem]);

  const handleSave = async () => {
    const form = { description, stateId };
    const isValid = validate(LocalityFormService.buildValidationRules(form));

    if (!isValid) return;

    const success = await save(id ?? null, LocalityFormService.buildSaveDto(id, form));
    if (success) onGoBack();
  };

  return {
    isEditing,
    isLoadingItem,
    isSaving,
    currentItem,
    errors,
    description,
    setDescription: bindChange('description', setDescription),
    stateId,
    setStateId,
    handleSave,
  };
}

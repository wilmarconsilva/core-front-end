import React from 'react';
import { FormField } from '../../Components/FormField';
import { SelectField } from '../../Components/SelectField';
import { UseProductForm } from '../../../Application/Hooks/UseProductForm';
import { IEntityFormScreenProps } from '../../Interfaces/Screens/IEntityFormScreenProps';
import { CrudFormScreen } from '../CrudFormScreen';

export function ProductFormScreen({ id, onGoBack }: IEntityFormScreenProps) {
  const {
    isEditing,
    isLoadingItem,
    isSaving,
    errors,
    description,
    setDescription,
    measureUnit,
    setMeasureUnit,
    measureUnitOptions,
    handleSave,
  } = UseProductForm(id, onGoBack);

  return (
    <CrudFormScreen
      title={isEditing ? 'Editar Produto' : 'Novo Produto'}
      breadcrumbEntityLabel="Produtos"
      breadcrumbCurrentLabel={isEditing ? 'Editar' : 'Novo Produto'}
      isEditing={isEditing}
      isLoadingItem={isLoadingItem}
      isSaving={isSaving}
      onGoBack={onGoBack}
      onSave={handleSave}
    >
      <FormField
        label="Descrição *"
        placeholder="Nome do produto"
        value={description}
        onChangeText={setDescription}
        editable={!isSaving}
        error={errors.description}
      />
      <SelectField
        label="Unidade de Medida *"
        value={measureUnit}
        options={measureUnitOptions}
        onValueChange={setMeasureUnit}
        disabled={isSaving}
      />
    </CrudFormScreen>
  );
}

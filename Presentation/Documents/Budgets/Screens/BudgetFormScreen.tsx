import React from 'react';
import { View } from 'react-native';
import { UseBudgetForm } from '../../../../Application/Documents/Budgets/Hooks/UseBudgetForm';
import { UseDocumentPdf } from '../../../../Application/Documents/Hooks/UseDocumentPdf';
import { IEntityFormScreenProps } from '../../../Shared/Interfaces/Screens/IEntityFormScreenProps';
import { DocumentFormScreen } from '../../Screens/DocumentFormScreen';

export function BudgetFormScreen({ id, onGoBack }: IEntityFormScreenProps) {
  const form = UseBudgetForm(id, onGoBack);
  const { generatePdf } = UseDocumentPdf('Orçamento');

  const handleGeneratePdf = () => generatePdf(form.buildDetailFromForm());

  return (
    <View style={{ flex: 1 }}>
      <DocumentFormScreen
        {...form}
        title={form.isEditing ? 'Editar Orçamento' : 'Novo Orçamento'}
        breadcrumbEntityLabel="Orçamentos"
        breadcrumbCurrentLabel={form.isEditing ? 'Editar' : 'Novo Orçamento'}
        observationsPlaceholder="Observações do orçamento..."
        onGoBack={onGoBack}
        onGeneratePdf={handleGeneratePdf}
      />
    </View>
  );
}

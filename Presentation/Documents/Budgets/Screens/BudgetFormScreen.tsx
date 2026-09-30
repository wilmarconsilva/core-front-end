import React from 'react';
import { View } from 'react-native';
import { UseBudgetForm } from '../../../../Application/Documents/Budgets/Hooks/UseBudgetForm';
import { UseDocumentPrint } from '../../../../Application/Documents/Hooks/UseDocumentPrint';
import { BudgetService } from '../../../../Application/Documents/Budgets/Services/BudgetService';
import { IEntityFormScreenProps } from '../../../Shared/Interfaces/Screens/IEntityFormScreenProps';
import { DocumentFormScreen } from '../../Screens/DocumentFormScreen';

const budgetService = new BudgetService();

export function BudgetFormScreen({ id, onGoBack }: IEntityFormScreenProps) {
  const form = UseBudgetForm(id, onGoBack);
  const { printHtml } = UseDocumentPrint();

  const handleGeneratePdf = () => budgetService.generatePdf(form.buildDetailFromForm(), printHtml);

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

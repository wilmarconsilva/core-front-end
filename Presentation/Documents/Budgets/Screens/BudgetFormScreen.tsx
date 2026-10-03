import React from 'react';
import { View } from 'react-native';
import { UseBudgetForm } from '../../../../Application/Documents/Budgets/Hooks/UseBudgetForm';
import { UseDocumentPdf } from '../../../../Application/Documents/Hooks/UseDocumentPdf';
import { BudgetTemplateService } from '../../../../Application/Documents/Budgets/Services/BudgetTemplateService';
import { IEntityFormScreenProps } from '../../../Shared/Interfaces/Screens/IEntityFormScreenProps';
import { DocumentFormScreen } from '../../Screens/DocumentFormScreen';

const budgetTemplateService = new BudgetTemplateService();

export function BudgetFormScreen({ id, onGoBack }: IEntityFormScreenProps) {
  const form = UseBudgetForm(id, onGoBack);
  const { generatePdf } = UseDocumentPdf(budgetTemplateService);

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

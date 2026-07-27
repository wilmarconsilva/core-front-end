import React from 'react';
import { View } from 'react-native';
import { UseBudgetForm } from '../../../../../Application/Hooks/UseBudgetForm';
import { UseDocumentPrint } from '../../../../../Application/Hooks/UseDocumentPrint';
import { BudgetService } from '../../../../../Application/Services/Commercial/Documents/Budgets/BudgetService';
import { IEntityFormScreenProps } from '../../../../Interfaces/Screens/IEntityFormScreenProps';
import { CommercialDocumentFormScreen } from '../CommercialDocumentFormScreen';

const budgetService = new BudgetService();

export function BudgetFormScreen({ id, onGoBack }: IEntityFormScreenProps) {
  const form = UseBudgetForm(id, onGoBack);
  const { printHtml } = UseDocumentPrint();

  const handleGeneratePdf = () => budgetService.generatePdf(form.buildDetailFromForm(), printHtml);

  return (
    <View style={{ flex: 1 }}>
      <CommercialDocumentFormScreen
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

import React from 'react';
import { BudgetReportService } from '../../../../../Application/Services/Commercial/Documents/Budgets/BudgetReportService';
import { IBackOnlyScreenProps } from '../../../../Interfaces/Screens/IBackOnlyScreenProps';
import { DocumentReportScreen } from '../DocumentReportScreen';

const budgetReportService = new BudgetReportService();

export function BudgetReportScreen({ onGoBack }: IBackOnlyScreenProps) {
  return (
    <DocumentReportScreen
      title="Relatório de Orçamentos"
      breadcrumbLabel="Orçamentos"
      service={budgetReportService}
      onGoBack={onGoBack}
    />
  );
}

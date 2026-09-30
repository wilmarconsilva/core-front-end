import React from 'react';
import { BudgetReportService } from '../../../../Application/Documents/Budgets/Services/BudgetReportService';
import { IBackOnlyScreenProps } from '../../../Shared/Interfaces/Screens/IBackOnlyScreenProps';
import { DocumentReportScreen } from '../../Screens/DocumentReportScreen';

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

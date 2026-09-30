import React from 'react';
import { OrderReportService } from '../../../../Application/Documents/Orders/Services/OrderReportService';
import { IBackOnlyScreenProps } from '../../../Shared/Interfaces/Screens/IBackOnlyScreenProps';
import { DocumentReportScreen } from '../../Screens/DocumentReportScreen';

const orderReportService = new OrderReportService();

export function OrderReportScreen({ onGoBack }: IBackOnlyScreenProps) {
  return (
    <DocumentReportScreen
      title="Relatório de Pedidos"
      breadcrumbLabel="Pedidos"
      service={orderReportService}
      onGoBack={onGoBack}
    />
  );
}

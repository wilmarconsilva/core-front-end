import React from 'react';
import { OrderReportService } from '../../../../../Application/Services/Commercial/Documents/Orders/OrderReportService';
import { IBackOnlyScreenProps } from '../../../../Interfaces/Screens/IBackOnlyScreenProps';
import { DocumentReportScreen } from '../DocumentReportScreen';

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

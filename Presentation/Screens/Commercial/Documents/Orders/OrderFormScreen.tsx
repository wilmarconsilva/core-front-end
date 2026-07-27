import React from 'react';
import { View } from 'react-native';
import { UseOrderForm } from '../../../../../Application/Hooks/UseOrderForm';
import { UseDocumentPrint } from '../../../../../Application/Hooks/UseDocumentPrint';
import { OrderService } from '../../../../../Application/Services/Commercial/Documents/Orders/OrderService';
import { IEntityFormScreenProps } from '../../../../Interfaces/Screens/IEntityFormScreenProps';
import { CommercialDocumentFormScreen } from '../CommercialDocumentFormScreen';

const orderService = new OrderService();

export function OrderFormScreen({ id, onGoBack }: IEntityFormScreenProps) {
  const form = UseOrderForm(id, onGoBack);
  const { printHtml } = UseDocumentPrint();

  const handleGeneratePdf = () => orderService.generatePdf(form.buildDetailFromForm(), printHtml);

  return (
    <View style={{ flex: 1 }}>
      <CommercialDocumentFormScreen
        {...form}
        title={form.isEditing ? 'Editar Pedido' : 'Novo Pedido'}
        breadcrumbEntityLabel="Pedidos"
        breadcrumbCurrentLabel={form.isEditing ? 'Editar' : 'Novo Pedido'}
        observationsPlaceholder="Observações do pedido..."
        onGoBack={onGoBack}
        onGeneratePdf={handleGeneratePdf}
      />
    </View>
  );
}

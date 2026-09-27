import React from 'react';
import { View } from 'react-native';
import { UseOrderForm } from '../../../../../Application/Hooks/UseOrderForm';
import { UseDocumentPrint } from '../../../../../Application/Hooks/UseDocumentPrint';
import { OrderService } from '../../../../../Application/Services/Commercial/Documents/Orders/OrderService';
import { IOrderFormScreenProps } from '../../../../Interfaces/Screens/IOrderFormScreenProps';
import { IntField } from '../../../../Components/IntField';
import { CommercialDocumentFormScreen } from '../CommercialDocumentFormScreen';

const orderService = new OrderService();

export function OrderFormScreen({ id, budgetId, onGoBack }: IOrderFormScreenProps) {
  const form = UseOrderForm(id, budgetId, onGoBack);
  const { printHtml } = UseDocumentPrint();

  const handleGeneratePdf = () => orderService.generatePdf(form.buildDetailFromForm(), printHtml);

  const newOrderLabel = 'Novo Pedido';

  const renderOriginField = () =>
    form.budgetId ? (
      <IntField label="Orçamento de origem" value={form.budgetId} editable={false} />
    ) : null;

  return (
    <View style={{ flex: 1 }}>
      <CommercialDocumentFormScreen
        {...form}
        title={form.isEditing ? 'Editar Pedido' : newOrderLabel}
        breadcrumbEntityLabel="Pedidos"
        breadcrumbCurrentLabel={form.isEditing ? 'Editar' : newOrderLabel}
        observationsPlaceholder="Observações do pedido..."
        renderGeneralExtraFields={renderOriginField}
        onGoBack={onGoBack}
        onGeneratePdf={handleGeneratePdf}
      />
    </View>
  );
}

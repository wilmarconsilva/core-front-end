import { getPaymentMethodLabel } from '../../../../Domain/ValueObjects/Enums/Commercial/Documents/Payments/PaymentMethod';
import { IDocumentTemplate } from '../../../Interfaces/DataTransferObjects/Commercial/Documents/IDocumentTemplate';
import { ICommercialDocumentDetailDto } from './CommercialDocumentFormService';

const currencyFormat = (value: number) =>
  value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

export class DocumentTemplateMapper {
  static fromDetail(
    detail: ICommercialDocumentDetailDto & { id: number },
    documentTitle: string,
  ): IDocumentTemplate {
    const valueSubtotal = detail.products.reduce((sum, product) => sum + product.valueTotal, 0);
    const valueTotal = Math.max(0, valueSubtotal - detail.payment.discountValue);

    return {
      documentTitle,
      id: detail.id,
      customerName: detail.customer.description,
      creationDateTime: new Date().toLocaleDateString('pt-BR'),
      observations: detail.observations,
      valueSubtotal: currencyFormat(valueSubtotal),
      valueTotal: currencyFormat(valueTotal),
      paymentMethod: getPaymentMethodLabel(detail.payment.method),
      customerSignatureImage: detail.customerSignatureImage,
    };
  }
}

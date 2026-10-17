import { IDocumentTemplate } from '../../../Application/Documents/DataTransferObjects/IDocumentTemplate';
import { formatCurrency } from '../../../Application/Shared/Utilities/FormatUtilities';
import { DOCUMENT_SELLER_COMPANY_LOGO } from '../../../Application/Documents/Templates/DocumentSellerCompanyLogo';

interface IProductLine {
  description: string;
  quantity: number;
  valueUnit: number;
}

/**
 * Modelo de impressão com valores formatados pelas mesmas funções da aplicação: o `formatCurrency`
 * (Intl pt-BR) separa o "R$" do número com espaço inseparável (U+00A0), que a fonte precisa medir.
 */
export class DocumentTemplateBuilder {
  private products: IProductLine[] = [{ description: 'Geomembrana PEAD 0,80 mm', quantity: 200, valueUnit: 25.5 }];
  private discountValue = 0;
  private signatureImage?: string;

  withProducts(count: number): this {
    this.products = Array.from({ length: count }, (_, index) => ({
      description: `Geomembrana PEAD 1,00 mm – rolo ${index + 1} de 50 × 8 m, com descrição longa que quebra a linha`,
      quantity: 1.5,
      valueUnit: 1234.56,
    }));
    return this;
  }

  withoutProducts(): this {
    this.products = [];
    return this;
  }

  withDiscount(value: number): this {
    this.discountValue = value;
    return this;
  }

  signed(): this {
    this.signatureImage = DOCUMENT_SELLER_COMPANY_LOGO;
    return this;
  }

  build(): IDocumentTemplate {
    const valueSubtotal = this.products.reduce((sum, product) => sum + product.quantity * product.valueUnit, 0);
    const valueTotal = Math.max(0, valueSubtotal - this.discountValue);

    return {
      title: 'Pedido',
      issueDate: '16 de outubro de 2026',
      customer: {
        name: 'José Conceição D’Ávila',
        city: 'São Joaquim - SC',
        documentLabel: 'CPF',
        document: '100.500.339-48',
      },
      products: this.products.map((product) => ({
        description: product.description,
        quantity: product.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 3 }),
        valueUnit: formatCurrency(product.valueUnit),
        valueTotal: formatCurrency(product.quantity * product.valueUnit),
      })),
      valueSubtotal: formatCurrency(valueSubtotal),
      discountValue: this.discountValue ? formatCurrency(this.discountValue) : undefined,
      valueTotal: formatCurrency(valueTotal),
      payment: {
        method: 'Boleto',
        installments: `3x de ${formatCurrency(valueTotal / 3)}`,
        downPayment: `${formatCurrency(valueTotal / 10)} (10%)`,
        downPaymentMethod: 'PIX',
      },
      observations: 'Entrega em 15 dias úteis.\nFrete — “CIF” até 50 km; após, 1º/2º trecho à parte.',
      sellerSignature: { name: 'Vendedor', image: this.signatureImage },
      customerSignature: { name: 'José Conceição D’Ávila', image: this.signatureImage },
    };
  }
}

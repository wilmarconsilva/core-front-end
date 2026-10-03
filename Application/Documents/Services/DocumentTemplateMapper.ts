import { getPaymentMethodLabel } from '../../../Domain/Documents/ValueObjects/Payments/Enums/PaymentMethod';
import { PersonType } from '../../../Domain/Persons/Enums/PersonType';
import { ICustomerAddressDetailDto } from '../../Persons/Customers/DataTransferObjects/ICustomerAddressDetailDto';
import { ICustomerDetailDto } from '../../Persons/Customers/DataTransferObjects/ICustomerDetailDto';
import { CustomerFormService } from '../../Persons/Customers/Services/CustomerFormService';
import { ICurrentUserDto } from '../../Persons/Users/DataTransferObjects/ICurrentUserDto';
import { ILocalityDetailDto } from '../../Territories/Localities/DataTransferObjects/ILocalityDetailDto';
import { formatCurrency } from '../../Shared/Utilities/FormatUtilities';
import {
  IDocumentTemplate,
  IDocumentTemplateCustomer,
  IDocumentTemplatePayment,
} from '../DataTransferObjects/IDocumentTemplate';
import { IDocumentPaymentDto } from './DocumentFormService';
import { DocumentPdfDetail } from './Interfaces/IDocumentPdfService';

/** Dados complementares ao documento, obtidos de outros módulos; todos opcionais (offline podem faltar). */
export interface IDocumentTemplateSources {
  customer?: ICustomerDetailDto;
  customerLocality?: ILocalityDetailDto;
  seller?: ICurrentUserDto;
  issueDateTime?: Date;
}

const IMAGE_MIME_TYPES_BY_BASE64_PREFIX: Record<string, string> = {
  iVBOR: 'image/png',
  '/9j/': 'image/jpeg',
  R0lGOD: 'image/gif',
  UklGR: 'image/webp',
};

export class DocumentTemplateMapper {
  static fromDetail(detail: DocumentPdfDetail, sources: IDocumentTemplateSources = {}): IDocumentTemplate {
    const valueSubtotal = detail.products.reduce((sum, product) => sum + product.valueTotal, 0);
    const valueTotal = Math.max(0, valueSubtotal - detail.payment.discountValue);

    return {
      number: DocumentTemplateMapper.positiveOrUndefined(detail.id),
      budgetNumber: DocumentTemplateMapper.positiveOrUndefined(detail.budgetId),
      issueDate: (sources.issueDateTime ?? new Date())
        .toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' }),
      customer: DocumentTemplateMapper.toCustomer(detail, sources),
      products: detail.products.map((product) => ({
        description: product.product.description ?? '',
        quantity: product.quantity.toLocaleString('pt-BR', { maximumFractionDigits: 3 }),
        valueUnit: formatCurrency(product.valueUnit),
        valueTotal: formatCurrency(product.valueTotal),
      })),
      valueSubtotal: formatCurrency(valueSubtotal),
      discountValue: detail.payment.discountValue > 0 ? formatCurrency(detail.payment.discountValue) : undefined,
      valueTotal: formatCurrency(valueTotal),
      payment: DocumentTemplateMapper.toPayment(detail.payment, valueTotal),
      observations: detail.observations?.trim() || undefined,
      sellerSignature: {
        name: sources.seller?.name,
        image: DocumentTemplateMapper.toImageDataUri(sources.seller?.signatureImage),
      },
      customerSignature: {
        name: detail.customer.description,
        image: DocumentTemplateMapper.toImageDataUri(detail.customerSignatureImage),
      },
    };
  }

  private static toCustomer(detail: DocumentPdfDetail, sources: IDocumentTemplateSources): IDocumentTemplateCustomer {
    const { customer, customerLocality } = sources;
    const address = customer?.addresses[0];

    return {
      name: customer?.name || detail.customer.description,
      city: DocumentTemplateMapper.toCity(address, customerLocality),
      documentLabel: customer?.document ? DocumentTemplateMapper.toDocumentLabel(customer.personType) : undefined,
      document: customer?.document
        ? CustomerFormService.formatDocumentForPersonType(customer.personType, customer.document)
        : undefined,
      stateRegistration: customer?.stateRegistration || undefined,
      address: DocumentTemplateMapper.toAddress(address),
      email: customer?.email || undefined,
    };
  }

  private static toDocumentLabel(personType: PersonType): string {
    return personType === PersonType.Natural ? 'CPF' : 'CNPJ';
  }

  private static toCity(address?: ICustomerAddressDetailDto, locality?: ILocalityDetailDto): string | undefined {
    const city = locality?.description || address?.locality.description;
    if (!city) return undefined;

    const state = locality?.state?.description;
    return state ? `${city} - ${state}` : city;
  }

  private static toAddress(address?: ICustomerAddressDetailDto): string | undefined {
    if (!address) return undefined;

    const street = address.number ? `${address.street}, ${address.number}` : address.street;

    return [street, address.complement, address.neighborhood, address.postalCode && `CEP ${address.postalCode}`]
      .filter(Boolean)
      .join(' | ');
  }

  private static toPayment(payment: IDocumentPaymentDto, valueTotal: number): IDocumentTemplatePayment {
    const installment = payment.installment;
    const downPayment = installment?.downPayment;

    if (!installment || installment.quantity <= 0) {
      return { method: getPaymentMethodLabel(payment.method) };
    }

    // Same rule as the back-end Installment: the down payment is deducted before splitting.
    const installmentValue = (valueTotal - (downPayment?.value ?? 0)) / installment.quantity;

    return {
      method: getPaymentMethodLabel(payment.method),
      installments: `${installment.quantity}x de ${formatCurrency(installmentValue)}`,
      downPayment: downPayment
        ? `${formatCurrency(downPayment.value)} (${downPayment.percentage.toLocaleString('pt-BR', { maximumFractionDigits: 2 })}%) em ${getPaymentMethodLabel(downPayment.method)}`
        : undefined,
    };
  }

  /** Aceita base64 puro (como vem da API) ou um data URI completo (como vem do SignaturePad). */
  private static toImageDataUri(image?: string): string | undefined {
    if (!image) return undefined;

    const base64 = image.replace(/^data:[^,]*,/, '').replace(/[^A-Za-z0-9+/=]/g, '');
    if (!base64) return undefined;

    const prefix = Object.keys(IMAGE_MIME_TYPES_BY_BASE64_PREFIX).find((key) => base64.startsWith(key));
    const mimeType = prefix ? IMAGE_MIME_TYPES_BY_BASE64_PREFIX[prefix] : 'image/png';

    return `data:${mimeType};base64,${base64}`;
  }

  private static positiveOrUndefined(value?: number): number | undefined {
    return value && value > 0 ? value : undefined;
  }
}

import { IValidationRule } from '../../Shared/Hooks/UseFormValidation';
import {
  PaymentMethod,
  PaymentMethodLabels,
  PaymentMethodNotDefinedLabel,
} from '../../../Domain/Documents/ValueObjects/Payments/Enums/PaymentMethod';
import { IDocumentDetailDto } from '../DataTransferObjects/IDocumentDetailDto';
import { IDocumentProductDetailDto } from '../DataTransferObjects/IDocumentProductDetailDto';
import { IDocumentProductSaveDto } from '../DataTransferObjects/IDocumentProductSaveDto';
import { IDocumentSaveDto } from '../DataTransferObjects/IDocumentSaveDto';
import { IPaymentSaveDto } from '../DataTransferObjects/Payments/IPaymentSaveDto';
import { IEntityReferenceDto } from '../../Shared/DataTransferObjects/Entities/IEntityReferenceDto';
import { toApiDateTime } from '../../Shared/Utilities/DateTimeUtilities';
import { DocumentInstallmentFormState, InstallmentFormService } from './Payments/InstallmentFormService';

/** Linha de produto no formulário: o DTO de salvamento mais a descrição, usada só para exibição. */
export type DocumentProductFormLine<TProduct extends IDocumentProductSaveDto> = TProduct & {
  productDescription: string;
};

export interface DocumentFormState<TProduct extends IDocumentProductSaveDto> {
  customerId: number;
  customerDisplayLabel: string;
  observations: string;
  signature: string | null;
  paymentMethod: PaymentMethod | null;
  discountValue: number;
  installment: DocumentInstallmentFormState;
  productLines: DocumentProductFormLine<TProduct>[];
}

export interface DocumentFormBaseSetters<TProduct extends IDocumentProductSaveDto> {
  setCustomerId: (value: number) => void;
  setCustomerDisplayLabel: (value: string) => void;
  setObservations: (value: string) => void;
  setSignature: (value: string | null) => void;
  setPaymentMethod: (value: PaymentMethod | null) => void;
  setDiscountValue: (value: number) => void;
  setInstallment: (value: DocumentInstallmentFormState) => void;
  setProductLines: (value: DocumentProductFormLine<TProduct>[]) => void;
}

export class DocumentFormService {
  /** A entrada do parcelamento sempre exige método de pagamento. */
  static readonly downPaymentMethodOptions = Object.values(PaymentMethod)
    .filter((v) => typeof v === 'number')
    .map((v) => ({ label: PaymentMethodLabels[v as PaymentMethod], value: v as PaymentMethod }));

  static readonly paymentMethodOptions: { label: string; value: PaymentMethod | null }[] = [
    { label: PaymentMethodNotDefinedLabel, value: null },
    ...DocumentFormService.downPaymentMethodOptions,
  ];

  static entitySelectLabel(entity: IEntityReferenceDto): string {
    return entity.description;
  }

  static createInitialFormState<TProduct extends IDocumentProductSaveDto>(): DocumentFormState<TProduct> {
    return {
      customerId: 0,
      customerDisplayLabel: '',
      observations: '',
      signature: null,
      paymentMethod: null,
      discountValue: 0,
      installment: InstallmentFormService.createInitialState(),
      productLines: [DocumentFormService.createEmptyProductLine<TProduct>()],
    };
  }

  static detailToFormState<TProduct extends IDocumentProductSaveDto>(
    detail: IDocumentDetailDto,
  ): DocumentFormState<TProduct> {
    return {
      customerId: detail.customer.id,
      customerDisplayLabel: DocumentFormService.entitySelectLabel(detail.customer),
      observations: detail.observations ?? '',
      signature: detail.customerSignatureImage ?? null,
      paymentMethod: detail.payment.method,
      discountValue: detail.payment.discountValue,
      installment: InstallmentFormService.fromPayment(detail.payment),
      productLines: DocumentFormService.detailProductsToForm<TProduct>(detail.products),
    };
  }

  static applyBaseFormState<TProduct extends IDocumentProductSaveDto>(
    form: DocumentFormState<TProduct>,
    setters: DocumentFormBaseSetters<TProduct>,
  ): void {
    setters.setCustomerId(form.customerId);
    setters.setCustomerDisplayLabel(form.customerDisplayLabel);
    setters.setObservations(form.observations);
    setters.setSignature(form.signature);
    setters.setPaymentMethod(form.paymentMethod);
    setters.setDiscountValue(form.discountValue);
    setters.setInstallment(form.installment);
    setters.setProductLines(form.productLines);
  }

  static buildSaveDtoFields<TProduct extends IDocumentProductSaveDto>(
    id: number | undefined,
    form: DocumentFormState<TProduct>,
  ): Pick<
    IDocumentSaveDto<TProduct>,
    'id' | 'creationDateTime' | 'customerId' | 'payment' | 'observations' | 'customerSignatureImage' | 'products'
  > {
    return {
      id: id ?? 0,
      creationDateTime: new Date(),
      customerId: form.customerId,
      payment: DocumentFormService.buildPayment(
        form.paymentMethod,
        form.discountValue,
        form.installment,
      ),
      observations: form.observations.trim() || undefined,
      customerSignatureImage: form.signature ?? undefined,
      products: DocumentFormService.saveProductLines(form.productLines),
    };
  }

  static buildValidationRules(form: DocumentFormState<IDocumentProductSaveDto>): IValidationRule[] {
    return [
      { key: 'customerId', isValid: !!form.customerId },
      { key: 'productLines', isValid: form.productLines.length > 0 },
      ...InstallmentFormService.buildValidationRules(form.installment),
    ];
  }

  static createEmptyProductLine<TProduct extends IDocumentProductSaveDto>(): DocumentProductFormLine<TProduct> {
    return {
      id: 0,
      productId: 0,
      productDescription: '',
      quantity: 0,
      valueUnit: 0,
    } as DocumentProductFormLine<TProduct>;
  }

  static detailProductsToForm<TProduct extends IDocumentProductSaveDto>(
    products: IDocumentProductDetailDto[] | undefined,
  ): DocumentProductFormLine<TProduct>[] {
    return products?.length
      ? products.map((product) => ({
        id: product.id,
        productId: product.product.id,
        productDescription: product.product.description,
        quantity: product.quantity,
        valueUnit: product.valueUnit,
      } as DocumentProductFormLine<TProduct>))
      : [DocumentFormService.createEmptyProductLine<TProduct>()];
  }

  /** Desvincula as linhas de um documento de origem: os ids pertencem ao documento copiado. */
  static detachProductLines<TProduct extends IDocumentProductSaveDto>(
    productLines: DocumentProductFormLine<TProduct>[],
  ): DocumentProductFormLine<TProduct>[] {
    return productLines.map((productLine) => ({ ...productLine, id: 0 }));
  }

  static updateProductLine<TProduct extends IDocumentProductSaveDto>(
    productLines: DocumentProductFormLine<TProduct>[],
    index: number,
    field: keyof TProduct,
    value: number,
  ): DocumentProductFormLine<TProduct>[] {
    return productLines.map((productLine, currentIndex) =>
      currentIndex === index ? { ...productLine, [field]: value } : productLine,
    );
  }

  static selectProductLine<TProduct extends IDocumentProductSaveDto>(
    productLines: DocumentProductFormLine<TProduct>[],
    index: number,
    product: IEntityReferenceDto,
  ): DocumentProductFormLine<TProduct>[] {
    return productLines.map((productLine, currentIndex) =>
      currentIndex === index
        ? { ...productLine, productId: product.id, productDescription: product.description }
        : productLine,
    );
  }

  static buildPayment(
    paymentMethod: PaymentMethod | null,
    discountValue: number,
    installment: DocumentInstallmentFormState,
  ): IPaymentSaveDto {
    return {
      method: paymentMethod,
      discountValue,
      installment: InstallmentFormService.toInstallmentSaveDto(installment),
    };
  }

  /** Mesma regra do back-end (DocumentProduct): o total da linha é quantidade × valor unitário. */
  static calculateProductTotal(productLine: Pick<IDocumentProductSaveDto, 'quantity' | 'valueUnit'>): number {
    return productLine.quantity * productLine.valueUnit;
  }

  /** Mesma regra do back-end (Document): o subtotal é a soma dos totais dos produtos. */
  static calculateSubtotal(productLines: Pick<IDocumentProductSaveDto, 'quantity' | 'valueUnit'>[]): number {
    return productLines.reduce(
      (sum, productLine) => sum + DocumentFormService.calculateProductTotal(productLine),
      0,
    );
  }

  static calculateTotal(productLines: Pick<IDocumentProductSaveDto, 'quantity' | 'valueUnit'>[], discountValue: number): number {
    return Math.max(0, DocumentFormService.calculateSubtotal(productLines) - discountValue);
  }

  /** Linhas com produto escolhido; as vazias são descartadas. */
  static selectedProductLines<TProduct extends IDocumentProductSaveDto>(
    productLines: DocumentProductFormLine<TProduct>[],
  ): DocumentProductFormLine<TProduct>[] {
    return productLines.filter((productLine) => productLine.productId > 0);
  }

  static saveProductLines<TProduct extends IDocumentProductSaveDto>(
    productLines: DocumentProductFormLine<TProduct>[],
  ): TProduct[] {
    return DocumentFormService.selectedProductLines(productLines).map((productLine) => {
      const { productDescription: _productDescription, ...saveProductLine } = productLine;

      return saveProductLine as unknown as TProduct;
    });
  }

  /** `creationDateTime` ausente = documento ainda não salvo, criado agora. */
  static formToDetailDto(
    id: number | undefined,
    form: DocumentFormState<IDocumentProductSaveDto>,
    creationDateTime?: string,
  ): IDocumentDetailDto & { id: number; userId: number } {
    return {
      id: id ?? 0,
      userId: 0,
      creationDateTime: creationDateTime ?? toApiDateTime(new Date()),
      customer: { id: form.customerId, description: form.customerDisplayLabel },
      payment: DocumentFormService.buildPayment(
        form.paymentMethod,
        form.discountValue,
        form.installment,
      ),
      observations: form.observations.trim() || undefined,
      customerSignatureImage: form.signature ?? undefined,
      products: DocumentFormService.selectedProductLines(form.productLines).map((line) => ({
        id: line.id,
        product: {
          id: line.productId,
          description: line.productDescription,
        },
        quantity: line.quantity,
        valueUnit: line.valueUnit,
      })),
    };
  }
}

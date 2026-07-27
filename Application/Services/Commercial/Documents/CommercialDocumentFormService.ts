import { IValidationRule } from '../../../Hooks/UseFormValidation';
import { PaymentMethod, PaymentMethodLabels } from '../../../../Domain/ValueObjects/Enums/Commercial/Documents/Payments/PaymentMethod';
import { IDocumentProductSaveDto } from '../../../Interfaces/DataTransferObjects/Commercial/Documents/IDocumentProductSaveDto';
import { IDocumentSaveDto } from '../../../Interfaces/DataTransferObjects/Commercial/Documents/IDocumentSaveDto';
import { IPaymentSaveDto } from '../../../Interfaces/DataTransferObjects/Commercial/Documents/Payments/IPaymentSaveDto';
import { IEntityReferenceDto } from '../../../Interfaces/DataTransferObjects/Entities/IEntityReferenceDto';
import { DocumentInstallmentFormState, InstallmentFormService } from './Payments/InstallmentFormService';
interface DocumentProductDetail {
  id: number;
  product: {
    id: number;
    description?: string;
  };
  quantity: number;
  valueUnit: number;
  valueTotal: number;
}

export interface CommercialDocumentFormState<TProduct extends IDocumentProductSaveDto> {
  customerId: number;
  customerDisplayLabel: string;
  observations: string;
  signature: string | null;
  paymentMethod: PaymentMethod;
  discountValue: number;
  installment: DocumentInstallmentFormState;
  productLines: TProduct[];
}

export interface ICommercialDocumentDetailDto {
  customer: IEntityReferenceDto;
  payment: IPaymentSaveDto;
  observations?: string;
  customerSignatureImage?: string;
  products: DocumentProductDetail[];
}

export interface CommercialDocumentFormBaseSetters<TProduct extends IDocumentProductSaveDto> {
  setCustomerId: (value: number) => void;
  setCustomerDisplayLabel: (value: string) => void;
  setObservations: (value: string) => void;
  setSignature: (value: string | null) => void;
  setPaymentMethod: (value: PaymentMethod) => void;
  setDiscountValue: (value: number) => void;
  setInstallment: (value: DocumentInstallmentFormState) => void;
  setProductLines: (value: TProduct[]) => void;
}

export class CommercialDocumentFormService {
  static readonly paymentMethodOptions = Object.values(PaymentMethod)
    .filter((v) => typeof v === 'number')
    .map((v) => ({ label: PaymentMethodLabels[v as PaymentMethod], value: v as PaymentMethod }));

  static entitySelectLabel(entity: IEntityReferenceDto): string {
    return entity.description;
  }

  static createInitialFormState<TProduct extends IDocumentProductSaveDto>(): CommercialDocumentFormState<TProduct> {
    return {
      customerId: 0,
      customerDisplayLabel: '',
      observations: '',
      signature: null,
      paymentMethod: PaymentMethod.Check,
      discountValue: 0,
      installment: InstallmentFormService.createInitialState(),
      productLines: [CommercialDocumentFormService.createEmptyProductLine<TProduct>()],
    };
  }

  static detailToFormState<TProduct extends IDocumentProductSaveDto>(
    detail: ICommercialDocumentDetailDto,
  ): CommercialDocumentFormState<TProduct> {
    return {
      customerId: detail.customer.id,
      customerDisplayLabel: CommercialDocumentFormService.entitySelectLabel(detail.customer),
      observations: detail.observations ?? '',
      signature: detail.customerSignatureImage ?? null,
      paymentMethod: detail.payment.method,
      discountValue: detail.payment.discountValue,
      installment: InstallmentFormService.fromPayment(detail.payment),
      productLines: CommercialDocumentFormService.detailProductsToForm<TProduct>(detail.products),
    };
  }

  static applyBaseFormState<TProduct extends IDocumentProductSaveDto>(
    form: CommercialDocumentFormState<TProduct>,
    setters: CommercialDocumentFormBaseSetters<TProduct>,
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
    form: CommercialDocumentFormState<TProduct>,
  ): Pick<
    IDocumentSaveDto<TProduct>,
    'id' | 'creationDateTime' | 'customerId' | 'payment' | 'observations' | 'customerSignatureImage' | 'products'
  > {
    return {
      id: id ?? 0,
      creationDateTime: new Date(),
      customerId: form.customerId,
      payment: CommercialDocumentFormService.buildPayment(
        form.paymentMethod,
        form.discountValue,
        form.installment,
      ),
      observations: form.observations.trim() || undefined,
      customerSignatureImage: form.signature ?? undefined,
      products: CommercialDocumentFormService.saveProductLines(form.productLines),
    };
  }

  static buildValidationRules(form: CommercialDocumentFormState<IDocumentProductSaveDto>): IValidationRule[] {
    return [
      { key: 'customerId', isValid: !!form.customerId },
      { key: 'productLines', isValid: form.productLines.length > 0 },
      { key: 'paymentMethod', isValid: !!form.paymentMethod },
      ...InstallmentFormService.buildValidationRules(form.installment),
    ];
  }

  static createEmptyProductLine<TProduct extends IDocumentProductSaveDto>(): TProduct {
    return {
      id: 0,
      productId: 0,
      quantity: 0,
      valueUnit: 0,
      valueTotal: 0,
    } as TProduct;
  }

  static detailProductsToForm<TProduct extends IDocumentProductSaveDto>(
    products: DocumentProductDetail[] | undefined,
  ): TProduct[] {
    return products?.length
      ? products.map((product) => ({
        id: product.id,
        productId: product.product.id,
        productDescription: product.product.description,
        quantity: product.quantity,
        valueUnit: product.valueUnit,
        valueTotal: product.valueTotal,
      } as TProduct))
      : [CommercialDocumentFormService.createEmptyProductLine<TProduct>()];
  }

  static updateProductLine<TProduct extends IDocumentProductSaveDto>(
    productLines: TProduct[],
    index: number,
    field: keyof TProduct,
    value: number,
  ): TProduct[] {
    return productLines.map((productLine, currentIndex) => {
      if (currentIndex !== index) return productLine;

      const updated = { ...productLine, [field]: value };

      if (field === 'quantity' || field === 'valueUnit') {
        updated.valueTotal = updated.quantity * updated.valueUnit;
      }

      return updated;
    });
  }

  static selectProductLine<TProduct extends IDocumentProductSaveDto>(
    productLines: TProduct[],
    index: number,
    product: { id: number; description: string },
  ): TProduct[] {
    return productLines.map((productLine, currentIndex) =>
      currentIndex === index
        ? { ...productLine, productId: product.id, productDescription: product.description }
        : productLine,
    );
  }

  static buildPayment(
    paymentMethod: PaymentMethod,
    discountValue: number,
    installment: DocumentInstallmentFormState,
  ): IPaymentSaveDto {
    return {
      method: paymentMethod,
      discountValue,
      installment: InstallmentFormService.toInstallmentSaveDto(installment),
    };
  }

  static calculateTotal(productLines: IDocumentProductSaveDto[], discountValue: number): number {
    const valueSubtotal = productLines.reduce((sum, productLine) => sum + productLine.valueTotal, 0);

    return Math.max(0, valueSubtotal - discountValue);
  }

  static saveProductLines<TProduct extends IDocumentProductSaveDto>(productLines: TProduct[]): TProduct[] {
    return productLines
      .filter((productLine) => productLine.productId > 0)
      .map((productLine) => {
        const { productDescription: _productDescription, ...saveProductLine } = productLine;

        return saveProductLine as TProduct;
      });
  }

  static formToDetailDto(
    id: number | undefined,
    form: CommercialDocumentFormState<IDocumentProductSaveDto>,
  ): ICommercialDocumentDetailDto & { id: number; userId: number } {
    return {
      id: id ?? 0,
      userId: 0,
      customer: { id: form.customerId, description: form.customerDisplayLabel },
      payment: CommercialDocumentFormService.buildPayment(
        form.paymentMethod,
        form.discountValue,
        form.installment,
      ),
      observations: form.observations.trim() || undefined,
      customerSignatureImage: form.signature ?? undefined,
      products: CommercialDocumentFormService.saveProductLines(form.productLines).map((line) => ({
        id: line.id,
        product: {
          id: line.productId,
          description: line.productDescription ?? '',
        },
        quantity: line.quantity,
        valueUnit: line.valueUnit,
        valueTotal: line.valueTotal,
      })),
    };
  }
}

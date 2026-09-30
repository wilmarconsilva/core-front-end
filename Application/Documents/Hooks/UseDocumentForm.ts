import { useEffect, useRef, useState } from 'react';
import { UseCustomers } from '../../Persons/Customers/Hooks/UseCustomers';
import { UseFormValidation } from '../../Shared/Hooks/UseFormValidation';
import { UseProducts } from '../../Products/Hooks/UseProducts';
import { PaymentMethod } from '../../../Domain/Documents/ValueObjects/Payments/Enums/PaymentMethod';
import { ICustomerListing } from '../../Persons/Customers/DataTransferObjects/ICustomerListing';
import { IDocumentProductSaveDto } from '../DataTransferObjects/IDocumentProductSaveDto';
import { IPaymentSaveDto } from '../DataTransferObjects/Payments/IPaymentSaveDto';
import {
  DocumentFormService,
  DocumentFormState,
  PaymentMethodPolicy,
} from '../Services/DocumentFormService';
import { DocumentInstallmentFormState } from '../Services/Payments/InstallmentFormService';
import { UseDocumentInstallmentForm } from './UseDocumentInstallmentForm';
import { IValidationRule } from '../../Shared/Hooks/UseFormValidation';

const PAGE_SIZE = 50;

interface IDocumentCrud<TDetail, TSaveDto> {
  currentItem: TDetail | null;
  isLoadingItem: boolean;
  isSaving: boolean;
  loadById: (id: number) => void;
  save: (id: number | null, data: TSaveDto) => Promise<boolean>;
  clearCurrentItem: () => void;
}

interface IDocumentFormService<
  TProduct extends IDocumentProductSaveDto,
  TFormState extends DocumentFormState<TProduct>,
  TDetail extends { payment: IPaymentSaveDto },
  TSaveDto,
> {
  paymentMethodPolicy: PaymentMethodPolicy;
  createInitialForm: () => TFormState;
  detailToForm: (detail: TDetail) => TFormState;
  buildValidationRules: (form: TFormState) => IValidationRule[];
  buildSaveDto: (id: number | undefined, form: TFormState) => TSaveDto;
  formToDetail: (id: number | undefined, form: TFormState) => TDetail;
}

interface UseDocumentFormConfig<
  TProduct extends IDocumentProductSaveDto,
  TFormState extends DocumentFormState<TProduct>,
  TDetail extends { payment: IPaymentSaveDto },
  TSaveDto,
> {
  id: number | undefined;
  onGoBack: () => void;
  useDocument: () => IDocumentCrud<TDetail, TSaveDto>;
  formService: IDocumentFormService<TProduct, TFormState, TDetail, TSaveDto>;
  applyExtraFormState?: (form: TFormState) => void;
  getExtraFormState?: () => Partial<TFormState>;
  /** Estado inicial de um documento novo, copiado de outra origem (ex.: pedido a partir de orçamento). */
  seedForm?: TFormState | null;
  isLoadingSeed?: boolean;
}

export function UseDocumentForm<
  TProduct extends IDocumentProductSaveDto,
  TFormState extends DocumentFormState<TProduct>,
  TDetail extends { payment: IPaymentSaveDto },
  TSaveDto,
>({
  id,
  onGoBack,
  useDocument,
  formService,
  applyExtraFormState,
  getExtraFormState,
  seedForm,
  isLoadingSeed,
}: UseDocumentFormConfig<TProduct, TFormState, TDetail, TSaveDto>) {
  const { currentItem, isLoadingItem, isSaving, loadById, save, clearCurrentItem } = useDocument();
  const { listings: customers, isLoadingList: isLoadingCustomers, loadAll: loadCustomers } = UseCustomers();
  const { listings: products, isLoadingList: isLoadingProducts, loadAll: loadProducts } = UseProducts();
  const { errors, validate, clearError } = UseFormValidation();
  const isEditing = !!id;

  const initialForm = formService.createInitialForm();
  const [customerId, setCustomerId] = useState(initialForm.customerId);
  const [customerDisplayLabel, setCustomerDisplayLabel] = useState(initialForm.customerDisplayLabel);
  const [observations, setObservations] = useState(initialForm.observations);
  const [signature, setSignature] = useState<string | null>(initialForm.signature);
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod | null>(initialForm.paymentMethod);
  const [discountValue, setDiscountValue] = useState(initialForm.discountValue);
  const [installment, setInstallment] = useState<DocumentInstallmentFormState>(initialForm.installment);
  const [productLines, setProductLines] = useState<TProduct[]>(initialForm.productLines);
  const [filterCustomerName, setFilterCustomerName] = useState('');
  const [filterProductDescription, setFilterProductDescription] = useState('');
  const isSeedApplied = useRef(false);

  const valueTotal = DocumentFormService.calculateTotal(productLines, discountValue);
  const installmentFields = UseDocumentInstallmentForm(
    valueTotal,
    installment,
    setInstallment,
    clearError,
  );

  useEffect(() => {
    loadCustomers({ registersStart: 0, registersEnd: PAGE_SIZE });
    loadProducts({ registersStart: 0, registersEnd: PAGE_SIZE });
    if (isEditing) loadById(id);

    return () => clearCurrentItem();
  }, [id]);

  const applyForm = (form: TFormState) => {
    DocumentFormService.applyBaseFormState(form, {
      setCustomerId,
      setCustomerDisplayLabel,
      setObservations,
      setSignature,
      setPaymentMethod,
      setDiscountValue,
      setInstallment,
      setProductLines,
    });
    applyExtraFormState?.(form);
  };

  useEffect(() => {
    if (!currentItem) return;

    applyForm(formService.detailToForm(currentItem));
  }, [currentItem]);

  // A origem preenche o formulário uma única vez: a partir daí valem as edições do usuário.
  useEffect(() => {
    if (isEditing || !seedForm || isSeedApplied.current) return;

    isSeedApplied.current = true;
    applyForm(seedForm);
  }, [seedForm]);

  const currentForm = (): TFormState =>
    ({
      customerId,
      customerDisplayLabel,
      observations,
      signature,
      paymentMethod,
      discountValue,
      installment,
      productLines,
      ...getExtraFormState?.(),
    }) as TFormState;

  const selectCustomer = (customer: ICustomerListing) => {
    setCustomerId(customer.id);
    setCustomerDisplayLabel(customer.name);
    clearError('customerId');
  };

  const updateProductLine = (index: number, field: keyof TProduct, value: number) => {
    setProductLines((previous) =>
      DocumentFormService.updateProductLine(previous, index, field, value),
    );
  };

  const selectProductLine = (index: number, product: { id: number; description: string }) => {
    setProductLines((previous) =>
      DocumentFormService.selectProductLine(previous, index, product),
    );
  };

  const addProductLine = () => {
    setProductLines((previous) => [
      ...previous,
      DocumentFormService.createEmptyProductLine<TProduct>(),
    ]);
  };

  const removeProductLine = (index: number) => {
    setProductLines((previous) => previous.filter((_, currentIndex) => currentIndex !== index));
  };

  const handleSave = async () => {
    const form = currentForm();
    const isValid = validate(formService.buildValidationRules(form));

    if (!isValid) return;

    const success = await save(id ?? null, formService.buildSaveDto(id, form));
    if (success) onGoBack();
  };

  return {
    pageSize: PAGE_SIZE,
    isEditing,
    isLoadingItem: isLoadingItem || !!isLoadingSeed,
    isSaving,
    customers,
    isLoadingCustomers,
    loadCustomers,
    products,
    isLoadingProducts,
    loadProducts,
    errors,
    customerId,
    customerDisplayLabel,
    selectCustomer,
    observations,
    setObservations,
    signature,
    setSignature,
    paymentMethod,
    setPaymentMethod,
    isPaymentMethodRequired: formService.paymentMethodPolicy.isRequired,
    paymentMethodOptions: DocumentFormService.paymentMethodOptionsFor(formService.paymentMethodPolicy),
    downPaymentMethodOptions: DocumentFormService.paymentMethodOptions,
    discountValue,
    setDiscountValue,
    ...installmentFields,
    productLines,
    updateProductLine,
    selectProductLine,
    addProductLine,
    removeProductLine,
    valueTotal,
    filterCustomerName,
    setFilterCustomerName,
    filterProductDescription,
    setFilterProductDescription,
    handleSave,
    buildDetailFromForm: () => formService.formToDetail(id, currentForm()),
  };
}

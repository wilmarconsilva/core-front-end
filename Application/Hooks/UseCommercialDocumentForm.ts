import { useEffect, useState } from 'react';
import { UseCustomers } from './UseCustomers';
import { UseFormValidation } from './UseFormValidation';
import { UseProducts } from './UseProducts';
import { PaymentMethod } from '../../Domain/ValueObjects/Enums/Commercial/Documents/Payments/PaymentMethod';
import { ICustomerListing } from '../Interfaces/DataTransferObjects/Persons/Customers/ICustomerListing';
import { IDocumentProductSaveDto } from '../Interfaces/DataTransferObjects/Commercial/Documents/IDocumentProductSaveDto';
import { IPaymentSaveDto } from '../Interfaces/DataTransferObjects/Commercial/Documents/Payments/IPaymentSaveDto';
import {
  CommercialDocumentFormService,
  CommercialDocumentFormState,
} from '../Services/Commercial/Documents/CommercialDocumentFormService';
import { DocumentInstallmentFormState } from '../Services/Commercial/Documents/Payments/InstallmentFormService';
import { UseDocumentInstallmentForm } from './UseDocumentInstallmentForm';
import { IValidationRule } from './UseFormValidation';

const PAGE_SIZE = 50;

interface ICommercialDocumentCrud<TDetail, TSaveDto> {
  currentItem: TDetail | null;
  isLoadingItem: boolean;
  isSaving: boolean;
  loadById: (id: number) => void;
  save: (id: number | null, data: TSaveDto) => Promise<boolean>;
  clearCurrentItem: () => void;
}

interface ICommercialDocumentFormService<
  TProduct extends IDocumentProductSaveDto,
  TFormState extends CommercialDocumentFormState<TProduct>,
  TDetail extends { payment: IPaymentSaveDto },
  TSaveDto,
> {
  createInitialForm: () => TFormState;
  detailToForm: (detail: TDetail) => TFormState;
  buildValidationRules: (form: TFormState) => IValidationRule[];
  buildSaveDto: (id: number | undefined, form: TFormState) => TSaveDto;
  formToDetail: (id: number | undefined, form: TFormState) => TDetail;
}

interface UseCommercialDocumentFormConfig<
  TProduct extends IDocumentProductSaveDto,
  TFormState extends CommercialDocumentFormState<TProduct>,
  TDetail extends { payment: IPaymentSaveDto },
  TSaveDto,
> {
  id: number | undefined;
  onGoBack: () => void;
  useDocument: () => ICommercialDocumentCrud<TDetail, TSaveDto>;
  formService: ICommercialDocumentFormService<TProduct, TFormState, TDetail, TSaveDto>;
  applyExtraFormState?: (form: TFormState) => void;
  getExtraFormState?: () => Partial<TFormState>;
  extraReturn?: Record<string, unknown>;
}

export function UseCommercialDocumentForm<
  TProduct extends IDocumentProductSaveDto,
  TFormState extends CommercialDocumentFormState<TProduct>,
  TDetail extends { payment: IPaymentSaveDto },
  TSaveDto,
>({
  id,
  onGoBack,
  useDocument,
  formService,
  applyExtraFormState,
  getExtraFormState,
  extraReturn,
}: UseCommercialDocumentFormConfig<TProduct, TFormState, TDetail, TSaveDto>) {
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
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>(initialForm.paymentMethod);
  const [discountValue, setDiscountValue] = useState(initialForm.discountValue);
  const [installment, setInstallment] = useState<DocumentInstallmentFormState>(initialForm.installment);
  const [productLines, setProductLines] = useState<TProduct[]>(initialForm.productLines);
  const [filterCustomerName, setFilterCustomerName] = useState('');
  const [filterProductDescription, setFilterProductDescription] = useState('');

  const valueTotal = CommercialDocumentFormService.calculateTotal(productLines, discountValue);
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

  useEffect(() => {
    if (!currentItem) return;

    const form = formService.detailToForm(currentItem);
    CommercialDocumentFormService.applyBaseFormState(form, {
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
  }, [currentItem]);

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
      CommercialDocumentFormService.updateProductLine(previous, index, field, value),
    );
  };

  const selectProductLine = (index: number, product: { id: number; description: string }) => {
    setProductLines((previous) =>
      CommercialDocumentFormService.selectProductLine(previous, index, product),
    );
  };

  const addProductLine = () => {
    setProductLines((previous) => [
      ...previous,
      CommercialDocumentFormService.createEmptyProductLine<TProduct>(),
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
    isLoadingItem,
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
    paymentMethodOptions: CommercialDocumentFormService.paymentMethodOptions,
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
    ...extraReturn,
  };
}

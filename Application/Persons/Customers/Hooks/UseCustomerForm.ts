import { useEffect, useState } from 'react';
import { Masks } from 'react-native-mask-input';
import { UseCustomers } from './UseCustomers';
import { UseFormValidation } from '../../../Shared/Hooks/UseFormValidation';
import { UseLocalities } from '../../../Territories/Localities/Hooks/UseLocalities';
import { CustomerFormService } from '../Services/CustomerFormService';
import { ICustomerAddressSaveDto } from '../DataTransferObjects/ICustomerAddressSaveDto';
import { PersonType } from '../../../../Domain/Persons/Enums/PersonType';

const PAGE_SIZE = 50;

export function UseCustomerForm(id: number | undefined, onGoBack: () => void) {
  const { currentItem, isLoadingItem, isSaving, loadById, save, clearCurrentItem } = UseCustomers();
  const { listings: localities, isLoadingList: isLoadingLocalities, loadAll: loadLocalities } = UseLocalities();
  const { errors, validate, clearError, clearErrors, bindChange } = UseFormValidation();
  const isEditing = !!id;

  const initialForm = CustomerFormService.createInitialForm();
  const [name, setName] = useState(initialForm.name);
  const [personType, setPersonType] = useState<PersonType>(initialForm.personType);
  const [document, setDocument] = useState(initialForm.document);
  const [email, setEmail] = useState(initialForm.email);
  const [stateRegistration, setStateRegistration] = useState(initialForm.stateRegistration);
  const [addresses, setAddresses] = useState<ICustomerAddressSaveDto[]>(initialForm.addresses);
  const [filterLocalityDescription, setFilterLocalityDescription] = useState('');

  const documentFieldLabel = personType === PersonType.Natural ? 'CPF' : 'CNPJ';
  const documentFieldPlaceholder = personType === PersonType.Natural ? '000.000.000-00' : 'CNPJ Alfanumérico';
  const documentMask = personType === PersonType.Natural ? Masks.BRL_CPF : undefined;

  useEffect(() => {
    loadLocalities({ registersStart: 0, registersEnd: PAGE_SIZE });
    if (isEditing) loadById(id);

    return () => clearCurrentItem();
  }, [id]);

  useEffect(() => {
    if (!currentItem) return;

    const form = CustomerFormService.detailToForm(currentItem);
    setName(form.name);
    setPersonType(form.personType);
    setDocument(form.document);
    setEmail(form.email);
    setStateRegistration(form.stateRegistration);
    setAddresses(form.addresses);
  }, [currentItem]);

  useEffect(() => {
    if (personType !== PersonType.Natural) return;

    setDocument((previous) => CustomerFormService.formatDocumentForPersonType(personType, previous));
  }, [personType]);

  const currentForm = () => ({
    name,
    personType,
    document,
    email,
    stateRegistration,
    addresses,
  });

  const updateAddress = (index: number, field: keyof ICustomerAddressSaveDto, value: string | number) => {
    setAddresses((previous) =>
      previous.map((address, currentIndex) =>
        currentIndex === index ? { ...address, [field]: value } : address,
      ),
    );
    clearError(CustomerFormService.addressErrorKey(index, field));
  };

  const selectLocality = (index: number, locality: { id: number; description: string }) => {
    setAddresses((previous) =>
      previous.map((address, currentIndex) =>
        currentIndex === index
          ? { ...address, localityId: locality.id, localityDescription: locality.description }
          : address,
      ),
    );
    clearError(CustomerFormService.addressErrorKey(index, 'localityId'));
  };

  const addAddress = () => {
    setAddresses((previous) => [...previous, CustomerFormService.createEmptyAddress()]);
    clearErrors();
  };

  const removeAddress = (index: number) => {
    setAddresses((previous) => previous.filter((_, currentIndex) => currentIndex !== index));
    clearErrors();
  };

  const handleEmailChange = (text: string) => {
    bindChange('email', setEmail)(CustomerFormService.sanitizeEmailInput(text));
  };

  const handleSave = async () => {
    const form = currentForm();
    const isValid = validate(CustomerFormService.buildValidationRules(form, documentFieldLabel));

    if (!isValid) return;

    const success = await save(id ?? null, CustomerFormService.buildSaveDto(id, form));
    if (success) onGoBack();
  };

  return {
    pageSize: PAGE_SIZE,
    isEditing,
    isLoadingItem,
    isSaving,
    localities,
    isLoadingLocalities,
    loadLocalities,
    errors,
    name,
    setName: bindChange('name', setName),
    personType,
    setPersonType,
    document,
    setDocument: bindChange('document', setDocument),
    documentFieldLabel,
    documentFieldPlaceholder,
    documentMask,
    email,
    setEmail: handleEmailChange,
    stateRegistration,
    setStateRegistration,
    addresses,
    filterLocalityDescription,
    setFilterLocalityDescription,
    personTypeOptions: CustomerFormService.personTypeOptions,
    addressErrorKey: CustomerFormService.addressErrorKey,
    updateAddress,
    selectLocality,
    addAddress,
    removeAddress,
    handleSave,
  };
}

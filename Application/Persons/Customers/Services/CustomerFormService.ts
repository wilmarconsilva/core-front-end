import { formatWithMask, Masks } from 'react-native-mask-input';
import { IValidationRule } from '../../../Shared/Hooks/UseFormValidation';
import { ICustomerAddressSaveDto } from '../DataTransferObjects/ICustomerAddressSaveDto';
import { ICustomerDetailDto } from '../DataTransferObjects/ICustomerDetailDto';
import { ICustomerSaveDto } from '../DataTransferObjects/ICustomerSaveDto';
import { PersonType, PersonTypeLabels } from '../../../../Domain/Persons/Enums/PersonType';

export interface CustomerFormState {
  name: string;
  personType: PersonType;
  document: string;
  email: string;
  stateRegistration: string;
  addresses: ICustomerAddressSaveDto[];
}

export class CustomerFormService {
  private static readonly EMAIL_MASK_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;

  static readonly personTypeOptions = Object.values(PersonType)
    .filter((v) => typeof v === 'number')
    .map((v) => ({ label: PersonTypeLabels[v as PersonType], value: v as PersonType }));

  static createInitialForm(): CustomerFormState {
    return {
      name: '',
      personType: PersonType.Natural,
      document: '',
      email: '',
      stateRegistration: '',
      addresses: [CustomerFormService.createEmptyAddress()],
    };
  }

  static createEmptyAddress(): ICustomerAddressSaveDto {
    return { id: 0, neighborhood: '', street: '', localityId: 0 };
  }

  static sanitizeEmailInput(raw: string): string {
    const noSpaces = raw.replace(/\s/g, '');
    const at = noSpaces.indexOf('@');

    if (at === -1) return noSpaces;

    const local = noSpaces.slice(0, at).replace(/@/g, '');
    const domain = noSpaces.slice(at + 1).replace(/@/g, '');

    return `${local}@${domain}`;
  }

  static formatDocumentForPersonType(personType: PersonType, document: string): string {
    if (personType !== PersonType.Natural) return document;

    return formatWithMask({ text: document.replace(/\D/g, ''), mask: Masks.BRL_CPF }).masked;
  }

  static addressErrorKey(index: number, field: keyof ICustomerAddressSaveDto): string {
    return `addresses.${index}.${field}`;
  }

  static detailToForm(detail: ICustomerDetailDto): CustomerFormState {
    return {
      name: detail.name ?? '',
      personType: detail.personType,
      document: CustomerFormService.formatDocumentForPersonType(detail.personType, detail.document ?? ''),
      email: CustomerFormService.sanitizeEmailInput(detail.email ?? ''),
      stateRegistration: detail.stateRegistration ?? '',
      addresses: detail.addresses?.length
        ? detail.addresses.map((address) => ({
          id: address.id,
          neighborhood: address.neighborhood,
          street: address.street,
          localityId: address.locality.id,
          localityDescription: address.locality.description,
          complement: address.complement,
          postalCode: address.postalCode,
          number: address.number,
        }))
        : [CustomerFormService.createEmptyAddress()],
    };
  }

  static buildSaveDto(id: number | undefined, form: CustomerFormState): ICustomerSaveDto {
    return {
      id: id ?? 0,
      name: form.name.trim(),
      personType: form.personType,
      document: form.document.trim(),
      addresses: form.addresses,
      email: form.email.trim() || undefined,
      stateRegistration: form.stateRegistration.trim() || undefined,
    };
  }

  static buildValidationRules(form: CustomerFormState, documentFieldLabel: string): IValidationRule[] {
    const emailTrimmed = form.email.trim();

    return [
      { key: 'name', isValid: !!form.name.trim() },
      { key: 'document', isValid: !!form.document.trim() },
      {
        key: 'email',
        isValid: !emailTrimmed || CustomerFormService.EMAIL_MASK_REGEX.test(emailTrimmed),
        message: 'Informe um e-mail válido.',
      },
      {
        key: 'document',
        isValid: CustomerFormService.validateDocument(form.personType, form.document),
        message: `Informe um ${documentFieldLabel} válido.`,
      },
      ...form.addresses.flatMap((address, index) => [
        {
          key: CustomerFormService.addressErrorKey(index, 'street'),
          isValid: !!address.street.trim(),
        },
        {
          key: CustomerFormService.addressErrorKey(index, 'neighborhood'),
          isValid: !!address.neighborhood.trim(),
        },
        {
          key: CustomerFormService.addressErrorKey(index, 'localityId'),
          isValid: !!address.localityId,
        },
      ]),
    ];
  }

  private static validateDocument(personType: PersonType, document: string): boolean {
    if (personType === PersonType.Natural) {
      return document.length === 14;
    }

    if (personType === PersonType.Legal) {
      return document.length === 18;
    }

    return false;
  }
}

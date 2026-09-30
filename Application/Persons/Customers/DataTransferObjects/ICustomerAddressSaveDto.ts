export interface ICustomerAddressSaveDto {
  id: number;
  neighborhood: string;
  street: string;
  localityId: number;
  /** Preenchido no cliente a partir do detalhe; só para exibição no EntitySelectField */
  localityDescription?: string;
  complement?: string;
  postalCode?: string;
  number?: string;
}

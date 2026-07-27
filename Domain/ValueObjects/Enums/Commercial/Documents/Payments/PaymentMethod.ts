export enum PaymentMethod {
  DebitCard = 1,
  CreditCard = 2,
  Money = 3,
  Deposit = 4,
  Slip = 5,
  Check = 6,
  PIX = 7,
}

export const PaymentMethodLabels: Record<PaymentMethod, string> = {
  [PaymentMethod.DebitCard]: 'Cartão de Débito',
  [PaymentMethod.CreditCard]: 'Cartão de Crédito',
  [PaymentMethod.Money]: 'Dinheiro',
  [PaymentMethod.Deposit]: 'Depósito',
  [PaymentMethod.Slip]: 'Boleto',
  [PaymentMethod.Check]: 'Cheque',
  [PaymentMethod.PIX]: 'PIX',
};

/** Modelo de impressão: todos os valores já chegam formatados para exibição. */
export interface IDocumentTemplateProduct {
  description: string;
  quantity: string;
  valueUnit: string;
  valueTotal: string;
}

export interface IDocumentTemplateCustomer {
  name: string;
  city: string;
  documentLabel: string;
  document: string;
}

export interface IDocumentTemplatePayment {
  method: string;
  installments?: string;
  downPayment?: string;
  downPaymentMethod?: string;
}

export interface IDocumentTemplateSignature {
  name?: string;
  /** Data URI da imagem; ausente quando a assinatura não existe. */
  image?: string;
}

export interface IDocumentTemplate {
  /** Tipo do documento seguido do número, que só existe depois de salvo no servidor (ex.: "Orçamento 12"). */
  title: string;
  issueDate: string;
  customer: IDocumentTemplateCustomer;
  products: IDocumentTemplateProduct[];
  valueSubtotal: string;
  discountValue?: string;
  valueTotal: string;
  payment: IDocumentTemplatePayment;
  observations?: string;
  sellerSignature: IDocumentTemplateSignature;
  customerSignature: IDocumentTemplateSignature;
}

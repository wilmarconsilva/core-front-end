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
}

export interface IDocumentTemplateSignature {
  name?: string;
  /** Data URI da imagem; ausente quando a assinatura não existe. */
  image?: string;
}

export interface IDocumentTemplate {
  /** Ausente enquanto o documento não foi salvo no servidor. */
  number?: number;
  budgetId?: number;
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

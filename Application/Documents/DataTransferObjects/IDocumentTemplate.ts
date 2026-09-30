export interface IDocumentTemplate {
  documentTitle: string;
  id: number;
  customerName: string;
  creationDateTime: string;
  observations?: string;
  valueSubtotal: string;
  valueTotal: string;
  paymentMethod: string;
  customerSignatureImage?: string;
}

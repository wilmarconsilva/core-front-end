export interface IDocumentProductSaveDto {
  id: number;
  productId: number;
  /** Preenchido no cliente a partir do detalhe; só para exibição no EntitySelectField */
  productDescription?: string;
  quantity: number;
  valueUnit: number;
  valueTotal: number;
}

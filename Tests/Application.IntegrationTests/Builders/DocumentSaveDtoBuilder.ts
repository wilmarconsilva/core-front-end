import { IOrderSaveDto } from '../../../Application/Documents/Orders/DataTransferObjects/IOrderSaveDto';
import { IBudgetSaveDto } from '../../../Application/Documents/Budgets/DataTransferObjects/IBudgetSaveDto';
import { IDocumentProductSaveDto } from '../../../Application/Documents/DataTransferObjects/IDocumentProductSaveDto';
import { PaymentMethod } from '../../../Domain/Documents/ValueObjects/Payments/Enums/PaymentMethod';

export class DocumentSaveDtoBuilder {
  static readonly creationDateTime = new Date(2026, 0, 10, 12, 0, 0);

  static product(productId: number, quantity = 2, valueUnit = 50): IDocumentProductSaveDto {
    return { id: 0, productId, quantity, valueUnit, valueTotal: quantity * valueUnit };
  }

  static order(customerId: number, productIds: number[], id = 0): IOrderSaveDto {
    return {
      id,
      creationDateTime: DocumentSaveDtoBuilder.creationDateTime,
      customerId,
      payment: { method: PaymentMethod.PIX, discountValue: 0 },
      observations: 'Entregar pela manhã',
      products: productIds.map((productId) => DocumentSaveDtoBuilder.product(productId)),
    };
  }

  static budget(customerId: number, productIds: number[], id = 0): IBudgetSaveDto {
    return {
      id,
      creationDateTime: DocumentSaveDtoBuilder.creationDateTime,
      customerId,
      payment: { method: null, discountValue: 0 },
      products: productIds.map((productId) => DocumentSaveDtoBuilder.product(productId)),
    };
  }
}

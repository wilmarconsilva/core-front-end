export enum SynchronizationEntityType {
  Product = 'product',
  Customer = 'customer',
  Order = 'order',
  Budget = 'budget',
}

export class SynchronizationEntityTypeUtility {
  private static readonly labels: Record<SynchronizationEntityType, string> = {
    [SynchronizationEntityType.Product]: 'Produto',
    [SynchronizationEntityType.Customer]: 'Cliente',
    [SynchronizationEntityType.Order]: 'Pedido',
    [SynchronizationEntityType.Budget]: 'Orçamento',
  };

  static getLabel(entityType: SynchronizationEntityType): string {
    return this.labels[entityType];
  }
}

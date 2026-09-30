import { IEntityFormScreenProps } from './IEntityFormScreenProps';

/** Props do formulário de pedido: além do id de edição, o orçamento que origina um pedido novo. */
export interface IOrderFormScreenProps extends IEntityFormScreenProps {
  budgetId?: number;
}

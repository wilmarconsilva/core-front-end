import { ICrudListScreenProps } from '../../../Shared/Interfaces/Screens/ICrudListScreenProps';

/** Props da listagem de orçamentos: navega também para o formulário de pedido originado do orçamento. */
export interface IBudgetsListScreenProps extends ICrudListScreenProps {
  onNavigateToOrderForm: (budgetId: number) => void;
}

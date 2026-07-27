/** Props comuns aos formulários de entidade (criação/edição por id opcional). */
export interface IEntityFormScreenProps {
  id?: number;
  onGoBack: () => void;
}

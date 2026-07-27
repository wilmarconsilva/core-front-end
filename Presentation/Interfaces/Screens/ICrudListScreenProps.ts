/** Props comuns às telas de listagem CRUD (voltar + navegar ao formulário). */
export interface ICrudListScreenProps {
  onGoBack: () => void;
  onNavigateToForm: (id?: number) => void;
}

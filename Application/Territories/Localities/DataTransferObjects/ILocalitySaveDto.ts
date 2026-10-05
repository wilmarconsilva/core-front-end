export interface ILocalitySaveDto {
  id: number;
  description: string;
  stateId?: number;
  /** Preenchido só no snapshot offline (vem da sincronização); não é enviado pelo formulário. */
  stateAcronym?: string;
}

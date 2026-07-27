export enum PersonType {
  Natural = 1,
  Legal = 2,
}

export const PersonTypeLabels: Record<PersonType, string> = {
  [PersonType.Natural]: 'Pessoa Física',
  [PersonType.Legal]: 'Pessoa Jurídica',
};

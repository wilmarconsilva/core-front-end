/** Um dado que o fluxo exige não está disponível (ex.: snapshot offline ausente). */
export class RequiredDataUnavailableError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RequiredDataUnavailableError';
  }
}

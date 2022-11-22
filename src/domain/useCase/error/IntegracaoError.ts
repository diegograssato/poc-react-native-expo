export class IntegracaoError extends Error {
  data: any;

  constructor(message?: string, data?: any) {
    super(message);
    this.name = 'IntegracaoError';
    this.data = data;
  }
}

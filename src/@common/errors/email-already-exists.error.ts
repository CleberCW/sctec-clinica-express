export class EmailAlreadyExistsError extends Error {
  constructor() {
    super('Email já existe no sistema');
    this.name = 'EmailAlreadyExistsError';
  }
}

import { AppError } from './app.error.ts';

export class InvalidCredentialsError extends AppError {
  constructor(options?: ErrorOptions) {
    super('Credenciais inválidas', 401, options);
  }
}

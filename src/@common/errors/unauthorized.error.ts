import { AppError } from './app.error.ts';

export class UnauthorizedError extends AppError {
  constructor(options?: ErrorOptions) {
    super('Acesso não autorizado', 403, options);
  }
}

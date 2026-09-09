import { AppError } from './app.error.ts';

export class UnauthorizedError extends AppError {
  constructor(options?: ErrorOptions) {
    super('Acesso não autorizado', 1000, 403, options);
  }
}

import { AppError } from './app.error.ts';

export class ForbiddenError extends AppError {
  constructor(options?: ErrorOptions) {
    super('Acesso negado', 403, options);
  }
}

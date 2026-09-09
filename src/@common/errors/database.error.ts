import { AppError } from './app.error.ts';

export class UnknownDatabaseError extends AppError {
  constructor(options?: ErrorOptions) {
    super('Unknown database error', 1000, 500, options);
  }
}

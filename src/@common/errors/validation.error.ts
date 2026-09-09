import type { ValidationError } from 'class-validator';
import { AppError } from './app.error.ts';

export class ValidationAppError extends AppError {
  public readonly errors: ValidationError[];

  constructor(errors: ValidationError[], options?: ErrorOptions) {
    super('Dados inválidos', 1000, 400, options);
    this.errors = errors;
  }
}

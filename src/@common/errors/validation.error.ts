import type { ValidationError } from 'class-validator';
import { AppError } from './app.error.ts';

export class ValidationAppError extends AppError {
  public readonly errors: ValidationError[];

  constructor(errors: ValidationError[]) {
    super('Dados inválidos', 400);
    this.errors = errors;
  }
}

import { AppError } from './app.error.ts';

export class EmailAlreadyExistsError extends AppError {
  constructor(options?: ErrorOptions) {
    super('Email já existe no sistema', 1000, 400, options);
  }
}

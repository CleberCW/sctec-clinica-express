import type { Response, Request, NextFunction } from 'express';
import { AppError } from './errors/app.error.ts';
import { ValidationAppError } from './errors/validation.error.ts';

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  console.error(error);

  if (error instanceof ValidationAppError) {
    const errors = Object.fromEntries(
      error.errors.map((validationError) => [
        validationError.property,
        validationError.constraints
          ? Object.values(validationError.constraints)
          : [],
      ]),
    );

    return res.status(error.statusCode).json({
      message: error.message,
      errors,
    });
  }

  if (error instanceof AppError) {
    return res.status(error.statusCode).json({
      message: error.message,
    });
  }

  return res.status(500).json({
    message: 'Internal server error',
  });
};

import type { NextFunction, Request, Response } from 'express';
import { ValidationAppError } from './errors/validation.error.ts';

export const errorHandler = (
  error: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  if (error instanceof ValidationAppError) {
    const errors = Object.fromEntries(
      error.errors.map((validationError) => [
        validationError.property,
        validationError.constraints
          ? Object.values(validationError.constraints)
          : [],
      ]),
    );

    res.status(400).json({
      message: error.message,
      errors,
    });

    return;
  }

  //...

  return res.status(500).json({
    message: 'Internal server error',
  });
};

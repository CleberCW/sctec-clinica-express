import type { Request, Response, NextFunction } from 'express';
import { plainToInstance } from 'class-transformer';
import { validate, ValidationError } from 'class-validator';
import { ValidationAppError } from './errors/validation.error.ts';

export function validateBody(dtoClass: any) {
  return async (
    req: Request,
    res: Response,
    next: NextFunction,
  ): Promise<void> => {
    const dtoInstance = plainToInstance(dtoClass, req.body);

    const errors: ValidationError[] = await validate(dtoInstance, {
      whitelist: true,
      forbidNonWhitelisted: true,
    });

    if (errors.length > 0) {
      next(new ValidationAppError(errors));
      return;
    }

    req.body = dtoInstance;
    next();
  };
}

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
    const validBody =
      req.body && Object.keys(req.body).length > 0 ? req.body : {};

    const dtoInstance = plainToInstance(dtoClass, validBody);

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

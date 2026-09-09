import type { Request, Response, NextFunction } from 'express';

import type { RoleName } from '../entities/role.entity.ts';
import { ForbiddenError } from './errors/forbidden.error.ts';

export function authorize(role: RoleName) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const user = res.locals.user;

    if (!user.role.includes(role)) {
      return next(new ForbiddenError());
    }

    next();
  };
}

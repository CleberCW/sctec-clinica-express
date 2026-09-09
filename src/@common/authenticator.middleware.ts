import type { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { UnauthorizedError } from './errors/unauthorized.error.ts';

export function authenticate(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  try {
    const authorization = req.headers.authorization;

    if (!authorization?.startsWith('Bearer ')) {
      throw new UnauthorizedError();
    }

    const secret = process.env.JWT_SECRET;

    if (!secret) {
      throw new Error('JWT secret não encontrado');
    }

    const token = authorization.split(' ')[1];

    if (!token) {
      throw new UnauthorizedError();
    }

    const payload = jwt.verify(token, secret);

    if (typeof payload === 'string') {
      throw new UnauthorizedError();
    }

    res.locals.user = payload;

    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return next(new UnauthorizedError({ cause: error }));
    }

    next(error);
  }
}

import type { Request, Response } from 'express';
import * as authService from './auth.service.ts';
import type { RegisterUserDto } from './dtos/register.user.dto.ts';

export const register = async (req: Request, res: Response) => {
  const data: RegisterUserDto = req.body;

  await authService.register(data);

  res.status(201).json({
    message: 'User registered',
  });
};

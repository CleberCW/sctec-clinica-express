import type { Request, Response } from 'express';
import type { UserService } from './users.service.ts';
import { UnauthorizedError } from '../@common/errors/unauthorized.error.ts';

export const createUserController = (userService: UserService) => {
  return {
    handleRegister: async (req: Request, res: Response) => {
      const newUser = await userService.registerUser(req.body);

      return res.status(201).json(newUser);
    },

    handleLogin: async (req: Request, res: Response) => {
      const token = await userService.loginUser(req.body);

      return res.status(200).json(token);
    },

    getInfo: async (req: Request, res: Response) => {
      const userPayload = res.locals.user;

      if (!userPayload) {
        throw new UnauthorizedError();
      }

      const userData = await userService.getUser(userPayload.email);

      if (userData === null) {
        return res.status(401).json('Deu ruim');
      }
      return res.status(200).json(userData);
    },

    testError: async (req: Request, res: Response) => {
      throw new Error('TESTE ERROR HANDLER');
    },
  };
};

export type UserController = ReturnType<typeof createUserController>;

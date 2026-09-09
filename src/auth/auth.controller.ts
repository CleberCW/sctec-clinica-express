import type { Request, Response } from 'express';
import type { UserService } from './auth.service.ts';

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
  };
};

export type UserController = ReturnType<typeof createUserController>;

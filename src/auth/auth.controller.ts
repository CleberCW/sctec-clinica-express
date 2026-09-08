import type { Request, Response } from 'express';
import type { UserService } from './auth.service.ts';

export const createUserController = (userService: UserService) => {
  return {
    handleRegister: async (req: Request, res: Response) => {
      const newUser = await userService.registerUser(req.body);

      return res.status(201).json(newUser);
    },
  };
};

export type UserController = ReturnType<typeof createUserController>;

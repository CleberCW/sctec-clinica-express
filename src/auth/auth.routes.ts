import express, {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { validateBody } from '../@common/validator.middleware.ts';
import { RegisterUserDto } from './dtos/register-user-controller.dto.ts';
import type { UserController } from './auth.controller.ts';

const router = express.Router();

export const createUserRouter = (userController: UserController): Router => {
  const router = express.Router();

  // Middleware de Log local
  const timeLog = (req: Request, res: Response, next: NextFunction) => {
    console.log('Time: ', Date.now());
    next();
  };

  router.use(timeLog);

  // Suas rotas continuam iguaizinhas, mantendo o validateBody!
  router.post(
    '/register',
    validateBody(RegisterUserDto),
    userController.handleRegister, // Nome da função correspondente no seu controller funcional
  );

  return router;
};

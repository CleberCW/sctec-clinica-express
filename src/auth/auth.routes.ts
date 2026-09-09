import express, {
  Router,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import { validateBody } from '../@common/validator.middleware.ts';
import { RegisterUserDto } from './dtos/register-user-controller.dto.ts';
import type { UserController } from './auth.controller.ts';
import { LoginDto } from './dtos/login.dto.ts';
import { authenticate } from '../@common/authenticator.middleware.ts';
import { authorize } from '../@common/authorize.middleware.ts';

export const createUserRouter = (userController: UserController): Router => {
  const router = express.Router();

  const timeLog = (req: Request, res: Response, next: NextFunction) => {
    console.log('Time: ', Date.now());
    next();
  };

  router.use(timeLog);

  router.post(
    '/register',
    authenticate,
    authorize('admin'),
    validateBody(RegisterUserDto),
    userController.handleRegister,
  );

  router.post('/login', validateBody(LoginDto), userController.handleLogin);

  return router;
};

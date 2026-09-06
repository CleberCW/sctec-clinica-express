import express, {
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import * as authController from './auth.controller.js';
import { validateBody } from '../@common/validator.middleware.ts';
import { RegisterUserDto } from './dtos/register.user.dto.ts';

const router = express.Router();

//Testar
const timeLog = (req: Request, res: Response, next: NextFunction) => {
  console.log('Time: ', Date.now());
  next();
};

router.use(timeLog);

router.post(
  '/register',
  validateBody(RegisterUserDto),
  authController.register,
);

export default router;

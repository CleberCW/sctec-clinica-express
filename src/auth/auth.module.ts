import { appDataSource } from '../database.ts';
import { Role } from '../entities/role.entity.ts';
import { User } from '../entities/user.entity.ts';
import { createUserController } from './auth.controller.ts';
import { createUserTypeOrmRepository } from './auth.repository.ts';
import { createUserRouter } from './auth.routes.ts';
import { createUserService } from './auth.service.ts';
import { createRoleTypeOrmRepository } from './roles.repository.ts';

export const createAuthModule = () => {
  const typeormUserRepo = appDataSource.getRepository(User);
  const typeormRoleRepo = appDataSource.getRepository(Role);

  const userRepository = createUserTypeOrmRepository(typeormUserRepo);

  const roleRepository = createRoleTypeOrmRepository(typeormRoleRepo);

  const userService = createUserService(userRepository, roleRepository);

  const userController = createUserController(userService);

  const userRouter = createUserRouter(userController);

  return userRouter;
};

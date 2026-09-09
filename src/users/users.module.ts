import { appDataSource } from '../database/initDatabase.ts';
import { Role } from '../entities/role.entity.ts';
import { User } from '../entities/user.entity.ts';
import { createUserController } from './users.controller.ts';
import { createUserTypeOrmRepository } from './users.repository.ts';
import { createUserRouter } from './users.routes.ts';
import { createUserService } from './users.service.ts';
import { createRoleTypeOrmRepository } from './roles.repository.ts';

export const createUserModule = () => {
  const typeormUserRepo = appDataSource.getRepository(User);
  const typeormRoleRepo = appDataSource.getRepository(Role);

  const userRepository = createUserTypeOrmRepository(typeormUserRepo);

  const roleRepository = createRoleTypeOrmRepository(typeormRoleRepo);

  const userService = createUserService(userRepository, roleRepository);

  const userController = createUserController(userService);

  const userRouter = createUserRouter(userController);

  return userRouter;
};

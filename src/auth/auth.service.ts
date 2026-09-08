import type { UserRepository } from './auth.repository.ts';
import { RegisterUserDto } from './dtos/register-user-controller.dto.ts';
import { compare, genSalt, hash } from 'bcrypt';
import type { RoleRepository } from './roles.repository.ts';
import { AppError } from '../@common/errors/app.error.ts';

export const createUserService = (
  userRepository: UserRepository,
  roleRepository: RoleRepository,
) => {
  return {
    registerUser: async (userData: RegisterUserDto) => {
      const salt = await genSalt(10);
      const hashPassword = await hash(userData.password, salt);

      // Por enquanto está dando a role padrão 'user' para todo usuário criado
      const role = await roleRepository.findByName('user');

      // Arrumar isso depois. Deveria jogar um erro? Ou há outra forma melhor
      if (!role) {
        throw new AppError('Default user role not found', 4904303);
      }

      return userRepository.save({
        ...userData,
        hashedPassword: hashPassword,
        roles: [role],
      });
    },
  };
};

export type UserService = ReturnType<typeof createUserService>;

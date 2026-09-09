import type { UserRepository } from './auth.repository.ts';
import { RegisterUserDto } from './dtos/register-user-controller.dto.ts';
import { compare, genSalt, hash } from 'bcrypt';
import type { RoleRepository } from './roles.repository.ts';
import { AppError } from '../@common/errors/app.error.ts';
import type { LoginDto } from './dtos/login.dto.ts';
import { InvalidCredentialsError } from '../@common/errors/user-not-found.error.ts';
import jwt from 'jsonwebtoken';

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

    loginUser: async (loginData: LoginDto) => {
      const user = await userRepository.getUserByEmail(loginData.email);

      if (!user) {
        throw new InvalidCredentialsError();
      }

      const passwordMatches = await compare(
        loginData.password,
        user.hashedPassword,
      );

      if (!passwordMatches) {
        throw new InvalidCredentialsError();
      }

      console.log(user.roles);
      const payload = {
        email: user.email,
        role: [...user.roles.map((role) => role.name)],
      };
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new AppError('JWT secret não encontrado', 332143);
      }

      const token = jwt.sign(payload, secret, {
        expiresIn: '15m',
      });

      return { 'Access Token': token };
    },
  };
};

export type UserService = ReturnType<typeof createUserService>;

import type { UserRepository } from './users.repository.ts';
import { RegisterUserDto } from './dtos/register-user-controller.dto.ts';
import { compare, hash } from 'bcrypt';
import type { RoleRepository } from './roles.repository.ts';
import type { LoginDto } from './dtos/login.dto.ts';
import { InvalidCredentialsError } from '../@common/errors/user-not-found.error.ts';
import jwt from 'jsonwebtoken';

export const createUserService = (
  userRepository: UserRepository,
  roleRepository: RoleRepository,
) => {
  return {
    registerUser: async (userData: RegisterUserDto) => {
      const hashPassword = await hash(userData.password, 10);

      const role = await roleRepository.findByName('user');

      if (!role) {
        throw new Error('Default user role not found');
      }

      const dbUser = await userRepository.save({
        firstName: userData.firstName,
        lastName: userData.lastName,
        email: userData.email,
        hashedPassword: hashPassword,
        roles: [role],
      });

      return {
        id: dbUser.id,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        email: dbUser.email,
        roles: dbUser.roles,
        createdAt: dbUser.createdAt,
      };
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

      const payload = {
        email: user.email,
        role: [...user.roles.map((role) => role.name)],
      };
      const secret = process.env.JWT_SECRET;

      if (!secret) {
        throw new Error('JWT secret não encontrado');
      }

      const token = jwt.sign(payload, secret, {
        expiresIn: '15m',
      });

      return { 'Access Token': token };
    },

    getUser: async (email: string) => {
      const user = await userRepository.getUserByEmail(email);

      if (!user) {
        return null;
      }

      const { hashedPassword, ...userWithoutPassword } = user;

      return userWithoutPassword;
    },
  };
};

export type UserService = ReturnType<typeof createUserService>;

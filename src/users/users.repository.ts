import { QueryFailedError, type Repository } from 'typeorm';
import type { User } from '../entities/user.entity.ts';
import type { CreateUserRepositoryInput } from './dtos/create-user-repository.dto.ts';
import { EmailAlreadyExistsError } from '../@common/errors/email-already-exists.error.ts';
import { AppError } from '../@common/errors/app.error.ts';
import { UnknownDatabaseError } from '../@common/errors/database.error.ts';

export interface UserRepository {
  save(user: CreateUserRepositoryInput): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
}

export const createUserTypeOrmRepository = (
  typeormRepo: Repository<User>,
): UserRepository => ({
  save: async (user) => {
    try {
      const dbUser = await typeormRepo.save(user);

      return {
        id: dbUser.id,
        firstName: dbUser.firstName,
        lastName: dbUser.lastName,
        email: dbUser.email,
        roles: dbUser.roles,
        createdAt: dbUser.createdAt,
      } as User;
    } catch (error) {
      throw mapDatabaseError(error);
    }
  },

  getUserByEmail: async (email) => {
    try {
      return await typeormRepo.findOne({
        where: {
          email,
        },
        select: {
          id: true,
          firstName: true,
          lastName: true,
          email: true,
          hashedPassword: true,
          createdAt: true,
        },
        relations: {
          roles: true,
        },
      });
    } catch (error) {
      throw mapDatabaseError(error);
    }
  },
});

const mapDatabaseError = (error: unknown): Error => {
  if (error instanceof QueryFailedError) {
    if (error.driverError?.constraint === 'UQ_USER_EMAIL') {
      return new EmailAlreadyExistsError();
    }
  }

  return new UnknownDatabaseError({ cause: error });
};

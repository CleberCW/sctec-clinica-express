import { QueryFailedError, type Repository } from 'typeorm';
import type { User } from '../entities/user.entity.ts';
import type { CreateUserRepositoryInput } from './dtos/create-user-repository.dto.ts';
import { EmailAlreadyExistsError } from '../@common/errors/email-already-exists.error.ts';

export interface UserRepository {
  save(user: CreateUserRepositoryInput): Promise<User>;
  getUserByEmail(email: string): Promise<User | null>;
}

export const createUserTypeOrmRepository = (
  typeormRepo: Repository<User>,
): UserRepository => ({
  save: async (user) => {
    try {
      return await typeormRepo.save(user);
    } catch (error) {
      throw mapDatabaseError(error);
    }
  },

  getUserByEmail: async (email) => {
    try {
      return await typeormRepo.findOne({
        where: {
          email: email,
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
  console.log('ERROR:', error);
  console.log(
    'INSTANCEOF QueryFailedError:',
    error instanceof QueryFailedError,
  );

  if (error instanceof QueryFailedError) {
    if (error.driverError?.constraint === 'UQ_USER_EMAIL') {
      return new EmailAlreadyExistsError();
    }
  }

  return error instanceof Error ? error : new Error('Unknown database error');
};

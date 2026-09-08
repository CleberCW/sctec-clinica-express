import { QueryFailedError, type Repository } from 'typeorm';
import type { User } from '../entities/user.entity.ts';
import type { CreateUserRepositoryInput } from './dtos/create-user-repository.dto.ts';
import { EmailAlreadyExistsError } from '../@common/errors/email-already-exists.error.ts';

export interface UserRepository {
  save(user: CreateUserRepositoryInput): Promise<User>;
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
});

const mapDatabaseError = (error: unknown): Error => {
  console.log('ERROR:', error);
  console.log(
    'INSTANCEOF QueryFailedError:',
    error instanceof QueryFailedError,
  );

  if (error instanceof QueryFailedError) {
    console.log('driverError:', error.driverError);
    console.log('code:', error.driverError?.code);
    console.log('constraint:', error.driverError?.constraint);

    if (error.driverError?.constraint === 'UQ_USER_EMAIL') {
      console.log('MATCHED EMAIL CONSTRAINT');
      return new EmailAlreadyExistsError();
    }
  }

  console.log('RETURNING ORIGINAL ERROR');

  return error instanceof Error ? error : new Error('Unknown database error');
};

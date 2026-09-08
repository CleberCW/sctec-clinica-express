import { QueryFailedError, type Repository } from 'typeorm';
import { EmailAlreadyExistsError } from '../@common/errors/email-already-exists.error.ts';
import type { Role, RoleName } from '../entities/role.entity.ts';

export interface RoleRepository {
  findByName(role: RoleName): Promise<Role | null>;
}

export const createRoleTypeOrmRepository = (
  typeormRepo: Repository<Role>,
): RoleRepository => ({
  findByName: async (role) => {
    try {
      return await typeormRepo.findOne({
        where: {
          name: role,
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

  return error instanceof Error ? error : new Error('Unknown database error');
};

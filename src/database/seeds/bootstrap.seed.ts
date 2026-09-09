import 'dotenv/config';
import { hash } from 'bcrypt';
import { Permission } from '../../entities/permissions.entity.ts';
import { Role } from '../../entities/role.entity.ts';
import { User } from '../../entities/user.entity.ts';
import { appDataSource } from '../initDatabase.ts';

const permissions = [
  'user:create',
  'user:read',
  'user:update',
  'user:delete',

  'role:create',
  'role:read',
  'role:update',
  'role:delete',
];

export async function bootstrap() {
  await appDataSource.initialize();

  try {
    const permissionRepository = appDataSource.getRepository(Permission);
    const roleRepository = appDataSource.getRepository(Role);
    const userRepository = appDataSource.getRepository(User);

    const permissionEntities: Permission[] = [];

    for (const permissionName of permissions) {
      let permission = await permissionRepository.findOne({
        where: {
          name: permissionName,
        },
      });

      if (!permission) {
        permission = permissionRepository.create({
          name: permissionName,
        });

        await permissionRepository.save(permission);
      }

      permissionEntities.push(permission);
    }

    const adminRole = await ensureRole('admin');
    const userRole = await ensureRole('user');
    const ownerRole = await ensureRole('owner');

    adminRole.permissions = permissionEntities;

    userRole.permissions = permissionEntities.filter((permission) =>
      ['user:read'].includes(permission.name),
    );

    ownerRole.permissions = permissionEntities.filter((permission) =>
      ['user:create', 'user:read', 'user:update'].includes(permission.name),
    );

    await roleRepository.save([adminRole, userRole, ownerRole]);

    await ensureAdminUser(adminRole);

    console.log('Bootstrap concluído.');
  } finally {
    await appDataSource.destroy();
  }
}

async function ensureRole(name: 'admin' | 'user' | 'owner') {
  const roleRepository = appDataSource.getRepository(Role);

  let role = await roleRepository.findOne({
    where: { name },
    relations: {
      permissions: true,
    },
  });

  if (!role) {
    role = roleRepository.create({
      name,
      permissions: [],
    });

    await roleRepository.save(role);
  }

  return role;
}

async function ensureAdminUser(adminRole: Role) {
  const userRepository = appDataSource.getRepository(User);

  const email = process.env.INITIAL_ADMIN_EMAIL;
  const password = process.env.INITIAL_ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error(
      'INITIAL_ADMIN_EMAIL e INITIAL_ADMIN_PASSWORD são obrigatórias.',
    );
  }

  const existingUser = await userRepository.findOne({
    where: { email },
    relations: {
      roles: true,
    },
  });

  if (existingUser) {
    console.log(`Usuário ${email} já existe. Nenhuma alteração realizada.`);
    return;
  }

  const hashedPassword = await hash(password, 10);

  const admin = userRepository.create({
    firstName: 'System',
    lastName: 'Administrator',
    email,
    hashedPassword,
    roles: [adminRole],
  });

  await userRepository.save(admin);

  console.log(`Admin inicial criado: ${email}`);
}

bootstrap().catch((error) => {
  console.error('Erro durante bootstrap:', error);
  process.exit(1);
});

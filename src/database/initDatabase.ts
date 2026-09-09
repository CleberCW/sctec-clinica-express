import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DataSource } from 'typeorm';
import { createUserTypeOrmRepository } from '../auth/auth.repository.ts';
import { User } from '../entities/user.entity.ts';
import { Permission } from '../entities/permissions.entity.ts';
import { Role } from '../entities/role.entity.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const appDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

  entities: [User, Role, Permission],
  migrations: [__dirname + '/../sql/migrations/**/*{.js,.ts}'],

  logging: true,
  synchronize: false,
});

export const getRepositories = () => {
  return {
    userRepository: createUserTypeOrmRepository(
      appDataSource.getRepository(User),
    ),
  };
};

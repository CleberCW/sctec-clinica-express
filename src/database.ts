import 'dotenv/config';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { DataSource } from 'typeorm';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export const myDataSource = new DataSource({
  type: 'postgres',
  host: 'localhost',
  port: Number(process.env.POSTGRES_PORT),
  username: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,

  entities: [__dirname + '/entities/**/*{.js,.ts}'],
  migrations: [__dirname + '/../sql/migrations/**/*{.js,.ts}'],

  logging: true,
  synchronize: false,
});

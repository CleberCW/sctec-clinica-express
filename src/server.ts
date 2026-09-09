import 'reflect-metadata';
import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { appDataSource } from './database/initDatabase.ts';
import { errorHandler } from './@common/error-handler.middleware.ts';
import { createAuthModule } from './auth/auth.module.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function main() {
  const app: Express = express();
  app.use(express.json());

  await appDataSource.initialize();

  app.get('/', (req: Request, res: Response) => {
    res.send('Hello World!');
  });
  app.use('/auth', createAuthModule());

  app.use('/public', express.static(path.join(__dirname, '../public')));

  app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    errorHandler(error, req, res, next);
  });

  app.listen(3000);
}

main().catch(console.error);

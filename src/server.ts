import 'reflect-metadata';
import express, {
  type Express,
  type NextFunction,
  type Request,
  type Response,
} from 'express';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { myDataSource } from './database.ts';
import authRouter from './auth/auth.routes.ts';
import { errorHandler } from './@common/error-handler.middleware.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

try {
  await myDataSource.initialize();
  console.log('Data Source has been initialized!');
} catch (error) {
  console.error('Error during Data Source initialization:', error);
}

const app: Express = express();
app.use(express.json());

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!');
});
app.use('/auth', authRouter);

app.use('/public', express.static(path.join(__dirname, '../public')));

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
  errorHandler(error, req, res, next);
});

app.listen(3000);

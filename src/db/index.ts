import { DataSource } from 'typeorm';
import { Call } from './entities/Call';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST!,
  port: parseInt(process.env.DB_PORT!),
  username: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD!,
  database: process.env.DB_NAME!,
  entities: [Call],
  synchronize: false,
  // logging: process.env.NODE_ENV !== 'production',
  migrations: [path.resolve(__dirname, 'migrations', '*.{ts,js}')],
});

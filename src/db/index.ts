import { DataSource } from 'typeorm';
import { Call } from './entities/Call';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Call],
  synchronize: true, // for dev only
  // logging: process.env.NODE_ENV !== 'production',
  migrations: [path.resolve(__dirname, 'migrations', '*.{ts,js}')],

});

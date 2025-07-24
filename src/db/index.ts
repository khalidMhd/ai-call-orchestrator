import { DataSource } from 'typeorm';
import { Call } from './entities/Call';
import * as dotenv from 'dotenv';
dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [Call],
  synchronize: false,
  migrations: ['src/db/migrations/*.ts'],
});

import 'dotenv/config'
import { DataSource } from 'typeorm'
import { Call } from './src/db/entities/Call'

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  username: process.env.DB_USERNAME || 'postgres',
  password: process.env.DB_PASSWORD || 'root',
  database: process.env.DB_NAME || 'ai_calls',
  entities: [Call],
  migrations: ['src/db/migrations/*.ts'],
  synchronize: false,
  logging: false,
})

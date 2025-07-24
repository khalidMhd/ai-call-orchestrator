import { AppDataSource } from './index';

export async function connectDB(): Promise<void> {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');
  } catch (err) {
    console.error('Database connection failed', err);
    process.exit(1);
  }
}

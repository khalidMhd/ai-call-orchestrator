import { AppDataSource } from './index'

export async function connectDB() {
  try {
    await AppDataSource.initialize()
    console.log('✅ Database connected successfully')
  } catch (err) {
    console.error('❌ Database connection failed', err)
  }
}

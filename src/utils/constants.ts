import 'dotenv/config'

export const EXTERNAL_API_URL = process.env.EXTERNAL_API_URL!
export const CALLBACK_URL = process.env.CALLBACK_URL!
export const CALLBACK_SECRET = process.env.CALLBACK_SECRET!
export const MAX_RETRIES = parseInt(process.env.MAX_RETRIES || '3')
export const MAX_IN_PROGRESS = parseInt(process.env.MAX_IN_PROGRESS || '30')
export const REDIS_HOST = process.env.REDIS_HOST || 'localhost'
export const REDIS_PORT = parseInt(process.env.REDIS_PORT || '6379')

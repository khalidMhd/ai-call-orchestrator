import IORedis from 'ioredis'
import { Queue } from 'bullmq'
import { REDIS_HOST, REDIS_PORT } from '../utils/constants'

export const connection = new IORedis({
  maxRetriesPerRequest: null,
  host: REDIS_HOST,
  port: REDIS_PORT,
})


export const callQueue = new Queue('calls', { connection })

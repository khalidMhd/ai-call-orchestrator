import IORedis from 'ioredis'
import { Queue } from 'bullmq'
import { REDIS_HOST, REDIS_PORT } from '../utils/constants'

export const connection = new IORedis({
  maxRetriesPerRequest: null,
  host: REDIS_HOST || 'localhost',
  port: REDIS_PORT || 6379,
  retryStrategy(times) {
    const delay = Math.min(times * 50, 2000);
    return delay; // reconnect delay in ms
  },
})

connection.on('connect', () => console.log('Redis connected'));
connection.on('error', (err) => console.error('Redis error', err.message));

export const callQueue = new Queue('calls', { connection })

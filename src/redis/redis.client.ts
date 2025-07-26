import IORedis from 'ioredis';
import { REDIS_HOST, REDIS_PORT } from '../utils/constants';

export const redis = new IORedis({
   host: REDIS_HOST || 'localhost',
   port: REDIS_PORT || 6379,
  maxRetriesPerRequest: null, 
  retryStrategy(times) {
    return Math.min(times * 50, 2000); 
  },
});


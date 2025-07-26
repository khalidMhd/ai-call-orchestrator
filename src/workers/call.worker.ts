import { Worker } from 'bullmq';
import { connection } from '../queues/call.queue';
import { MAX_RETRIES, MAX_IN_PROGRESS } from '../utils/constants';
import { CallService } from '../services/call.service';
import { callRepository } from '../repositories/call.repository';
import { redis } from '../redis/redis.client';

const callWorker = new Worker(
  'calls',
  async job => {
    await CallService.processCall(job.data.id);
  },
  {
    concurrency: MAX_IN_PROGRESS,
    connection,
    removeOnComplete: { count: 1000 },
    removeOnFail: { count: 1000 },
  }
);

callWorker.on('failed', async (job, err) => {
  if (!job || !job.data?.id) return;

  const call = await callRepository.findById(job.data.id);
  if (!call) return;

  call.attempts = job.attemptsMade ?? 0;
  call.lastError = err.message;

  if (call.attempts >= MAX_RETRIES) {
    call.status = 'FAILED';
    call.endedAt = new Date();
    console.warn(`Max retries reached for call ${call.id}`);
  } else {
    call.status = 'PENDING';
  }

  await callRepository.save(call);

  if (call.payload?.to) {
    await redis.srem('in_flight_phones', call.payload.to);
  }
});

callWorker.on('completed', job => {
  console.log(`Job ${job.id} completed`);
});

export { callWorker };

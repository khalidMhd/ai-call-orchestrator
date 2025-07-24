import { Worker, JobsOptions } from 'bullmq';
import { AppDataSource } from '../db';
import { Call } from '../db/entities/Call';
import { connection } from '../queues/call.queue';
import { MAX_RETRIES, MAX_IN_PROGRESS } from '../utils/constants';

const callWorker = new Worker(
    'calls',
    async job => {
        const repo = AppDataSource.getRepository(Call);
        const call = await repo.findOneBy({ id: job.data.id });

        if (!call) {
            console.warn(`Call not found: ${job.data.id}`);
            return;
        }

        if (call.status !== 'PENDING') {
            console.log(`Call ${call.id} is already being processed or completed.`);
            return;
        }

        call.status = 'IN_PROGRESS';
        call.startedAt = new Date();
        await repo.save(call);

        console.log(` Calling ${call.payload.to} (Mock ID: mock-call-id-${Date.now()})`);

        // Simulate a delay
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Simulate failure to trigger retry
        // throw new Error(' Simulated failure');

        // call.status = 'COMPLETED';
        // call.endedAt = new Date();
        // await repo.save(call);
    },
    {
        concurrency: MAX_IN_PROGRESS,
        connection,
        removeOnComplete: { count: 1000 },
        removeOnFail: { count: 1000 },
    }
);

callWorker.on('failed', async (job, err) => {
    const attemptsMade = job?.attemptsMade ?? 0;
    console.error(` Job ${job?.id} failed on attempt ${attemptsMade + 1}: ${err.message}`);

    const repo = AppDataSource.getRepository(Call);
    const call = await repo.findOneBy({ id: job?.data.id });

    if (!call) return;
    call.attempts = (job?.attemptsMade ?? 0) + 1;
    call.attempts = (job?.attemptsMade ?? 0) + 1;
    call.lastError = err.message;

    if (call.attempts >= MAX_RETRIES) {
        call.status = 'FAILED';
        call.endedAt = new Date();
        console.warn(`❗ Max retry attempts reached for call ${call.id}`);
    } else {
        call.status = 'PENDING'; // Will be retried automatically
    }

    await repo.save(call);
});

callWorker.on('completed', async job => {
    console.log(`✅ Job ${job.id} processed successfully`);
});



export { callWorker };

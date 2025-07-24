import { AppDataSource } from '../db'
import { Call } from '../db/entities/Call'
import { Semaphore } from '../utils/semaphore'
import {
  MAX_RETRIES,
  MAX_IN_PROGRESS,
} from '../utils/constants'

const sem = new Semaphore(MAX_IN_PROGRESS)
const extMap = new Map<string, string>()
export const MAX_PENDING_AGE_MS = 10 * 60 * 1000; // 10 minutes

export async function startWorker() {
  while (true) {
    await sem.acquire()

    const call = await pickPending()
    if (!call) {
      sem.release()
      await sleep(500)
      continue
    }

    console.log(`📞 Picked Call ID: ${call.id} for ${call.payload.to}`)
    handleCall(call)
  }
}

async function pickPending(): Promise<Call | null> {
  return await AppDataSource.manager.transaction(async (m) => {
    const expirationDate = new Date(Date.now() - MAX_PENDING_AGE_MS);

    // Step 1: Expire old PENDING calls
    await m
      .createQueryBuilder()
      .update(Call)
      .set({ status: 'EXPIRED' })
      .where('status = :s', { s: 'PENDING' })
      .andWhere('createdAt < :expiration', { expiration: expirationDate })
      .execute();

    // Step 2: Pick a fresh PENDING call
    const c = await m
      .createQueryBuilder(Call, 'c')
      .setLock('pessimistic_write')
      .where('c.status = :s', { s: 'PENDING' })
      .orderBy('c.createdAt', 'ASC')
      .limit(1)
      .getOne();

    if (!c) return null;

    c.status = 'IN_PROGRESS';
    c.startedAt = new Date();
    await m.save(c);
    return c;
  });
}


async function handleCall(call: Call) {
  try {
    // Mocking external API response instead of real HTTP request
    const res = {
      data: {
        callId: `mock-call-id-${Date.now()}`, // Fake callId
      },
    }

    extMap.set(res.data.callId, call.id)
    console.log(` Mock call started for ${call.payload.to}, Mock Call ID: ${res.data.callId}`)

    // In real scenario, the external service will callback to /callbacks/call-status

  } catch (e: any) {
    console.error('❌ Call error:', e.message)
    await failOrRetry(call, e.message)
  } finally {
    sem.release()
  }
}

async function failOrRetry(call: Call, err: string) {
  const repo = AppDataSource.getRepository(Call)
  call.attempts++
  call.lastError = err

  if (call.attempts >= MAX_RETRIES) {
    call.status = 'FAILED'
    console.warn(` Call ${call.id} failed after ${call.attempts} attempts.`)
  } else {
    call.status = 'PENDING'
    console.log(` Retrying Call ${call.id}, attempt #${call.attempts}`)
  }

  await repo.save(call)
}

function sleep(ms: number) {
  return new Promise((res) => setTimeout(res, ms))
}

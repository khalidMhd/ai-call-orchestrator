import { callRepository } from '../repositories/call.repository';
import { redis } from '../redis/redis.client';
import { sendCallToProvider } from '../utils/external.call.provider';
import { CALLBACK_URL } from '../utils/constants';

const IN_FLIGHT_SET_KEY = 'in_flight_phones';

export class CallService {
  static async processCall(callId: string) {
    const call = await callRepository.findById(callId);
    if (!call) {
      console.warn(`Call not found: ${callId}`);
      return;
    }

    const phone = call.payload.to;

    // Check if phone is already in-flight (processing)
    const isInFlight = await redis.sismember(IN_FLIGHT_SET_KEY, phone);
    if (isInFlight) {
      console.log(`[SKIPPED] Phone ${phone} already in flight, rescheduling call ${call.id}`);
      throw new Error(`Phone ${phone} already in flight`);
    }

    // Mark phone as in-flight
    await redis.sadd(IN_FLIGHT_SET_KEY, phone);

    try {
      call.status = 'IN_PROGRESS';
      call.startedAt = new Date();
      await callRepository.save(call);

      console.log(`Processing call to ${phone}`);

      // Simulate call processing, replace with real logic
      //  await sendCallToProvider(phone, CALLBACK_URL);

      await new Promise(resolve => setTimeout(resolve, 20000)); // 20s simulated call

      const lastDigits: number = Number(phone.slice(-2));
      // Simulate a failure condition
      if (lastDigits % 12 === 0) {
        console.log(`[FAIL] Simulated call failure for ${call.id}`);
        throw new Error('Simulated call failure');
      }

      call.status = 'COMPLETED';
      call.endedAt = new Date();
      await callRepository.save(call);
      console.log(`[COMPLETE] Call ${call.id} to ${phone}`);

    } catch (error) {
      console.error(`[ERROR] Call ${callId} failed with: ${error}`);
      throw error;
    } finally {
      // Remove phone from in-flight
      await redis.srem(IN_FLIGHT_SET_KEY, phone);
    }
  }
}

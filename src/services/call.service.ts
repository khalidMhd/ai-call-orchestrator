import { callRepository } from '../repositories/call.repository';
import { redis } from '../redis/redis.client';

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
      console.log(`Phone ${phone} already in flight, aborting job for call ${callId}`);
      throw new Error(`Phone ${phone} already in flight`);
    }

    // Mark phone as in-flight
    await redis.sadd(IN_FLIGHT_SET_KEY, phone);

    try {
      call.status = 'IN_PROGRESS';
      call.startedAt = new Date();
      await callRepository.save(call);

      console.log(`Processing call to ${phone}...`);

      // Simulate call processing, replace with real logic
      await new Promise(resolve => setTimeout(resolve, 9000));

      // throw new Error('Simulated error during call processing'); // Simulate an error for testing
      
      // call.status = 'COMPLETED';
      // call.endedAt = new Date();
      // await callRepository.save(call);
    } catch (error) {
      console.error(`Error processing call ${callId}`);
      throw error;
    } finally {
      // Remove phone from in-flight
      await redis.srem(IN_FLIGHT_SET_KEY, phone);
    }
  }
}

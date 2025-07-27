import { AppDataSource } from '../src/db/data-source';
import { Call } from '../src/db/entities/Call';
import { callQueue } from '../src/queues/call.queue';

function generatePhoneNumber(index: number): string {
  return `+966000000${index.toString().padStart(3, '0')}`;
}

async function seedCalls() {
  try {
    await AppDataSource.initialize();

    const uniquePhoneNumbers = new Set<string>();

    // Step 1: Create 95 unique phone numbers
    for (let i = 0; i < 95; i++) {
      uniquePhoneNumbers.add(generatePhoneNumber(i));
    }

    // Step 2: Randomly pick 5 numbers to duplicate
    const phoneNumbersArray = Array.from(uniquePhoneNumbers);
    const duplicates: string[] = [];

    while (duplicates.length < 5) {
      const randomIndex = Math.floor(Math.random() * phoneNumbersArray.length);
      const number = phoneNumbersArray[randomIndex];
      if (!duplicates.includes(number)) {
        duplicates.push(number);
      }
    }

    // Step 3: Combine and shuffle
    const finalPhoneNumbers = [...phoneNumbersArray, ...duplicates];

    // Shuffle the final list to avoid duplicates being grouped
    for (let i = finalPhoneNumbers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [finalPhoneNumbers[i], finalPhoneNumbers[j]] = [finalPhoneNumbers[j], finalPhoneNumbers[i]];
    }

    // Step 4: Save to DB and Queue
    for (let i = 0; i < finalPhoneNumbers.length; i++) {
      const phoneNumber = finalPhoneNumbers[i];

      const call = new Call();
      call.payload = {
        to: phoneNumber,
        scriptId: 'script-123',
        metadata: {}
      };
      call.status = 'PENDING';

      console.log(`Seeding call to ${phoneNumber}...`);

      await AppDataSource.manager.save(call);

      await callQueue.add('callJob', { id: call.id }, {
        attempts: 3,
        backoff: { type: 'exponential', delay: 5000 },
        removeOnComplete: true,
        removeOnFail: false,
      });
    }

    console.log('✅ Successfully seeded 100 calls (5 duplicates, 95 unique)');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding calls:', error);
    process.exit(1);
  }
}

seedCalls();

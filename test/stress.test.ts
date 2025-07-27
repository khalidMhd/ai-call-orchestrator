import axios from 'axios';

const createCall = async (phoneNumber: string) => {
  try {
    const response = await axios.post('http://localhost:5000/calls', {
      to: phoneNumber,
      scriptId: 'welcome-flow',
      metadata: { userId: 'abc123' }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

  } catch (error: any) {
    console.error(`Call to ${phoneNumber} failed:`, error.response?.data || error.message);
  }
};


const baseNumber: string = '+9665000000'; // 10 digits, last 2 will be loop/index

const duplicateIndexes: number[] = [20, 21, 25, 40, 43, 48, 71, 90, 91];
const phoneNumbers: string[] = [];

for (let i = 0; i < 100; i++) {
  if (duplicateIndexes.includes(i)) {
    // Duplicate from previous index (or a specific one)
    phoneNumbers.push(phoneNumbers[i - 1]);
  } else {
    // Generate unique number by changing last 2 digits
    const suffix = i.toString().padStart(2, '0'); // '00', '01', ..., '99'
    phoneNumbers.push(`${baseNumber}${suffix}`);
  }
}

// Call all numbers
(async () => {
  for (let i = 0; i < phoneNumbers.length; i++) {
    console.log(`(${i + 1}/100) Calling ${phoneNumbers[i]}`);
    await createCall(phoneNumbers[i]);
  }
})();

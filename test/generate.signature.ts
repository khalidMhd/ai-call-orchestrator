import crypto from 'crypto';
import { CALLBACK_SECRET } from '../src/utils/constants';

const rawBody = JSON.stringify({
  callId: "5574cf22-ccb1-42fb-94d5-8a04335db6b2",
  status: "COMPLETED",
  durationSec: 25,
  completedAt: "2025-07-23T12:00:00Z"
});

const signature = crypto.createHmac('sha256', CALLBACK_SECRET || 'supersecret')
  .update(rawBody)
  .digest('hex');

console.log(signature);

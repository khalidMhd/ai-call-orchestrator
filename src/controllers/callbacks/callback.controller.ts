import { Request, Response } from 'express';
import { AppDataSource } from '../../db';
import { Call } from '../../db/entities/Call';
import crypto from 'crypto';
import { CALLBACK_SECRET } from '../../utils/constants';

function safeCompare(a: string, b: string): boolean {
  try {
    return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
  } catch {
    return false;
  }
}

export const handleCallback = async (req: Request, res: Response) => {
  try {
    const sig = req.headers['x-signature'] as string;
    const rawBody = (req as any).rawBody;

    if (!rawBody || !sig) {
      return res.status(401).json({ error: 'Missing signature or body' });
    }

    const expectedSig = crypto
      .createHmac('sha256', CALLBACK_SECRET || 'supersecret')
      .update(rawBody)
      .digest('hex');

    // if (!safeCompare(sig, expectedSig)) {
    //   return res.status(401).json({ error: 'Invalid signature' });
    // }

    const { callId, status, completedAt } = req.body;
    if (!callId || !status || !completedAt) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const repo = AppDataSource.getRepository(Call);
    const call = await repo.findOneBy({ id: callId });

    if (!call) {
      return res.status(404).json({ error: 'Call not found' });
    }

    call.status = status === 'COMPLETED' ? 'COMPLETED' : 'FAILED';
    call.endedAt = new Date(completedAt);

    await repo.save(call);

    return res.json({ ok: true });
  } catch (error) {
    console.error('Error handling callback:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

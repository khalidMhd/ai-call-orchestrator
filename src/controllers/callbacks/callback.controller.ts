import { Request, Response } from 'express'
import { AppDataSource } from '../../db'
import { Call } from '../../db/entities/Call'
import crypto from 'crypto'
import { CALLBACK_SECRET } from '../../utils/constants'

export const handleCallback = async (req: Request, res: Response) => {
  const sig = req.headers['x-signature'] as string
  const rawBody = (req as any).rawBody

  if (!rawBody || !sig) {
    return res.status(401).json({ error: 'missing signature or body' })
  }

  const hmac = crypto.createHmac('sha256', CALLBACK_SECRET || 'supersecret').update(rawBody).digest('hex')
  // if (sig !== hmac) {
  //   return res.status(401).json({ error: 'invalid signature' })
  // }

  const { callId, status, completedAt } = req.body
  const repo = AppDataSource.getRepository(Call)

  const c = await repo.findOneBy({ id: callId })
  if (!c) return res.status(404).json({ error: 'call not found' })

  c.status = status === 'COMPLETED' ? 'COMPLETED' : 'FAILED'
  c.endedAt = new Date(completedAt)
  await repo.save(c)

  res.json({ ok: true })
}

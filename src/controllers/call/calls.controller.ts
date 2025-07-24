import { Request, Response } from 'express'
import { AppDataSource } from '../../db'
import { Call } from '../../db/entities/Call'
import { callQueue } from '../../queues/call.queue'
import { MAX_RETRIES } from '../../utils/constants';

const repo = () => AppDataSource.getRepository(Call)

export const createCall = async (req: Request, res: Response) => {
  const { to, scriptId, metadata } = req.body
  if (!to || !scriptId) return res.status(400).json({ error: 'required fields missing' })

  const c = repo().create({ payload: { to, scriptId, metadata }, status: 'PENDING', attempts: 0 })
  await repo().save(c)

  await callQueue.add('callJob', { id: c.id }, {
    attempts: MAX_RETRIES,                 // max 3 retries
    backoff: {             // exponential backoff starting with 5s
      type: 'exponential',
      delay: 5000,
    },
    removeOnComplete: 1000,
    removeOnFail: 1000,
  })

  res.status(201).json(c)
}

export const getCall = async (req: Request, res: Response) => {
  const c = await repo().findOneBy({ id: req.params.id })
  if (!c) return res.status(404).json({ error: 'not found' })
  res.json(c)
}

export const updateCall = async (req: Request, res: Response) => {
  const c = await repo().findOneBy({ id: req.params.id })
  if (!c) return res.status(404).json({ error: 'not found' })
  if (c.status !== 'PENDING') return res.status(400).json({ error: 'only PENDING updatable' })

  const { to, scriptId, metadata } = req.body
  if (to) c.payload.to = to
  if (scriptId) c.payload.scriptId = scriptId
  if (metadata) c.payload.metadata = metadata
  await repo().save(c)
  res.json(c)
}

export const listCalls = async (req: Request, res: Response) => {
  const status = req.query.status as string
  const page = Number(req.query.page) || 1
  const limit = Number(req.query.limit) || 10

  const whereClause = status ? { status: status as Call['status'] } : {}

  const [data, total] = await repo().findAndCount({
    where: whereClause,
    skip: (page - 1) * limit,
    take: limit,
    order: { createdAt: 'DESC' },
  })
  res.json({ data, total, page, limit })
}

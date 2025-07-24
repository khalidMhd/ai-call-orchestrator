import { Request, Response } from 'express';
import { AppDataSource } from '../../db';
import { Call } from '../../db/entities/Call';
import { callQueue } from '../../queues/call.queue';
import { MAX_RETRIES } from '../../utils/constants';

const repo = () => AppDataSource.getRepository(Call);

export const createCall = async (req: Request, res: Response) => {
  try {
    const { to, scriptId, metadata } = req.body;
    if (!to || !scriptId) {
      return res.status(400).json({ error: 'Required fields "to" and "scriptId" are missing' });
    }

    const callRepo = repo();
    const c = callRepo.create({
      payload: { to, scriptId, metadata },
      status: 'PENDING',
      attempts: 0,
    });
    await callRepo.save(c);

    await callQueue.add(
      'callJob',
      { id: c.id },
      {
        attempts: MAX_RETRIES,
        backoff: {
          type: 'exponential',
          delay: 5000,
        },
        removeOnComplete: 1000,
        removeOnFail: 1000,
      }
    );

    return res.status(201).json(c);
  } catch (error) {
    console.error('Error creating call:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const getCall = async (req: Request, res: Response) => {
  try {
    const callRepo = repo();
    const c = await callRepo.findOneBy({ id: req.params.id });

    if (!c) {
      return res.status(404).json({ error: 'Call not found' });
    }

    return res.json(c);
  } catch (error) {
    console.error('Error fetching call:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateCall = async (req: Request, res: Response) => {
  try {
    const callRepo = repo();
    const c = await callRepo.findOneBy({ id: req.params.id });

    if (!c) {
      return res.status(404).json({ error: 'Call not found' });
    }

    if (c.status !== 'PENDING') {
      return res.status(400).json({ error: 'Only PENDING calls can be updated' });
    }

    const { to, scriptId, metadata } = req.body;
    if (to) c.payload.to = to;
    if (scriptId) c.payload.scriptId = scriptId;
    if (metadata) c.payload.metadata = metadata;

    await callRepo.save(c);
    return res.json(c);
  } catch (error) {
    console.error('Error updating call:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const listCalls = async (req: Request, res: Response) => {
  try {
    const status = req.query.status as string;
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;

    const whereClause = status ? { status: status as Call['status'] } : {};
    const callRepo = repo();

    const [data, total] = await callRepo.findAndCount({
      where: whereClause,
      skip: (page - 1) * limit,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return res.json({ data, total, page, limit });
  } catch (error) {
    console.error('Error listing calls:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

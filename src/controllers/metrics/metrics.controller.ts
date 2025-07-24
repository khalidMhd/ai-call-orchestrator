import { Request, Response } from 'express';
import { AppDataSource } from '../../db';
import { Call } from '../../db/entities/Call';

const repo = () => AppDataSource.getRepository(Call);

export const getMetrics = async (req: Request, res: Response) => {
  try {
    const rows = await repo()
      .createQueryBuilder('c')
      .select('c.status', 'status')
      .addSelect('COUNT(*)', 'count')
      .groupBy('c.status')
      .getRawMany();

    const obj: Record<string, number> = {};

    rows.forEach(r => {
      if (r.status && r.count !== undefined) {
        obj[r.status] = Number(r.count);
      }
    });

    return res.json(obj);
  } catch (error) {
    console.error('Error fetching call metrics:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

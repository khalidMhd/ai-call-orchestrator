import { Request, Response } from 'express'
import { AppDataSource } from '../../db'
import { Call } from '../../db/entities/Call'

const repo = () => AppDataSource.getRepository(Call)

export const getMetrics = async (req: Request, res: Response) => {
  const rows = await repo()
    .createQueryBuilder('c')
    .select('status', 'status')
    .addSelect('COUNT(*)', 'count')
    .groupBy('status')
    .getRawMany()
  const obj: Record<string, number> = {}
  rows.forEach(r => (obj[r.status] = Number(r.count)))
  res.json(obj)
}

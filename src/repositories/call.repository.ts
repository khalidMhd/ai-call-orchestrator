import { AppDataSource } from '../db';
import { Call } from '../db/entities/Call';

const repo = () => AppDataSource.getRepository(Call);

export const callRepository = {
  findById: async (id: string) => {
    return await repo().findOneBy({ id });
  },

  save: async (call: Call) => {
    return await repo().save(call);
  },
};

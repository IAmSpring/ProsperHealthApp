import { z } from 'zod';
import { procedure, router } from '../trpc';

export const clinicianRouter = router({
  list: procedure.query(async ({ ctx }) => {
    return await ctx.prisma.clinician.findMany({
      orderBy: { name: 'asc' },
    });
  }),

  getById: procedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.clinician.findUnique({
        where: { id: input },
        include: { appointments: true },
      });
    }),
}); 
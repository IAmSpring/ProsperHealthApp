import { z } from 'zod';
import { procedure, router } from '../trpc';

export const clientRouter = router({
  create: procedure
    .input(
      z.object({
        name: z.string(),
        email: z.string().email(),
        age: z.number().int(),
        neurotype: z.enum(['Autistic', 'ADHD', 'Both']),
      })
    )
    .mutation(async ({ input, ctx }) => {
      return await ctx.prisma.client.create({
        data: input,
      });
    }),

  list: procedure.query(async ({ ctx }) => {
    return await ctx.prisma.client.findMany({
      orderBy: { createdAt: 'desc' },
    });
  }),

  getById: procedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.client.findUnique({
        where: { id: input },
        include: { appointments: true },
      });
    }),
}); 
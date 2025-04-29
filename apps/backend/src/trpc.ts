import { initTRPC } from '@trpc/server';
import { db } from '@prosper/db';

// Initialize context for tRPC
export const createContext = () => {
  return {
    prisma: db,
  };
};

export type Context = Awaited<ReturnType<typeof createContext>>;

// Initialize tRPC
const t = initTRPC.context<Context>().create();

// Export tRPC base procedures and router
export const router = t.router;
export const procedure = t.procedure; 
import { router } from '../trpc';
import { clientRouter } from './client';
import { clinicianRouter } from './clinician';
import { appointmentRouter } from './appointment';

export const appRouter = router({
  client: clientRouter,
  clinician: clinicianRouter,
  appointment: appointmentRouter,
});

// Export type definition of API
export type AppRouter = typeof appRouter; 
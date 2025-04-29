import { z } from 'zod';
import { procedure, router } from '../trpc';

export const appointmentRouter = router({
  create: procedure
    .input(
      z.object({
        date: z.string(),
        clientId: z.string(),
        clinicianId: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log('Creating appointment with input:', {
        ...input,
        date: input.date
      });
      
      try {
        // Convert string date to Date object
        const dateObj = new Date(input.date);
        console.log('Converted date:', dateObj, 'is valid:', !isNaN(dateObj.getTime()));
        
        const result = await ctx.prisma.appointment.create({
          data: {
            clientId: input.clientId,
            clinicianId: input.clinicianId,
            date: dateObj  // Pass the converted Date object
          },
        });
        
        console.log('Appointment created successfully:', {
          ...result,
          date: result.date.toISOString()
        });
        
        return result;
      } catch (error) {
        console.error('Error creating appointment:', error);
        throw error;
      }
    }),

  listByClientId: procedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      console.log('Fetching appointments for client:', input);
      
      try {
        const appointments = await ctx.prisma.appointment.findMany({
          where: { clientId: input },
          include: { clinician: true },
          orderBy: { date: 'asc' },
        });
        console.log(`Found ${appointments.length} appointments for client ${input}`);
        return appointments;
      } catch (error) {
        console.error('Error fetching appointments by client ID:', error);
        throw error;
      }
    }),

  listByClinicianId: procedure
    .input(z.string())
    .query(async ({ input, ctx }) => {
      return await ctx.prisma.appointment.findMany({
        where: { clinicianId: input },
        include: { client: true },
        orderBy: { date: 'asc' },
      });
    }),

  delete: procedure
    .input(
      z.object({
        id: z.string(),
      })
    )
    .mutation(async ({ input, ctx }) => {
      console.log('Deleting appointment with ID:', input.id);
      
      try {
        const result = await ctx.prisma.appointment.delete({
          where: { id: input.id },
        });
        console.log('Appointment deleted successfully:', {
          ...result,
          date: result.date.toISOString()
        });
        return result;
      } catch (error) {
        console.error('Error deleting appointment:', error);
        throw error;
      }
    }),
}); 
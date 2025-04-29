import { fastify } from 'fastify';
import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastifyCors from '@fastify/cors';
import { createContext } from './trpc';
import { appRouter } from './routers';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const server = fastify({
  maxParamLength: 5000,
});

// Register CORS
server.register(fastifyCors, {
  origin: ['http://localhost:3000'],
  credentials: true,
});

// Register tRPC plugin
server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: {
    router: appRouter,
    createContext,
  },
});

// Health check endpoint
server.get('/health', async () => {
  return { status: 'ok' };
});

const start = async () => {
  try {
    console.log('🔌 Connecting to database...');
    console.log(`🔑 Using database URL: ${process.env.DATABASE_URL?.substring(0, 40)}...`);
    
    console.log('🚀 Starting Fastify server...');
    await server.listen({
      port: Number(process.env.PORT) || 3001,
      host: process.env.HOST || '0.0.0.0',
    });
    
    const address = server.server.address();
    const port = typeof address === 'object' ? address?.port : address;
    
    console.log(`✅ Server started successfully!`);
    console.log(`🔗 Server listening at http://${process.env.HOST || '0.0.0.0'}:${port}`);
    console.log(`📡 tRPC endpoint available at http://${process.env.HOST || '0.0.0.0'}:${port}/trpc`);
    console.log(`🛂 CORS configured for origins: http://localhost:3000`);
    console.log(`🔰 Health check endpoint: http://${process.env.HOST || '0.0.0.0'}:${port}/health`);
    console.log(`🦸 Using Supabase URL: ${process.env.SUPABASE_URL}`);
    console.log(`✅ Backend is now ready to accept connections`);
  } catch (err) {
    console.error('❌ Error starting server:', err);
    process.exit(1);
  }
};

start(); 
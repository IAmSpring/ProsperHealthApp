import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { trpc, trpcClient } from './utils/trpc';
import App from './App';
import './index.css';

console.log('🚀 Starting Prosper Health web application...');
console.log('🔗 Connecting to backend at: http://localhost:3001/trpc');

// Create a query client for React Query
const queryClient = new QueryClient();

console.log('✅ tRPC client initialized');
console.log('🌐 Rendering React application');

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <trpc.Provider client={trpcClient} queryClient={queryClient}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <App />
        </BrowserRouter>
      </QueryClientProvider>
    </trpc.Provider>
  </React.StrictMode>,
);

console.log('✨ Web application rendered and ready'); 